import { useEffect, useState } from "react";
import EmptyState from "../../components/common/EmptyState";
import Loader from "../../components/common/Loader";
import {
  getClientLogs,
  getPartnerBookingRequests,
  getPartnerAcceptedBookings,
  getPartnerRejectedBookings,
  respondToBookingRequest,
} from "../../services/consultations";

const filters = [
  { label: "All", value: "all" },
  { label: "Completed", value: "completed" },
  { label: "Scheduled", value: "scheduled" },
  { label: "Accepted", value: "accepted" },
  { label: "Rejected", value: "rejected" },
];

const statusStyles = {
  scheduled: {
    background: "rgba(243, 235, 250, 0.9)",
    color: "#633593",
    border: "1px solid rgba(196, 157, 221, 0.4)",
  },
  completed: {
    background: "rgba(232, 246, 238, 0.9)",
    color: "#2e7d52",
    border: "1px solid rgba(132, 196, 161, 0.4)",
  },
  accepted: {
    background: "rgba(232, 241, 2ff, 0.9)",
    color: "#4169a1",
    border: "1px solid rgba(143, 178, 222, 0.4)",
  },
  rejected: {
    background: "rgba(253, 234, 234, 0.9)",
    color: "#b34b4b",
    border: "1px solid rgba(222, 153, 153, 0.4)",
  },
  pending: {
    background: "rgba(255, 244, 223, 0.9)",
    color: "#a56b00",
    border: "1px solid rgba(224, 182, 103, 0.4)",
  },
};

const paymentStyles = {
  pending: {
    background: "#fff4df",
    color: "#a56b00",
  },
  paid: {
    background: "#e8f6ee",
    color: "#2e7d52",
  },
  completed: {
    background: "#e8f6ee",
    color: "#2e7d52",
  },
  failed: {
    background: "#fdeaea",
    color: "#b34b4b",
  },
};

const Consultations = () => {
  const [consultations, setConsultations] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  const extractClientLogs = (response) => {
    if (Array.isArray(response?.data?.all)) return response.data.all;
    if (Array.isArray(response?.data)) return response.data;
    if (Array.isArray(response)) return response;
    return [];
  };

  const extractBookings = (response) => {
    if (Array.isArray(response?.data)) return response.data;
    if (Array.isArray(response?.data?.data)) return response.data.data;
    if (Array.isArray(response)) return response;
    return [];
  };

  const fetchAllConsultations = async () => {
    try {
      setLoading(true);
      const response = await getClientLogs();
      setConsultations(extractClientLogs(response));
    } catch (error) {
      console.error("Client logs API error:", error);
      setConsultations([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchScheduledConsultations = async () => {
    try {
      setLoading(true);
      const response = await getPartnerBookingRequests();
      setConsultations(extractBookings(response));
    } catch (error) {
      console.error("Scheduled bookings API error:", error);
      setConsultations([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAcceptedConsultations = async () => {
    try {
      setLoading(true);
      const response = await getPartnerAcceptedBookings();
      setConsultations(extractBookings(response));
    } catch (error) {
      console.error("Accepted bookings API error:", error);
      setConsultations([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchRejectedConsultations = async () => {
    try {
      setLoading(true);
      const response = await getPartnerRejectedBookings();
      setConsultations(extractBookings(response));
    } catch (error) {
      console.error("Rejected bookings API error:", error);
      setConsultations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllConsultations();
  }, []);

  const handleFilterChange = async (value) => {
    if (loading) return;
    setFilter(value);
    if (value === "scheduled") {
      await fetchScheduledConsultations();
      return;
    }
    if (value === "accepted") {
      await fetchAcceptedConsultations();
      return;
    }
    if (value === "rejected") {
      await fetchRejectedConsultations();
      return;
    }
    await fetchAllConsultations();
  };

  const handleAccept = async (booking) => {
    const bookingId = booking?._id || booking?.bookingId;
    if (!bookingId) return;
    try {
      setActionLoading(bookingId);
      await respondToBookingRequest(bookingId, "accepted");
      setConsultations((prev) =>
        prev.filter((item) => (item?._id || item?.bookingId) !== bookingId)
      );
    } catch (error) {
      console.error("Accept booking error:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (booking) => {
    const bookingId = booking?._id || booking?.bookingId;
    if (!bookingId) return;
    try {
      setActionLoading(bookingId);
      await respondToBookingRequest(bookingId, "rejected");
      setConsultations((prev) =>
        prev.filter((item) => (item?._id || item?.bookingId) !== bookingId)
      );
    } catch (error) {
      console.error("Reject booking error:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const getStatus = (consultation) => {
    return String(consultation?.status || "scheduled").toLowerCase();
  };

  const getPaymentStatus = (consultation) => {
    return String(consultation?.paymentStatus || "pending").toLowerCase();
  };

  const formatDate = (date) => {
    if (!date) return "-";
    const parsedDate = new Date(date);
    if (Number.isNaN(parsedDate.getTime())) return date;
    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (date) => {
    if (!date) return "-";
    const parsedDate = new Date(date);
    if (Number.isNaN(parsedDate.getTime())) return "-";
    return parsedDate.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getModeIcon = (mode) => {
    const value = String(mode || "").toLowerCase();
    if (value.includes("video")) return "◉";
    if (value.includes("voice") || value.includes("call")) return "◌";
    return "✦";
  };

  const filteredConsultations = consultations.filter((consultation) => {
    const status = getStatus(consultation);
    if (filter === "all") return true;
    if (filter === "completed") return status === "completed";
    if (filter === "scheduled") return true;
    if (filter === "accepted") return status === "accepted";
    if (filter === "rejected") return status === "rejected";
    return false;
  });

  const isScheduledView = filter === "scheduled";

  return (
    <div
      className="page-card astro-container-glow"
      style={{
        background: "linear-gradient(135deg, #ffffff 0%, #fcf9ff 100%)",
        border: "1px solid #e7deed",
        borderRadius: "24px",
        padding: "28px 26px",
        boxShadow: "0 14px 40px rgba(99, 53, 147, 0.08)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div className="ambient-orbs-container">
        <div className="floating-astro-orb orb-1"></div>
        <div className="floating-astro-orb orb-2"></div>
        <div className="floating-astro-orb orb-3"></div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "18px",
          marginBottom: "28px",
          flexWrap: "wrap",
          position: "relative",
          zIndex: 2,
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div
              className="astro-icon-pulse"
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "14px",
                background: "linear-gradient(135deg, #633593, #8b5fb3)",
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "20px",
                fontWeight: 700,
                boxShadow: "0 6px 16px rgba(99, 53, 147, 0.25)",
              }}
            >
              ✦
            </div>

            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: "20px",
                  fontWeight: 800,
                  color: "#40364a",
                  letterSpacing: "-0.3px",
                }}
              >
                Cosmic Consultations
              </h2>

              <p
                style={{
                  margin: "4px 0 0",
                  fontSize: "13px",
                  color: "#8c8296",
                  fontWeight: 500,
                }}
              >
                Track celestial bookings and client alignments
              </p>
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
            padding: "5px",
            background: "rgba(250, 248, 252, 0.8)",
            border: "1px solid #eee7f2",
            borderRadius: "12px",
            flexWrap: "wrap",
            backdropFilter: "blur(8px)",
          }}
        >
          {filters.map((item) => {
            const active = filter === item.value;

            return (
              <button
                key={item.value}
                type="button"
                onClick={() => handleFilterChange(item.value)}
                disabled={loading}
                className={active ? "filter-btn-active" : "filter-btn-idle"}
                style={{
                  border: active
                    ? "1px solid #d8c2e7"
                    : "1px solid transparent",
                  background: active
                    ? "linear-gradient(135deg, #ffffff, #f7f1fc)"
                    : "transparent",
                  color: active ? "#633593" : "#746d7a",
                  padding: "8px 14px",
                  borderRadius: "9px",
                  fontSize: "13px",
                  fontWeight: active ? 700 : 500,
                  cursor: loading ? "wait" : "pointer",
                  transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                  boxShadow: active
                    ? "0 4px 12px rgba(99, 53, 147, 0.12)"
                    : "none",
                }}
              >
                {loading && active ? "Aligning..." : item.label}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ position: "relative", zIndex: 2 }}>
        {loading ? (
          <div style={{ padding: "40px 0" }}>
            <Loader
              label={
                filter === "scheduled"
                  ? "Aligning scheduled constellations..."
                  : filter === "completed"
                    ? "Gathering past star-paths..."
                    : "Reading cosmic frequencies..."
              }
            />
          </div>
        ) : filteredConsultations.length === 0 ? (
          <div style={{ padding: "20px 0" }}>
            <EmptyState
              title="No constellations found"
              description={
                filter === "all"
                  ? "No consultations are currently in your orbit."
                  : `No ${filter} consultations were detected.`
              }
            />
          </div>
        ) : isScheduledView ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fill, minmax(min(100%, 360px), 1fr))",
              gap: "18px",
              alignItems: "start",
            }}
          >
            {filteredConsultations.map((consultation, index) => {
              const status = getStatus(consultation);
              const paymentStatus = getPaymentStatus(consultation);

              const bookingKey =
                consultation?._id || consultation?.bookingId || index;

              const isActionLoading = actionLoading === bookingKey;

              const customerName =
                consultation?.user?.name ||
                consultation?.client?.name ||
                "Unknown Soul";

              const mobile =
                consultation?.user?.mobile ||
                consultation?.client?.mobile ||
                "-";

              return (
                <div
                  key={bookingKey}
                  className="scheduled-card stellar-card-hover"
                  style={{
                    position: "relative",
                    overflow: "hidden",
                    background: "rgba(255, 255, 255, 0.95)",
                    border: "1px solid #eae1ef",
                    borderRadius: "18px",
                    padding: "20px",
                    boxShadow: "0 8px 24px rgba(73, 48, 96, 0.04)",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <div
                    className="card-top-beam"
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: "4px",
                      background:
                        status === "pending"
                          ? "linear-gradient(90deg, #d4af37, #f3e5ab, #d4af37)"
                          : "linear-gradient(90deg, #633593, #b98fdv, #8b5fb3)",
                      backgroundSize: "200% 100%",
                    }}
                  />

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "10px",
                      marginBottom: "16px",
                      paddingTop: "2px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        minWidth: 0,
                      }}
                    >
                      {consultation?.user?.profilePic ? (
                        <img
                          src={consultation.user.profilePic}
                          alt={customerName}
                          style={{
                            width: "48px",
                            height: "48px",
                            borderRadius: "14px",
                            objectFit: "cover",
                            border: "2px solid #f3ebfa",
                            flexShrink: 0,
                            boxShadow: "0 4px 10px rgba(99,53,147,0.1)",
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: "48px",
                            height: "48px",
                            borderRadius: "14px",
                            background:
                              "linear-gradient(135deg, #f3ebfa, #e1cff0)",
                            color: "#633593",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "18px",
                            fontWeight: 800,
                            flexShrink: 0,
                            boxShadow: "0 4px 10px rgba(99,53,147,0.1)",
                          }}
                        >
                          {customerName.charAt(0).toUpperCase()}
                        </div>
                      )}

                      <div style={{ minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: "15px",
                            fontWeight: 700,
                            color: "#3d3246",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {customerName}
                        </div>

                        <div
                          style={{
                            marginTop: "3px",
                            fontSize: "12px",
                            color: "#8c8296",
                            fontWeight: 500,
                          }}
                        >
                          {mobile}
                        </div>
                      </div>
                    </div>

                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "6px 12px",
                        borderRadius: "20px",
                        fontSize: "11px",
                        fontWeight: 700,
                        textTransform: "capitalize",
                        whiteSpace: "nowrap",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.02)",
                        ...(statusStyles[status] || statusStyles.scheduled),
                      }}
                    >
                      <span
                        style={{
                          width: "6px",
                          height: "6px",
                          borderRadius: "50%",
                          background: "currentColor",
                        }}
                      />
                      {status}
                    </span>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1.3fr 0.8fr 0.7fr",
                      gap: "8px",
                      marginBottom: "12px",
                    }}
                  >
                    <div className="booking-info-box">
                      <div className="consultation-label">DATE</div>
                      <div className="consultation-value">
                        {formatDate(consultation?.date)}
                      </div>
                    </div>

                    <div className="booking-info-box">
                      <div className="consultation-label">TIME</div>
                      <div className="consultation-value">
                        {consultation?.timeSlot ||
                          formatTime(consultation?.date)}
                      </div>
                    </div>

                    <div className="booking-info-box">
                      <div className="consultation-label">DURATION</div>
                      <div className="consultation-value">
                        {consultation?.duration
                          ? `${consultation.duration}m`
                          : "-"}
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "10px",
                      padding: "11px 14px",
                      borderRadius: "12px",
                      background: "linear-gradient(135deg, #faf7fc, #f5eefa)",
                      border: "1px solid #eee5f5",
                      marginBottom: "12px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        minWidth: 0,
                      }}
                    >
                      <div
                        style={{
                          width: "34px",
                          height: "34px",
                          borderRadius: "10px",
                          background: "#ffffff",
                          color: "#633593",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "16px",
                          boxShadow: "0 2px 8px rgba(99, 53, 147, 0.08)",
                          flexShrink: 0,
                        }}
                      >
                        {getModeIcon(consultation?.mode)}
                      </div>

                      <div>
                        <div className="consultation-label">ORACLE MODE</div>
                        <div
                          style={{
                            fontSize: "13px",
                            fontWeight: 700,
                            color: "#4a3f52",
                          }}
                        >
                          {consultation?.mode || "-"}
                        </div>
                      </div>
                    </div>

                    <div style={{ textAlign: "right" }}>
                      <div className="consultation-label">ENERGY / MIN</div>
                      <div
                        style={{
                          fontSize: "13px",
                          fontWeight: 700,
                          color: "#633593",
                        }}
                      >
                        ₹{consultation?.ratePerMinute ?? 0}
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "8px",
                      marginBottom: "12px",
                    }}
                  >
                    <div className="booking-info-box">
                      <div className="consultation-label">TOTAL EXCHANGE</div>
                      <div
                        style={{
                          fontSize: "15px",
                          fontWeight: 800,
                          color: "#633593",
                        }}
                      >
                        ₹{consultation?.totalFee ?? 0}
                      </div>
                    </div>

                    <div className="booking-info-box">
                      <div className="consultation-label">OFFERING STATUS</div>
                      <span
                        style={{
                          display: "inline-flex",
                          padding: "4px 10px",
                          borderRadius: "12px",
                          fontSize: "11px",
                          fontWeight: 700,
                          textTransform: "capitalize",
                          marginTop: "2px",
                          ...(paymentStyles[paymentStatus] ||
                            paymentStyles.pending),
                        }}
                      >
                        {paymentStatus}
                      </span>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "10px",
                      padding: "10px 12px",
                      borderRadius: "10px",
                      background: "#faf8fc",
                      border: "1px solid #eee7f2",
                      marginBottom: status === "pending" ? "14px" : 0,
                    }}
                  >
                    <div>
                      <div className="consultation-label">START REALM</div>
                      <div className="consultation-small-value">
                        {formatTime(consultation?.startTime)}
                      </div>
                    </div>

                    <div
                      style={{
                        flex: 1,
                        height: "1px",
                        background: "linear-gradient(90deg, transparent, #dcd0e5, transparent)",
                      }}
                    />

                    <div style={{ textAlign: "right" }}>
                      <div className="consultation-label">END REALM</div>
                      <div className="consultation-small-value">
                        {formatTime(consultation?.endTime)}
                      </div>
                    </div>
                  </div>

                  {status === "pending" && (
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "10px",
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => handleAccept(consultation)}
                        disabled={isActionLoading}
                        className="accept-btn"
                        style={{
                          border: "none",
                          borderRadius: "11px",
                          padding: "10px 12px",
                          background:
                            "linear-gradient(135deg, #347c55, #245e3f)",
                          color: "#ffffff",
                          fontSize: "13px",
                          fontWeight: 700,
                          cursor: isActionLoading ? "wait" : "pointer",
                          boxShadow: "0 4px 14px rgba(46, 125, 82, 0.2)",
                          transition: "all 0.2s ease",
                        }}
                      >
                        {isActionLoading ? "Aligning..." : "✓ Accept Alignment"}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleReject(consultation)}
                        disabled={isActionLoading}
                        className="reject-btn"
                        style={{
                          border: "1px solid #f2d4d4",
                          borderRadius: "11px",
                          padding: "10px 12px",
                          background: "#fff9f9",
                          color: "#b34b4b",
                          fontSize: "13px",
                          fontWeight: 700,
                          cursor: isActionLoading ? "wait" : "pointer",
                          transition: "all 0.2s ease",
                        }}
                      >
                        {isActionLoading ? "Aligning..." : "✕ Decline"}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div
            style={{
              width: "100%",
              overflowX: "auto",
              background: "rgba(255, 255, 255, 0.8)",
              borderRadius: "16px",
              border: "1px solid #eee7f2",
              backdropFilter: "blur(10px)",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                minWidth: "850px",
              }}
            >
              <thead>
                <tr>
                  {[
                    "SEEKER",
                    "MODE",
                    "DATE & TIME",
                    "DURATION",
                    "RATING",
                    "EXCHANGE",
                    "STATUS",
                  ].map((heading) => (
                    <th
                      key={heading}
                      style={{
                        textAlign: "left",
                        padding: "16px 16px 14px",
                        borderBottom: "1px solid #e4dce9",
                        color: "#8c8296",
                        fontSize: "12px",
                        fontWeight: 700,
                        letterSpacing: "0.5px",
                        whiteSpace: "nowrap",
                        background: "rgba(250, 247, 252, 0.5)",
                      }}
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {filteredConsultations.map((consultation, index) => {
                  const status = getStatus(consultation);

                  return (
                    <tr
                      key={consultation?.bookingId || consultation?._id || index}
                      className="table-row-hover"
                      style={{ transition: "background 0.2s ease" }}
                    >
                      <td className="table-cell customer-cell">
                        {consultation?.client?.name ||
                          consultation?.customer ||
                          consultation?.customerName ||
                          consultation?.user?.name ||
                          "-"}
                      </td>

                      <td className="table-cell">
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                          }}
                        >
                          <span style={{ color: "#633593" }}>
                            {getModeIcon(consultation?.mode)}
                          </span>
                          {consultation?.mode || consultation?.type || "-"}
                        </span>
                      </td>

                      <td className="table-cell">
                        {consultation?.lastConsultation
                          ? formatDate(consultation.lastConsultation)
                          : consultation?.date
                            ? formatDate(consultation.date)
                            : "-"}
                      </td>

                      <td className="table-cell">
                        {consultation?.duration
                          ? `${consultation.duration}m`
                          : consultation?.durationText || "-"}
                      </td>

                      <td
                        className="table-cell"
                        style={{
                          color: "#d89b00",
                          fontWeight: 700,
                        }}
                      >
                        ★ {consultation?.rating ?? 0}
                      </td>

                      <td
                        className="table-cell"
                        style={{
                          color: "#633593",
                          fontWeight: 700,
                        }}
                      >
                        ₹
                        {consultation?.totalFee ??
                          consultation?.amount ??
                          0}
                      </td>

                      <td className="table-cell">
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            padding: "6px 12px",
                            borderRadius: "20px",
                            fontSize: "12px",
                            fontWeight: 700,
                            textTransform: "lowercase",
                            ...(statusStyles[status] || statusStyles.scheduled),
                          }}
                        >
                          {status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <style>{`
        @keyframes floatOrb1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(30px, -20px) scale(1.1); }
        }

        @keyframes floatOrb2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-25px, 25px) scale(0.95); }
        }

        @keyframes floatOrb3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(15px, 30px) scale(1.05); }
        }

        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 15px rgba(99, 53, 147, 0.2); }
          50% { box-shadow: 0 0 25px rgba(139, 95, 179, 0.4); }
        }

        @keyframes beamMove {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }

        .ambient-orbs-container {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
          overflow: hidden;
          z-index: 1;
          opacity: 0.55;
        }

        .floating-astro-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(40px);
        }

        .orb-1 {
          width: 180px;
          height: 180px;
          background: rgba(225, 207, 240, 0.5);
          top: -40px;
          right: -30px;
          animation: floatOrb1 8s ease-in-out infinite;
        }

        .orb-2 {
          width: 220px;
          height: 220px;
          background: rgba(243, 235, 250, 0.6);
          bottom: -60px;
          left: -40px;
          animation: floatOrb2 11s ease-in-out infinite;
        }

        .orb-3 {
          width: 140px;
          height: 140px;
          background: rgba(210, 180, 235, 0.35);
          top: 45%;
          left: 35%;
          animation: floatOrb3 9s ease-in-out infinite;
        }

        .astro-icon-pulse {
          animation: pulseGlow 4s ease-in-out infinite;
        }

        .card-top-beam {
          animation: beamMove 6s linear infinite;
        }

        .stellar-card-hover {
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .stellar-card-hover:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 36px rgba(99, 53, 147, 0.12) !important;
          border-color: #d1b8e4 !important;
        }

        .accept-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 18px rgba(46, 125, 82, 0.3) !important;
        }

        .reject-btn:hover {
          background: #ffeeee !important;
          border-color: #eab8b8 !important;
        }

        .table-row-hover:hover {
          background-color: rgba(247, 241, 252, 0.6);
        }

        .booking-info-box {
          padding: 10px 12px;
          border-radius: 11px;
          background: #fcfbfd;
          border: 1px solid #f0ebf3;
          min-width: 0;
        }

        .consultation-label {
          font-size: 9px;
          font-weight: 800;
          color: #9c92a4;
          letter-spacing: 0.8px;
          margin-bottom: 4px;
          text-transform: uppercase;
        }

        .consultation-value {
          font-size: 13px;
          font-weight: 700;
          color: #4a3f52;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .consultation-small-value {
          font-size: 12px;
          font-weight: 700;
          color: #4a3f52;
        }

        .table-cell {
          padding: 18px 16px;
          border-bottom: 1px solid #f0ebf3;
          color: #6d6672;
          font-size: 14px;
          white-space: nowrap;
        }

        .customer-cell {
          color: #3d3246;
          font-weight: 700;
        }

        @media (max-width: 700px) {
          .scheduled-card {
            padding: 16px !important;
          }
        }

        @media (max-width: 420px) {
          .scheduled-card {
            padding: 14px !important;
          }

          .booking-info-box {
            padding: 9px !important;
          }

          .consultation-value {
            font-size: 12px;
          }
        }
      `}</style>
    </div>
  );
};

export default Consultations;