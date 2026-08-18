import { useEffect, useState } from "react";
import { Power } from "lucide-react";
import { dutyOn, getDutyStatus } from "../../services/partner";

const DutyStatus = () => {
  const [isDutyOn, setIsDutyOn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDutyStatus = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getDutyStatus();

        console.log("Duty Status API Response:", response);

        const status =
          response?.dutyOn ??
          response?.isDutyOn ??
          response?.duty ??
          response?.data?.dutyOn ??
          response?.data?.isDutyOn ??
          response?.data?.duty ??
          false;

        setIsDutyOn(Boolean(status));
      } catch (error) {
        console.error("Duty Status Error:", error);
        setError("Unable to load duty status.");
      } finally {
        setLoading(false);
      }
    };

    loadDutyStatus();
  }, []);

  const handleDutyToggle = async () => {
    if (updating) return;

    // Currently only Duty ON API is available
    if (!isDutyOn) {
      try {
        setUpdating(true);
        setError("");

        const response = await dutyOn();

        console.log("Duty ON API Response:", response);

        setIsDutyOn(true);
      } catch (error) {
        console.error("Duty ON Error:", error);
        setError("Unable to turn duty ON.");
      } finally {
        setUpdating(false);
      }
    }
  };

  return (
    <div
      style={{
        width: "100%",
        marginBottom: "24px",
        padding: "20px 24px",
        borderRadius: "16px",
        background: "#ffffff",
        border: "1px solid #e5e7eb",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxSizing: "border-box",
      }}
    >
      {/* Left */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "14px",
        }}
      >
        <div
          style={{
            width: "44px",
            height: "44px",
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: isDutyOn ? "#dcfce7" : "#f3f4f6",
            color: isDutyOn ? "#16a34a" : "#6b7280",
          }}
        >
          <Power size={22} />
        </div>

        <div>
          <h3
            style={{
              margin: 0,
              fontSize: "17px",
              fontWeight: 600,
              color: "#111827",
            }}
          >
            Duty Status
          </h3>

          <p
            style={{
              margin: "5px 0 0",
              fontSize: "14px",
              color: "#6b7280",
            }}
          >
            {loading
              ? "Checking duty status..."
              : isDutyOn
              ? "You are currently on duty"
              : "You are currently off duty"}
          </p>

          {error && (
            <p
              style={{
                margin: "5px 0 0",
                fontSize: "13px",
                color: "#dc2626",
              }}
            >
              {error}
            </p>
          )}
        </div>
      </div>

      {/* Toggle */}
      <button
        type="button"
        onClick={handleDutyToggle}
        disabled={loading || updating || isDutyOn}
        style={{
          position: "relative",
          width: "130px",
          height: "44px",
          border: "none",
          borderRadius: "999px",
          background: isDutyOn ? "#22c55e" : "#e5e7eb",
          cursor:
            loading || updating || isDutyOn
              ? "not-allowed"
              : "pointer",
          transition: "0.2s ease",
          padding: "4px",
          display: "flex",
          alignItems: "center",
          justifyContent: isDutyOn ? "flex-end" : "flex-start",
        }}
      >
        <span
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            background: "#ffffff",
            boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
            display: "block",
          }}
        />

        <span
          style={{
            position: "absolute",
            left: isDutyOn ? "14px" : "48px",
            fontSize: "12px",
            fontWeight: 700,
            color: isDutyOn ? "#ffffff" : "#374151",
          }}
        >
          {updating
            ? "..."
            : isDutyOn
            ? "ON DUTY"
            : "OFF DUTY"}
        </span>
      </button>
    </div>
  );
};

export default DutyStatus;