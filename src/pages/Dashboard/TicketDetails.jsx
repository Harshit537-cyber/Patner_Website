import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../services/api";
import "./TicketDetails.css";

const TicketDetails = () => {
  const { ticketId } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getTicketDetails = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(`/tickets/${ticketId}`);

      console.log("Ticket details API response:", response);

      if (response?.success && response?.ticket) {
        setTicket(response.ticket);
      } else if (response?.ticket) {
        setTicket(response.ticket);
      } else {
        setError(
          response?.message || "Ticket details not found."
        );
      }
    } catch (err) {
      console.error("Get ticket details error:", err);

      setError(
        err?.message || "Unable to load ticket details."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (ticketId) {
      getTicketDetails();
    }
  }, [ticketId]);

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatDateTime = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusClass = (status) => {
    const value = status?.toLowerCase();

    if (value === "open") {
      return "ticket-detail-status open";
    }

    if (value === "resolved") {
      return "ticket-detail-status resolved";
    }

    if (value === "closed") {
      return "ticket-detail-status closed";
    }

    if (value === "in progress") {
      return "ticket-detail-status progress";
    }

    if (value === "pending") {
      return "ticket-detail-status pending";
    }

    return "ticket-detail-status";
  };

  if (loading) {
    return (
      <div className="ticket-details-page">
        <div className="ticket-details-loading">
          Loading ticket details...
        </div>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="ticket-details-page">
        <div className="ticket-details-error">
          <div className="error-icon">🎫</div>

          <h2>Ticket Not Found</h2>

          <p>
            {error || "This ticket could not be found."}
          </p>

          <button
            className="back-ticket-btn"
            onClick={() =>
              navigate("/dashboard/tickets")
            }
          >
            ← Back to Tickets
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="ticket-details-page">
      <div className="ticket-details-header">
        <button
          className="back-ticket-btn"
          onClick={() =>
            navigate("/dashboard/tickets")
          }
        >
          ← Back to Tickets
        </button>
      </div>

      <div className="ticket-details-card">
        <div className="ticket-details-top">
          <div className="ticket-details-title">
            <div className="ticket-details-icon">
              🎫
            </div>

            <div>
              <h1>
                {ticket.subject || "Untitled Ticket"}
              </h1>

              <p>
                Ticket ID: {ticket._id || ticketId}
              </p>
            </div>
          </div>

          <span
            className={getStatusClass(ticket.status)}
          >
            {ticket.status || "Pending"}
          </span>
        </div>

        <div className="ticket-details-divider" />

        <div className="ticket-details-section">
          <h2>Description</h2>

          <div className="ticket-description">
            {ticket.description ||
              "No description available."}
          </div>
        </div>

        <div className="ticket-details-info">
          <div className="ticket-info-box">
            <span>Created</span>

            <strong>
              {formatDateTime(ticket.createdAt)}
            </strong>
          </div>

          <div className="ticket-info-box">
            <span>Last Updated</span>

            <strong>
              {formatDateTime(ticket.updatedAt)}
            </strong>
          </div>

          <div className="ticket-info-box">
            <span>Category</span>

            <strong>
              {ticket.category || "-"}
            </strong>
          </div>

          <div className="ticket-info-box">
            <span>Priority</span>

            <strong>
              {ticket.priority || "-"}
            </strong>
          </div>
        </div>

        {ticket.adminResponse && (
          <>
            <div className="ticket-details-divider" />

            <div className="ticket-details-section">
              <h2>Support Response</h2>

              <div className="ticket-response">
                {ticket.adminResponse}
              </div>
            </div>
          </>
        )}

        {ticket.reply && (
          <>
            <div className="ticket-details-divider" />

            <div className="ticket-details-section">
              <h2>Support Reply</h2>

              <div className="ticket-response">
                {ticket.reply}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TicketDetails;