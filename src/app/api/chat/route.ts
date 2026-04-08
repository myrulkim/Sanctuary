import { streamText } from "ai";
import { createGroq } from "@ai-sdk/groq";

export const runtime = "edge";

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

const SYSTEM_PROMPT = `You are Sanctuary, a warm and empathetic AI companion. You are NOT a therapist or medical professional. You are a caring friend who listens deeply and offers comfort.

Guidelines:
- Respond with genuine warmth and understanding
- Validate the user's feelings before offering perspective
- Use gentle, conversational language — never clinical or robotic
- Keep check-in responses concise (2-3 sentences). For longer conversations, you can elaborate more (3-5 sentences)
- If someone expresses serious distress or mentions self-harm, gently suggest professional support resources
- Use occasional emoji to feel approachable 💛
- Never be dismissive, judgmental, or prescriptive
- Remember: you're a supportive friend, not an advice machine
- Acknowledge that all emotions are valid
- When appropriate, ask gentle follow-up questions to help the user reflect
- Match the user's energy — if they're brief, be brief. If they want to talk, engage fully`;

export async function POST(req: Request) {
  try {
    const { messages, mood } = await req.json();

    // Add mood context to the system prompt if available
    let contextualPrompt = SYSTEM_PROMPT;
    if (mood) {
      const moodDescriptions: Record<string, string> = {
        radiant: "absolutely amazing and full of energy",
        happy: "content and peaceful",
        neutral: "somewhere in the middle — neither great nor bad",
        sad: "down and blue",
        stressed: "overwhelmed and anxious",
      };
      contextualPrompt += `\n\nThe user has indicated they are currently feeling ${moodDescriptions[mood] || mood}. Be mindful of this emotional state in your response.`;
    }

    const result = streamText({
      model: groq("llama-3.3-70b-versatile"),
      system: contextualPrompt,
      messages,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
