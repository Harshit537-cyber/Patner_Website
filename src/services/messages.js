import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  doc,
  updateDoc,
  serverTimestamp,
  increment,
} from "firebase/firestore";
import { db } from "../firebase/firebase";

export const listenConversations = (astrologerId, onChange) => {
  const q = query(
  collection(db, "conversations"),
  orderBy("lastMessageAt", "desc")
);

  return onSnapshot(q, (snapshot) => {
    const rows = snapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      const otherId = (data.participants || []).find((id) => id !== astrologerId);
      const otherInfo = data.participantsInfo?.[otherId] || {};

      return {
        id: docSnap.id,
        otherId,
        otherName: otherInfo.name || "User",
        otherImageUrl: otherInfo.imageUrl || null,
        lastMessageText: data.lastMessage?.text || "",
        lastMessageAt: data.lastMessageAt || null,
        unreadCount: data.unreadCount?.[astrologerId] || 0,
      };
    });
    onChange(rows);
  });
};

// Live-subscribes to messages inside one conversation, oldest first.
// Returns an unsubscribe function - call it on unmount / conversation switch.
export const listenMessages = (conversationId, onChange) => {
  const q = query(
    collection(db, "conversations", conversationId, "messages"),
    orderBy("createdAt", "asc")
  );

  return onSnapshot(q, (snapshot) => {
    onChange(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
};

// Sends a text message as the astrologer and updates the conversation summary.
export const sendMessage = async ({ conversationId, senderId, otherId, text }) => {
  const trimmed = text.trim();
  if (!trimmed) return;

  await addDoc(collection(db, "conversations", conversationId, "messages"), {
    senderId,
    text: trimmed,
    type: "text",
    createdAt: serverTimestamp(),
    readBy: [senderId],
  });

  await updateDoc(doc(db, "conversations", conversationId), {
    lastMessage: { senderId, text: trimmed },
    lastMessageAt: serverTimestamp(),
    [`unreadCount.${otherId}`]: increment(1),
    [`unreadCount.${senderId}`]: 0,
  });
};

// Marks a conversation as read by the astrologer (clears the unread badge).
export const markConversationRead = async (conversationId, astrologerId) => {
  await updateDoc(doc(db, "conversations", conversationId), {
    [`unreadCount.${astrologerId}`]: 0,
    [`lastReadAt.${astrologerId}`]: serverTimestamp(),
  });
};