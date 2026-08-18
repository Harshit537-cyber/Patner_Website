import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import "./Tickets.css";

const Tickets = () => {
  const navigate = useNavigate();

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    subject: "",
    description: "",
  });

  const getTickets = async () => {
    try {
      setLoading(true);

      const response = await api.get("/tickets/my-tickets");

      console.log("Tickets API response:", response);

      if (response?.success) {
        setTickets(response.tickets || []);
      } else {
        setTickets(response?.tickets || []);
      }
    } catch (error) {
      console.error("Get tickets error:", error);
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTickets();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateTicket = async (e) => {
    e.preventDefault();

    if (!formData.subject.trim() || !formData.description.trim()) {
      alert("Please enter subject and description.");
      return;
    }

    try {
      setSubmitting(true);

      const response = await api.post("/tickets/create", {
        subject: formData.subject.trim(),
        description: formData.description.trim(),
      });

      console.log("Create ticket response:", response);

      if (response?.success) {
        alert("Ticket created successfully.");

        setFormData({
          subject: "",
          description: "",
        });

        setShowForm(false);

        await getTickets();
      } else {
        alert(response?.message || "Failed to create ticket.");
      }
    } catch (error) {
      console.error("Create ticket error:", error);

      alert(
        error?.message ||
          "Something went wrong while creating ticket."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusClass = (status) => {
    const value = status?.toLowerCase();

    if (value === "open") return "ticket-status open";
    if (value === "resolved") return "ticket-status resolved";
    if (value === "closed") return "ticket-status closed";
    if (value === "in progress") return "ticket-status progress";
    if (value === "pending") return "ticket-status pending";

    return "ticket-status";
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="tickets-page">
      <div className="tickets-header">
        <div>
          <h1>My Tickets</h1>
          <p>Manage your support tickets and requests.</p>
        </div>

        <button
          className="create-ticket-btn"
          onClick={() => setShowForm((prev) => !prev)}
        >
          {showForm ? "Close Form" : "+ Raise New Ticket"}
        </button>
      </div>

      {showForm && (
        <div className="ticket-form-card">
          <h2>Raise New Ticket</h2>

          <form onSubmit={handleCreateTicket}>
            <div className="form-group">
              <label>Subject</label>

              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Enter ticket subject"
                required
              />
            </div>

            <div className="form-group">
              <label>Description</label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your issue..."
                rows="5"
                required
              />
            </div>

            <button
              type="submit"
              className="submit-ticket-btn"
              disabled={submitting}
            >
              {submitting ? "Creating..." : "Create Ticket"}
            </button>
          </form>
        </div>
      )}

      <div className="tickets-card">
        <div className="tickets-card-header">
          <h2>All Tickets</h2>

          <span>
            {loading ? "Loading..." : `${tickets.length} Tickets`}
          </span>
        </div>

        {loading ? (
          <div className="tickets-loading">
            Loading tickets...
          </div>
        ) : tickets.length === 0 ? (
          <div className="no-tickets">
            <div className="no-tickets-icon">🎫</div>

            <h3>No Tickets Found</h3>

            <p>
              You haven't raised any support tickets yet.
            </p>

            <button
              className="create-ticket-btn"
              onClick={() => setShowForm(true)}
            >
              Raise Your First Ticket
            </button>
          </div>
        ) : (
          <div className="tickets-list">
            {tickets.map((ticket) => (
              <div
                className="ticket-item"
                key={ticket._id}
                onClick={() =>
                  navigate(
                    `/dashboard/tickets/${ticket._id}`
                  )
                }
              >
                <div className="ticket-main">
                  <div className="ticket-icon">🎫</div>

                  <div className="ticket-content">
                    <h3>
                      {ticket.subject || "Untitled Ticket"}
                    </h3>

                    <p>
                      {ticket.description ||
                        "No description available."}
                    </p>

                    <div className="ticket-meta">
                      <span className="ticket-date">
                        {formatDate(ticket.createdAt)}
                      </span>

                      {ticket.category && (
                        <span className="ticket-category">
                          {ticket.category}
                        </span>
                      )}

                      {ticket.priority && (
                        <span className="ticket-priority">
                          {ticket.priority}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="ticket-right">
                  <span
                    className={getStatusClass(
                      ticket.status
                    )}
                  >
                    {ticket.status || "Pending"}
                  </span>

                  <span className="view-ticket">
                    View Details →
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Tickets;