import { useEffect, useRef, useState } from "react";
import {
  listenConversations,
  listenMessages,
  sendMessage,
  markConversationRead,
} from "../../services/messages";
import Loader from "../../components/common/Loader";
import "./Messages.css";

const decodeJwt = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(
          (c) =>
            "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)
        )
        .join("")
    );

    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};

const formatTime = (timestamp) => {
  if (!timestamp?.toDate) return "";

  const date = timestamp.toDate();

  let hours = date.getHours();
  const minutes = date.getMinutes();

  const ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12 || 12;

  return `${hours}:${minutes < 10 ? "0" + minutes : minutes} ${ampm}`;
};

const Messages = () => {
  const token = localStorage.getItem("partnerToken");
  const decodedToken = token ? decodeJwt(token) : null;

  const astrologerId = decodedToken?.id;

  const [conversations, setConversations] = useState([]);
  const [loadingList, setLoadingList] = useState(true);

  const [activeId, setActiveId] = useState(null);
  const [messages, setMessages] = useState([]);

  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);

  const bottomRef = useRef(null);

  const activeConversation =
    conversations.find((conversation) => conversation.id === activeId) ||
    null;

  useEffect(() => {
    if (!astrologerId) {
      setLoadingList(false);
      return;
    }

    const unsubscribe = listenConversations(
      astrologerId,
      (rows) => {
        setConversations(rows);
        setLoadingList(false);

        setActiveId((currentId) => {
          if (
            currentId &&
            rows.some((conversation) => conversation.id === currentId)
          ) {
            return currentId;
          }

          return rows[0]?.id || null;
        });
      }
    );

    return () => {
      unsubscribe?.();
    };
  }, [astrologerId]);

  useEffect(() => {
    if (!activeId) {
      setMessages([]);
      return;
    }

    const unsubscribe = listenMessages(
      activeId,
      (rows) => {
        setMessages(rows);
      }
    );

    if (astrologerId) {
      markConversationRead(activeId, astrologerId).catch((error) => {
        console.error("Mark conversation read error:", error);
      });
    }

    return () => {
      unsubscribe?.();
    };
  }, [activeId, astrologerId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages]);

  const handleSend = async () => {
    if (!draft.trim() || !activeConversation || !astrologerId || sending) {
      return;
    }

    try {
      setSending(true);

      const text = draft.trim();

      await sendMessage({
        conversationId: activeConversation.id,
        senderId: astrologerId,
        otherId: activeConversation.otherId,
        text,
      });

      setDraft("");
    } catch (error) {
      console.error("Send message error:", error);
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

  if (!astrologerId) {
    return <Loader label="Loading chat..." />;
  }

  if (loadingList) {
    return <Loader label="Loading conversations..." />;
  }

  return (
    <div className="messages-page">
      <aside className="chat-list">
        <div className="chat-list-header">
          <div>
            <h2>Chats</h2>
            <span>
              {conversations.length}{" "}
              {conversations.length === 1 ? "conversation" : "conversations"}
            </span>
          </div>
        </div>

        <div className="chat-list-content">
          {conversations.length === 0 ? (
            <div className="chat-list-empty">
              <div className="empty-icon">💬</div>
              <h3>No conversations yet</h3>
              <p>When a customer starts a chat, it will appear here.</p>
            </div>
          ) : (
            conversations.map((conversation) => (
              <button
                key={conversation.id}
                type="button"
                className={`chat-list-item ${
                  conversation.id === activeId ? "active" : ""
                }`}
                onClick={() => setActiveId(conversation.id)}
              >
                <div className="avatar">
                  {conversation.otherImageUrl ? (
                    <img
                      src={conversation.otherImageUrl}
                      alt={conversation.otherName}
                    />
                  ) : (
                    (conversation.otherName || "U")
                      .slice(0, 2)
                      .toUpperCase()
                  )}
                </div>

                <div className="chat-list-item-text">
                  <div className="chat-list-item-top">
                    <div className="chat-list-item-name">
                      {conversation.otherName}
                    </div>
                  </div>

                  <div className="chat-list-item-preview">
                    {conversation.lastMessageText || "No messages yet"}
                  </div>
                </div>

                {conversation.unreadCount > 0 && (
                  <div className="unread-badge">
                    {conversation.unreadCount}
                  </div>
                )}
              </button>
            ))
          )}
        </div>
      </aside>

      <section className="chat-thread">
        {!activeConversation ? (
          <div className="chat-thread-empty">
            <div className="empty-thread-icon">💬</div>
            <h3>Select a conversation</h3>
            <p>Select a chat from the left to view messages.</p>
          </div>
        ) : (
          <>
            <div className="thread-header">
              <div className="avatar">
                {activeConversation.otherImageUrl ? (
                  <img
                    src={activeConversation.otherImageUrl}
                    alt={activeConversation.otherName}
                  />
                ) : (
                  (activeConversation.otherName || "U")
                    .slice(0, 2)
                    .toUpperCase()
                )}
              </div>

              <div>
                <div className="thread-header-name">
                  {activeConversation.otherName}
                </div>

                <div className="thread-header-status">
                  Customer
                </div>
              </div>
            </div>

            <div className="thread-body">
              {messages.length === 0 ? (
                <div className="messages-empty">
                  <div className="empty-thread-icon">💬</div>
                  <h3>No messages yet</h3>
                  <p>Send a message to start the conversation.</p>
                </div>
              ) : (
                messages.map((message) => {
                  const isMine =
                    message.senderId === astrologerId;

                  return (
                    <div
                      key={message.id}
                      className={`bubble-row ${
                        isMine ? "mine" : "theirs"
                      }`}
                    >
                      <div className="bubble">
                        <span className="bubble-text">
                          {message.text}
                        </span>

                        <span className="bubble-time">
                          {formatTime(message.createdAt)}
                        </span>
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
                placeholder="Type a message..."
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={handleKeyDown}
                disabled={sending}
              />

              <button
                type="button"
                onClick={handleSend}
                disabled={!draft.trim() || sending}
              >
                {sending ? "Sending..." : "Send"}
              </button>
            </div>
          </>
        )}
      </section>
    </div>
  );
};

export default Messages;