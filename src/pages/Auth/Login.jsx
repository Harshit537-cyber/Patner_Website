import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import AuthLayout from "./AuthLayout";
import Button from "../../components/common/Button";
import { useAuth } from "../../hooks/useAuth";
import { isValidPhone } from "../../utils/validators";

const Login = () => {
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) {
      console.log(
        "⏳ OTP request already in progress..."
      );
      return;
    }

    const cleanPhone = phone.replace(
      /\D/g,
      ""
    );

    if (!isValidPhone(cleanPhone)) {
      setError(
        "Please enter a valid 10-digit mobile number"
      );
      return;
    }

    try {
      setError("");

      console.log(
        "📱 Sending OTP to:",
        `+91${cleanPhone}`
      );

      await login({
        phone: cleanPhone,
      });

      console.log(
        "✅ OTP request successful"
      );

      navigate("/verify-otp", {
        state: {
          phone: cleanPhone,
        },
      });
    } catch (error) {
      console.error(
        "❌ Firebase OTP Error:",
        error
      );

      console.error(
        "Error code:",
        error?.code
      );

      console.error(
        "Error message:",
        error?.message
      );

      switch (error?.code) {
        case "auth/too-many-requests":
          setError(
            "Too many OTP attempts. Please wait and try again later."
          );
          break;

        case "auth/invalid-phone-number":
          setError(
            "Invalid mobile number format."
          );
          break;

        case "auth/operation-not-allowed":
          setError(
            "Phone authentication is not enabled in Firebase."
          );
          break;

        case "auth/quota-exceeded":
          setError(
            "SMS quota exceeded. Please try again later."
          );
          break;

        case "auth/captcha-check-failed":
        case "auth/invalid-captcha":
        case "auth/invalid-app-credential":
          setError(
            "Security verification failed. Please try again."
          );
          break;

        case "auth/network-request-failed":
          setError(
            "Network error. Please check your internet connection and try again."
          );
          break;

        default:
          setError(
            error?.message ||
              "Failed to send OTP. Please try again."
          );
      }
    }
  };

  return (
    <AuthLayout
      title="Welcome Back ✦"
      subtitle="Log in with your registered mobile number to access your partner portal."
      footer={
        <>
          New partner?{" "}
          <Link
            to="/register"
            className="auth-footer-link"
          >
            Apply to join
          </Link>
        </>
      }
    >
      <motion.div
        className="auth-form-wrapper"
        initial={{
          opacity: 0,
          y: 15,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.4,
          ease: "easeOut",
        }}
      >
        <form
          onSubmit={handleSubmit}
          className="auth-custom-form"
        >
          <AnimatePresence>
            {error && (
              <motion.div
                className="auth-error-alert"
                initial={{
                  opacity: 0,
                  height: 0,
                  y: -10,
                }}
                animate={{
                  opacity: 1,
                  height: "auto",
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  height: 0,
                  y: -10,
                }}
                transition={{
                  duration: 0.25,
                }}
              >
                <span className="error-icon">
                  ⚠️
                </span>

                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="form-group">
            <label className="form-label">
              Mobile Number
            </label>

            <div className="phone-input-wrapper">
              <div className="country-code-pill">
                <span className="code-flag">
                  🇮🇳
                </span>

                <span className="code-text">
                  +91
                </span>
              </div>

              <input
                type="tel"
                className="phone-field"
                placeholder="98765 43210"
                value={phone}
                maxLength={10}
                inputMode="numeric"
                autoComplete="tel"
                disabled={loading}
                onChange={(e) => {
                  const value =
                    e.target.value.replace(
                      /\D/g,
                      ""
                    );

                  setPhone(value);
                  setError("");
                }}
              />
            </div>
          </div>

         <div
  id="firebase-recaptcha-container"
  style={{
    marginTop: "16px",
    marginBottom: "16px",
    display: "flex",
    justifyContent: "center",
  }}
/>
          

          <div className="auth-submit-wrap">
            <Button
              type="submit"
              fullWidth
              loading={loading}
              size="md"
              disabled={loading}
            >
              Send OTP ✦
            </Button>
          </div>
        </form>

        <p className="auth-help-link">
          <Link to="/forgot-password">
            Trouble logging in or lost access?
          </Link>
        </p>
      </motion.div>
    </AuthLayout>
  );
};

export default Login;