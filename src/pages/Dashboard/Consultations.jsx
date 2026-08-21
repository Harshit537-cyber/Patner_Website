import { useState } from "react";

import EmptyState from "../../components/common/EmptyState";
import Loader from "../../components/common/Loader";

import {
  getClientLogs,
  getPartnerBookingRequests,
} from "../../services/consultations";

const consultationsData = [
  {
    id: "C-1041",
    customer: "Rohit Malhotra",
    type: "Chat",
    status: "completed",
    date: "2026-08-11T18:00:00",
    duration: "30 min",
    amount: 320,
  },
  {
    id: "C-1040",
    customer: "Sneha Kulkarni",
    type: "Call",
    status: "completed",
    date: "2026-08-10T09:15:00",
    duration: "40 min",
    amount: 540,
  },
  {
    id: "C-1039",
    customer: "Arjun Verma",
    type: "Video",
    status: "accepted",
    date: "2026-08-09T16:00:00",
    duration: "45 min",
    amount: 0,
  },
  {
    id: "C-1038",
    customer: "Neha Sharma",
    type: "Chat",
    status: "rejected",
    date: "2026-08-08T14:30:00",
    duration: "30 min",
    amount: 0,
  },
];

const filters = [
  { label: "All", value: "all" },
  { label: "Completed", value: "completed" },
  { label: "Scheduled", value: "scheduled" },
  { label: "Accepted", value: "accepted" },
  { label: "Rejected", value: "rejected" },
];

const statusStyles = {
  scheduled: {
    background: "#f1e9fb",
    color: "#6d4a91",
  },
  completed: {
    background: "#e8f6ee",
    color: "#2e7d52",
  },
  accepted: {
    background: "#e8f1ff",
    color: "#4169a1",
  },
  rejected: {
    background: "#fdeaea",
    color: "#b34b4b",
  },
};

const Consultations = () => {
  const [consultations, setConsultations] = useState(consultationsData);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false);

  const handleFilterChange = async (value) => {
    setFilter(value);

    // ==========================================
    // ALL → GET /api/bookings/client-logs
    // ==========================================
    if (value === "all") {
      try {
        setLoading(true);

        console.log("📋 Calling all consultations API...");
        console.log("📋 API: GET /api/bookings/client-logs");

        const response = await getClientLogs();

        console.log("📋 ALL CLIENT LOGS RESPONSE:", response);

        const bookings = Array.isArray(response)
          ? response
          : Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response?.data?.data)
          ? response.data.data
          : [];

        console.log("📋 FINAL ALL CONSULTATIONS:", bookings);
        console.log("📋 ALL CONSULTATIONS COUNT:", bookings.length);

        setConsultations(bookings);
      } catch (error) {
        console.error("❌ All Consultations API Error:", error);
        console.error("❌ Error Response:", error?.response);
        console.error("❌ Error Data:", error?.response?.data);

        setConsultations([]);
      } finally {
        setLoading(false);
      }

      return;
    }

    // ==========================================
    // SCHEDULED → GET /api/bookings/partner/requests
    // ==========================================
    if (value === "scheduled") {
      try {
        setLoading(true);

        console.log("📋 Calling scheduled consultations API...");
        console.log("📋 API: GET /api/bookings/partner/requests");

        const response = await getPartnerBookingRequests();

        console.log("📋 SCHEDULED RESPONSE:", response);

        const bookings = Array.isArray(response)
          ? response
          : Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response?.data?.data)
          ? response.data.data
          : [];

        console.log("📋 FINAL SCHEDULED BOOKINGS:", bookings);
        console.log("📋 SCHEDULED BOOKING COUNT:", bookings.length);

        setConsultations(bookings);
      } catch (error) {
        console.error("❌ Scheduled Consultations API Error:", error);
        console.error("❌ Error Response:", error?.response);
        console.error("❌ Error Data:", error?.response?.data);

        setConsultations([]);
      } finally {
        setLoading(false);
      }

      return;
    }

    // ==========================================
    // OTHER FILTERS
    // ==========================================
    // Completed / Accepted / Rejected ke liye
    // current loaded data use hoga.
  };

  const filteredConsultations =
    filter === "all" || filter === "scheduled"
      ? consultations
      : consultations.filter(
          (consultation) =>
            String(consultation?.status || "").toLowerCase() === filter
        );

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getCustomerName = (consultation) => {
    return (
      consultation?.customer ||
      consultation?.customerName ||
      consultation?.user?.name ||
      consultation?.user?.fullName ||
      consultation?.client?.name ||
      "Unknown"
    );
  };

  const getType = (consultation) => {
    return (
      consultation?.type ||
      consultation?.consultationType ||
      consultation?.serviceType ||
      consultation?.bookingType ||
      "-"
    );
  };

  const getAmount = (consultation) => {
    return (
      consultation?.amount ??
      consultation?.price ??
      consultation?.fee ??
      consultation?.totalAmount ??
      0
    );
  };

  const getDuration = (consultation) => {
    return (
      consultation?.duration ||
      consultation?.durationText ||
      consultation?.sessionDuration ||
      "-"
    );
  };

  const getStatus = (consultation) => {
    return String(consultation?.status || "scheduled").toLowerCase();
  };

  return (
    <div
      className="page-card"
      style={{
        background: "#ffffff",
        border: "1px solid #e5ddec",
        borderRadius: "14px",
        padding: "26px 22px",
        boxShadow: "0 8px 25px rgba(73, 48, 96, 0.04)",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "20px",
          marginBottom: "26px",
          flexWrap: "wrap",
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: "1.1rem",
            fontWeight: 600,
            color: "#40364a",
          }}
        >
          All consultations
        </h2>

        {/* Filters */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            flexWrap: "wrap",
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
                style={{
                  border: active
                    ? "1px solid #6f3fa0"
                    : "1px solid transparent",
                  background: active ? "#f3ebfa" : "transparent",
                  color: active ? "#633593" : "#6e6875",
                  padding: "8px 13px",
                  borderRadius: "7px",
                  fontSize: "14px",
                  fontWeight: active ? 600 : 500,
                  cursor: loading ? "wait" : "pointer",
                  transition: "all 0.2s ease",
                  outline: "none",
                }}
              >
                {loading && active ? "Loading..." : item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Loading */}
      {loading ? (
        <Loader
          label={
            filter === "all"
              ? "Loading consultations..."
              : "Loading scheduled consultations..."
          }
        />
      ) : filteredConsultations.length === 0 ? (
        /* Empty State */
        <EmptyState
          title="No consultations here"
          description={
            filter === "all"
              ? "No consultations were found."
              : `No ${filter} consultations were found.`
          }
        />
      ) : (
        /* Table */
        <div
          style={{
            width: "100%",
            overflowX: "auto",
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
                  "CUSTOMER",
                  "TYPE",
                  "DATE & TIME",
                  "DURATION",
                  "AMOUNT",
                  "STATUS",
                ].map((heading) => (
                  <th
                    key={heading}
                    style={{
                      textAlign: "left",
                      padding: "0 14px 14px",
                      borderBottom: "1px solid #e4dce9",
                      color: "#918a98",
                      fontSize: "12px",
                      fontWeight: 700,
                      letterSpacing: "0.3px",
                      whiteSpace: "nowrap",
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
                    key={
                      consultation?.id ||
                      consultation?._id ||
                      consultation?.bookingId ||
                      index
                    }
                  >
                    {/* Customer */}
                    <td
                      style={{
                        padding: "18px 14px",
                        borderBottom: "1px solid #f0ebf3",
                        color: "#4a414f",
                        fontSize: "14px",
                        fontWeight: 600,
                      }}
                    >
                      {getCustomerName(consultation)}
                    </td>

                    {/* Type */}
                    <td
                      style={{
                        padding: "18px 14px",
                        borderBottom: "1px solid #f0ebf3",
                        color: "#6d6672",
                        fontSize: "14px",
                      }}
                    >
                      {getType(consultation)}
                    </td>

                    {/* Date */}
                    <td
                      style={{
                        padding: "18px 14px",
                        borderBottom: "1px solid #f0ebf3",
                        color: "#6d6672",
                        fontSize: "14px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {formatDate(
                        consultation?.date ||
                          consultation?.scheduledAt ||
                          consultation?.bookingDate ||
                          consultation?.createdAt
                      )}
                    </td>

                    {/* Duration */}
                    <td
                      style={{
                        padding: "18px 14px",
                        borderBottom: "1px solid #f0ebf3",
                        color: "#6d6672",
                        fontSize: "14px",
                      }}
                    >
                      {getDuration(consultation)}
                    </td>

                    {/* Amount */}
                    <td
                      style={{
                        padding: "18px 14px",
                        borderBottom: "1px solid #f0ebf3",
                        color: "#514856",
                        fontSize: "14px",
                        fontWeight: 600,
                      }}
                    >
                      ₹{getAmount(consultation)}
                    </td>

                    {/* Status */}
                    <td
                      style={{
                        padding: "18px 14px",
                        borderBottom: "1px solid #f0ebf3",
                      }}
                    >
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          padding: "6px 12px",
                          borderRadius: "20px",
                          fontSize: "12px",
                          fontWeight: 600,
                          textTransform: "lowercase",
                          ...(statusStyles[status] ||
                            statusStyles.scheduled),
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
  );
};

export default Consultations;