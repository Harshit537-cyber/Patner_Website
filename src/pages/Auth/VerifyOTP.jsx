import { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AuthLayout from "./AuthLayout";
import Button from "../../components/common/Button";
import { useAuth } from "../../hooks/useAuth";

const VerifyOTP = () => {
  const [digits, setDigits] = useState(Array(6).fill(""));
  const [error, setError] = useState("");

  const inputsRef = useRef([]);

  const { verifyOtp, loading } = useAuth();

  const navigate = useNavigate();
  const { state } = useLocation();

  const phone = state?.phone || "••••••••••";

  // OTP input
  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;

    const next = [...digits];
    next[index] = value;

    setDigits(next);
    setError("");

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  // Backspace
  const handleKeyDown = (index, e) => {
    if (
      e.key === "Backspace" &&
      !digits[index] &&
      index > 0
    ) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  // Verify OTP
  const handleSubmit = async (e) => {
    e.preventDefault();

    const otp = digits.join("");

    if (otp.length !== 6) {
      setError("Enter the complete 6-digit code");
      return;
    }

    try {
      setError("");

      await verifyOtp(otp);

      navigate("/onboarding/personal-details");
    } catch (error) {
      console.error("Firebase Verify OTP Error:", error);

      switch (error?.code) {
        case "auth/invalid-verification-code":
          setError("Invalid OTP. Please check and try again.");
          break;

        case "auth/code-expired":
          setError("OTP expired. Please request a new OTP.");
          break;

        default:
          setError(
            error?.message || "OTP verification failed."
          );
      }
    }
  };

  return (
    <AuthLayout
      title="Verify your number"
      subtitle={`Enter the 6-digit code sent to ${phone}`}
    >
      <form onSubmit={handleSubmit}>
        <div className="auth-otp-inputs">
          {digits.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputsRef.current[index] = el;
              }}
              value={digit}
              maxLength={1}
              inputMode="numeric"
              onChange={(e) =>
                handleChange(index, e.target.value)
              }
              onKeyDown={(e) =>
                handleKeyDown(index, e)
              }
            />
          ))}
        </div>

        {error && (
          <p
            style={{
              color: "var(--color-error)",
              fontSize: "0.85rem",
              marginTop: -12,
              marginBottom: 16,
            }}
          >
            {error}
          </p>
        )}

        <Button
          type="submit"
          fullWidth
          loading={loading}
        >
          Verify & continue
        </Button>
      </form>

      <p
        style={{
          textAlign: "center",
          marginTop: 16,
          fontSize: "0.85rem",
          color: "var(--color-muted)",
        }}
      >
        Didn't get a code?{" "}
        <button
          type="button"
          style={{
            border: "none",
            background: "none",
            color: "var(--color-primary)",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Resend
        </button>
      </p>
    </AuthLayout>
  );
};

export default VerifyOTP;