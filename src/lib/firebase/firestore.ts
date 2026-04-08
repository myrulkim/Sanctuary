import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "./config";
import { MoodEntry, MoodType } from "@/lib/types";

// ─── Mood CRUD ──────────────────────────────────────────────

export async function saveMoodEntry(
  userId: string,
  mood: MoodType,
  moodScore: number,
  reflection: string,
  aiResponse: string
): Promise<string> {
  const moodsRef = collection(db, "users", userId, "moods");
  const today = new Date().toISOString().split("T")[0];

  const docRef = await addDoc(moodsRef, {
    mood,
    moodScore,
    reflection,
    aiResponse,
    date: today,
    createdAt: serverTimestamp(),
  });

  return docRef.id;
}

export async function getTodayMood(
  userId: string
): Promise<MoodEntry | null> {
  const today = new Date().toISOString().split("T")[0];
  const moodsRef = collection(db, "users", userId, "moods");
  const q = query(
    moodsRef,
    where("date", "==", today),
    orderBy("createdAt", "desc"),
    limit(1)
  );

  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;

  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() } as MoodEntry;
}

export async function getWeeklyMoods(
  userId: string
): Promise<MoodEntry[]> {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const moodsRef = collection(db, "users", userId, "moods");
  const q = query(
    moodsRef,
    where("createdAt", ">=", Timestamp.fromDate(sevenDaysAgo)),
    orderBy("createdAt", "asc")
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as MoodEntry[];
}

export async function getRecentMoods(
  userId: string,
  count: number = 5
): Promise<MoodEntry[]> {
  const moodsRef = collection(db, "users", userId, "moods");
  const q = query(moodsRef, orderBy("createdAt", "desc"), limit(count));

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as MoodEntry[];
}

// ─── Manual Diary CRUD ──────────────────────────────────────

export async function saveDiaryEntry(
  userId: string,
  content: string,
  title?: string
): Promise<string> {
  const diaryRef = collection(db, "users", userId, "diaries");
  const today = new Date().toISOString().split("T")[0];

  const docRef = await addDoc(diaryRef, {
    title: title || "",
    content,
    date: today,
    createdAt: serverTimestamp(),
  });

  return docRef.id;
}

export async function getDiaryEntries(
  userId: string,
  count: number = 100
): Promise<any[]> {
  const diaryRef = collection(db, "users", userId, "diaries");
  const q = query(diaryRef, orderBy("createdAt", "desc"), limit(count));

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

export async function updateDiaryEntry(
  userId: string,
  diaryId: string,
  content: string
): Promise<void> {
  const diaryDocRef = doc(db, "users", userId, "diaries", diaryId);
  await updateDoc(diaryDocRef, {
    content,
    updatedAt: serverTimestamp(),
  });
}

// ─── Chat Messages ──────────────────────────────────────────

export async function saveChatMessage(
  userId: string,
  role: "user" | "assistant",
  content: string,
  sessionId: string,
  moodContext?: MoodType
): Promise<string> {
  const messagesRef = collection(db, "users", userId, "conversations");
  const docRef = await addDoc(messagesRef, {
    role,
    content,
    sessionId: sessionId || "default",
    moodContext: moodContext || null,
    createdAt: serverTimestamp(),
  });

  return docRef.id;
}

export async function getChatHistory(
  userId: string,
  sessionId?: string,
  count: number = 50
): Promise<Array<{ id: string; role: "user" | "assistant"; content: string }>> {
  const messagesRef = collection(db, "users", userId, "conversations");
  
  // If we have a sessionId, we filter by it. To avoid index issues, we sort locally.
  const q = sessionId 
    ? query(messagesRef, where("sessionId", "==", sessionId), limit(count))
    : query(messagesRef, orderBy("createdAt", "desc"), limit(count));

  const snapshot = await getDocs(q);
  const messages = snapshot.docs.map((doc) => ({
    id: doc.id,
    role: doc.data().role,
    content: doc.data().content,
    createdAt: doc.data().createdAt?.toDate() || new Date(),
  }));

  // Sort locally by createdAt asc
  return messages.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
}

/**
 * Gets unique chat sessions (first message of each conversation)
 */
export async function getChatSessions(userId: string): Promise<any[]> {
  const messagesRef = collection(db, "users", userId, "conversations");
  // Remove orderBy to avoid index requirement, we sort locally
  const q = query(messagesRef, where("role", "==", "user"));
  
  const snapshot = await getDocs(q);
  const sessionsMap = new Map();
  
  snapshot.docs.forEach(doc => {
    const data = doc.data();
    if (data.sessionId) {
      const existing = sessionsMap.get(data.sessionId);
      const createdAt = data.createdAt?.toDate() || new Date();
      
      // We want the OLDEST message to get the "start" of the session, 
      // but the NEWEST session at the top of the list.
      if (!existing || createdAt < existing.createdAt) {
        sessionsMap.set(data.sessionId, {
          id: data.sessionId,
          content: data.content,
          createdAt: createdAt,
        });
      }
    }
  });
  
  return Array.from(sessionsMap.values())
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}
