import React, { useEffect, useRef, useState } from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  addDoc,
} from "firebase/firestore";
import { db, auth } from "../../firebase/firebase";
import Loader from "../../components/common/Loader";
import "./Messages.css";

const decodeJwt = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};

const formatTime = (timestamp) => {
  if (!timestamp) return "";
  try {
    let dateObj;
    if (timestamp?.toDate && typeof timestamp.toDate === "function") {
      dateObj = timestamp.toDate();
    } else if (timestamp?.seconds) {
      dateObj = new Date(timestamp.seconds * 1000);
    } else {
      dateObj = new Date(timestamp);
    }
    if (isNaN(dateObj.getTime())) return "";
    return dateObj.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
};

const getInitials = (name) => {
  if (!name) return "U";
  const parts = name.trim().split(" ");
  if (parts.length > 1) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return parts[0][0].toUpperCase();
};

const colorSchemes = [
  { bg: "#EEF2FF", text: "#4F46E5" },
  { bg: "#FDF2F8", text: "#DB2777" },
  { bg: "#FFF7ED", text: "#EA580C" },
  { bg: "#ECFDF5", text: "#059669" },
  { bg: "#F5F3FF", text: "#7C3AED" },
];

const Messages = () => {
  const [partnerId, setPartnerId] = useState("");
  const [conversations, setConversations] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [activeId, setActiveId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const bottomRef = useRef(null);

  useEffect(() => {
    let currentId = auth.currentUser?.uid || "";
    if (!currentId) {
      const token = localStorage.getItem("partnerToken");
      const decoded = token ? decodeJwt(token) : null;
      currentId = decoded?.id || decoded?._id || decoded?.uid || "";
    }
    if (!currentId) {
      currentId = localStorage.getItem("partnerId") || localStorage.getItem("userId") || "";
    }
    if (!currentId) {
      const stored = localStorage.getItem("user");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          currentId = parsed._id || parsed.id || parsed.uid || "";
        } catch {}
      }
    }
    setPartnerId(currentId);
  }, []);

  useEffect(() => {
    if (!partnerId) {
      setLoadingList(false);
      return;
    }

    setLoadingList(true);

    const q = query(
      collection(db, "conversations"),
      where("participants", "array-contains", partnerId)
    );

    const unsubscribe = onSnapshot(
      q,
      async (snapshot) => {
        if (!snapshot || snapshot.empty) {
          setConversations([]);
          setLoadingList(false);
          return;
        }

        const fetchedList = await Promise.all(
          snapshot.docs.map(async (docSnap, index) => {
            const data = docSnap.data();
            const participants = data.participants || [];
            const participantsInfo = data.participantsInfo || {};

            let otherUserId = participants.find((id) => id !== partnerId);
            if (!otherUserId) {
              const infoKeys = Object.keys(participantsInfo);
              otherUserId = infoKeys.find((k) => k !== partnerId) || "";
            }
            if (!otherUserId && docSnap.id.includes("_")) {
              const parts = docSnap.id.split("_");
              otherUserId = parts.find((p) => p !== partnerId) || parts[0];
            }

            const partnerInfo = participantsInfo[otherUserId] || {};
            let clientName = partnerInfo.name || partnerInfo.displayName || null;
            let avatarUrl = partnerInfo.avatar || partnerInfo.photoURL || partnerInfo.image || null;

            if (!clientName && otherUserId) {
              try {
                const userDoc = await getDoc(doc(db, "users", otherUserId));
                if (userDoc.exists()) {
                  const uData = userDoc.data();
                  clientName = uData?.name || uData?.displayName || uData?.fullName;
                  avatarUrl = avatarUrl || uData?.avatar || uData?.photoURL || uData?.profileImage;
                }
              } catch {}
            }

            if (!clientName) {
              clientName = `User (${otherUserId ? otherUserId.substring(0, 6) : docSnap.id.substring(0, 6)}...)`;
            }

            let lastMsgText = "No messages yet";
            let lastSenderId = "";
            let lastMsgAtSeconds = 0;
            let rawTimestamp = data.lastMessage?.lastMessageAt || data.lastMessageAt || data.createdAt;

            if (data.lastMessage) {
              if (typeof data.lastMessage === "string") {
                lastMsgText = data.lastMessage;
              } else if (typeof data.lastMessage === "object") {
                lastMsgText = data.lastMessage.text || "No message text";
                lastSenderId = data.lastMessage.senderId || "";
                if (data.lastMessage.lastMessageAt) {
                  const val = data.lastMessage.lastMessageAt;
                  if (typeof val?.toDate === "function") {
                    lastMsgAtSeconds = val.toDate().getTime() / 1000;
                  } else if (val?.seconds) {
                    lastMsgAtSeconds = val.seconds;
                  } else {
                    lastMsgAtSeconds = new Date(val).getTime() / 1000;
                  }
                }
              }
            }

            let unread = 0;
            let lastReadSeconds = 0;

            if (partnerId && data.lastReadAt && typeof data.lastReadAt === "object") {
              if (data.lastReadAt[partnerId]) {
                const readVal = data.lastReadAt[partnerId];
                if (typeof readVal?.toDate === "function") {
                  lastReadSeconds = readVal.toDate().getTime() / 1000;
                } else if (readVal?.seconds) {
                  lastReadSeconds = readVal.seconds;
                } else {
                  lastReadSeconds = new Date(readVal).getTime() / 1000;
                }
              }
            }

            if (data.unreadCount !== undefined && data.unreadCount !== null) {
              if (typeof data.unreadCount === "number") {
                unread = data.unreadCount;
              } else if (typeof data.unreadCount === "object") {
                if (partnerId && data.unreadCount[partnerId] !== undefined) {
                  unread = Number(data.unreadCount[partnerId]);
                } else {
                  const otherKey = Object.keys(data.unreadCount).find((k) => k !== partnerId);
                  unread = otherKey ? Number(data.unreadCount[otherKey]) : 0;
                }
              }
            } else if (partnerId && lastSenderId === partnerId) {
              unread = 0;
            } else if (lastMsgAtSeconds > 0 && lastReadSeconds >= lastMsgAtSeconds) {
              unread = 0;
            } else if (lastSenderId && lastSenderId !== partnerId) {
              if (lastMsgAtSeconds === 0 || lastMsgAtSeconds > lastReadSeconds) {
                unread = 1;
              }
            }

            return {
              id: docSnap.id,
              userId: partnerId,
              partnerId: otherUserId,
              conversationId: docSnap.id,
              clientName,
              avatarUrl,
              lastMessage: lastMsgText,
              time: formatTime(rawTimestamp),
              rawTimestamp: lastMsgAtSeconds || 0,
              unreadCount: unread,
              colorScheme: colorSchemes[index % colorSchemes.length],
            };
          })
        );

        fetchedList.sort((a, b) => b.rawTimestamp - a.rawTimestamp);

        setConversations(fetchedList);
        setLoadingList(false);

        setActiveId((prevId) => {
          if (prevId && fetchedList.some((c) => c.id === prevId)) {
            return prevId;
          }
          return fetchedList[0]?.id || null;
        });
      },
      (error) => {
        console.error("Conversations listener error:", error);
        setLoadingList(false);
      }
    );

    return () => unsubscribe();
  }, [partnerId]);

  const activeConversation =
    conversations.find((conv) => conv.id === activeId) || null;

  useEffect(() => {
    if (!activeId) {
      setMessages([]);
      return;
    }

    const messagesQuery = query(
      collection(db, "conversations", activeId, "messages"),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      if (!snapshot) return;
      const loadedMessages = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      setMessages(loadedMessages);
    });

    if (partnerId) {
      const convRef = doc(db, "conversations", activeId);
      updateDoc(convRef, {
        [`lastReadAt.${partnerId}`]: serverTimestamp(),
        [`unreadCount.${partnerId}`]: 0,
      }).catch(() => {});
    }

    return () => unsubscribe();
  }, [activeId, partnerId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!draft.trim() || !activeConversation || !partnerId || sending) return;

    try {
      setSending(true);
      const text = draft.trim();
      setDraft("");

      const timestamp = serverTimestamp();

      await addDoc(collection(db, "conversations", activeConversation.id, "messages"), {
        conversationId: activeConversation.id,
        senderId: partnerId,
        text,
        createdAt: timestamp,
      });

      const convRef = doc(db, "conversations", activeConversation.id);
      const otherId = activeConversation.partnerId;

      const updatePayload = {
        lastMessage: {
          text,
          senderId: partnerId,
          lastMessageAt: timestamp,
        },
        lastMessageAt: timestamp,
        [`lastReadAt.${partnerId}`]: timestamp,
        [`unreadCount.${partnerId}`]: 0,
      };

      if (otherId) {
        const currentUnread = activeConversation.unreadCount || 0;
        updatePayload[`unreadCount.${otherId}`] = currentUnread + 1;
      }

      await setDoc(convRef, updatePayload, { merge: true });
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  const filteredConversations = conversations.filter((c) =>
    c.clientName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!partnerId) {
    return <Loader label="Authenticating session..." />;
  }

  if (loadingList) {
    return <Loader label="Loading conversations..." />;
  }

  return (
    <div className="messages-page">
      <aside className="chat-list">
        <div className="chat-list-header">
          <div className="portal-badge">PARTNER PORTAL</div>
          <div className="header-title-row">
            <h2>COMMUNICATIONS</h2>
            <span className="count-pill">{conversations.length}</span>
          </div>
          <div className="chat-search-box">
            <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" strokeWidth="2" fill="none">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="chat-list-content">
          {filteredConversations.length === 0 ? (
            <div className="chat-list-empty">
              <div className="empty-icon">💬</div>
              <h3>No Active Conversations</h3>
              <p>Active client communications will appear here.</p>
            </div>
          ) : (
            filteredConversations.map((conversation) => {
              const isActive = conversation.id === activeId;
              return (
                <button
                  key={conversation.id}
                  type="button"
                  className={`chat-list-item ${isActive ? "active" : ""}`}
                  onClick={() => setActiveId(conversation.id)}
                >
                  <div className="avatar-wrapper">
                    <div
                      className="avatar"
                      style={{
                        backgroundColor: conversation.colorScheme.bg,
                        color: conversation.colorScheme.text,
                        borderColor: `${conversation.colorScheme.text}30`,
                      }}
                    >
                      {conversation.avatarUrl ? (
                        <img src={conversation.avatarUrl} alt={conversation.clientName} />
                      ) : (
                        getInitials(conversation.clientName)
                      )}
                    </div>
                    <span className="online-indicator" />
                  </div>

                  <div className="chat-list-item-text">
                    <div className="chat-list-item-top">
                      <span className={`chat-list-item-name ${conversation.unreadCount > 0 ? "unread" : ""}`}>
                        {conversation.clientName}
                      </span>
                      <span className={`chat-list-item-time ${conversation.unreadCount > 0 ? "unread" : ""}`}>
                        {conversation.time}
                      </span>
                    </div>

                    <div className="tag-badge">CONSULTATION</div>

                    <div className={`chat-list-item-preview ${conversation.unreadCount > 0 ? "unread" : ""}`}>
                      {conversation.lastMessage}
                    </div>
                  </div>

                  {conversation.unreadCount > 0 && (
                    <div className="unread-badge">{conversation.unreadCount}</div>
                  )}
                </button>
              );
            })
          )}
        </div>
      </aside>

      <section className="chat-thread">
        {!activeConversation ? (
          <div className="chat-thread-empty">
            <div className="empty-thread-icon">✦</div>
            <h3>Select a conversation</h3>
            <p>Select a consultation from the portal to view live messages.</p>
          </div>
        ) : (
          <>
            <div className="thread-header">
              <div className="avatar-wrapper">
                <div
                  className="avatar"
                  style={{
                    backgroundColor: activeConversation.colorScheme.bg,
                    color: activeConversation.colorScheme.text,
                  }}
                >
                  {activeConversation.avatarUrl ? (
                    <img src={activeConversation.avatarUrl} alt={activeConversation.clientName} />
                  ) : (
                    getInitials(activeConversation.clientName)
                  )}
                </div>
                <span className="online-indicator" />
              </div>

              <div className="thread-header-details">
                <div className="thread-header-name">{activeConversation.clientName}</div>
                <div className="thread-header-status">
                  <span className="status-dot"></span> Active Consultation
                </div>
              </div>
            </div>

            <div className="thread-body">
              {messages.length === 0 ? (
                <div className="messages-empty">
                  <div className="empty-thread-icon">✨</div>
                  <h3>No messages yet</h3>
                  <p>Send a message to start this consultation session.</p>
                </div>
              ) : (
                messages.map((message) => {
                  const isMine = message.senderId === partnerId;
                  return (
                    <div key={message.id} className={`bubble-row ${isMine ? "mine" : "theirs"}`}>
                      <div className="bubble">
                        <span className="bubble-text">{message.text}</span>
                        <span className="bubble-time">{formatTime(message.createdAt)}</span>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={bottomRef} />
            </div>

            <div className="thread-input">
              <input
                type="text"
                placeholder="Type your message..."
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={sending}
              />
              <button
                type="button"
                onClick={handleSend}
                disabled={!draft.trim() || sending}
              >
                {sending ? "..." : "Send"}
              </button>
            </div>
          </>
        )}
      </section>
    </div>
  );
};

export default Messages;