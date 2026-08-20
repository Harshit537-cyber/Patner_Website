import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

import { auth } from "../../firebase/firebase";
import api from "../../services/api";

const Auth = () => {
  const navigate = useNavigate();

  const [mode, setMode] = useState("login");

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");

  const [confirmationResult, setConfirmationResult] = useState(null);

  const [step, setStep] = useState("phone");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  // =====================================================
  // SEND OTP
  // =====================================================

  const sendOtp = async () => {
    try {
      setLoading(true);
      setError("");

      const formattedPhone = phone.startsWith("+") ? phone : `+91${phone}`;

      const recaptcha = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
      });

      const result = await signInWithPhoneNumber(
        auth,
        formattedPhone,
        recaptcha,
      );

      setConfirmationResult(result);

      setStep("otp");

      console.log("OTP sent successfully");
    } catch (error) {
      console.error("Send OTP Error:", error);

      setError(error?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // VERIFY OTP
  // =====================================================

  const verifyOtp = async () => {
    try {
      setLoading(true);

      const firebaseUser = auth.currentUser;

      if (!firebaseUser) {
        throw new Error("Firebase user not found");
      }

      const idToken = await firebaseUser.getIdToken(true);

      console.log("Firebase ID Token:", idToken);

      const response = await api.post("/partner/verify-otp", {
        idToken,
      });

      console.log("Backend Verify Response:", response);

      // Axios response ke andar actual backend response
      const result = response.data;

      if (!result.success) {
        throw new Error(result.message || "Authentication failed");
      }

      // Token save
      localStorage.setItem("partnerToken", result.token);

      // Partner data save
      localStorage.setItem("partnerUser", JSON.stringify(result.data));

      console.log("Authentication successful");
      console.log("Partner:", result.data);

      // Profile complete hai ya nahi
      if (result.data.isProfileComplete) {
        navigate("/dashboard", {
          replace: true,
        });
      } else {
        navigate("/create-profile", {
          replace: true,
        });
      }
    } catch (error) {
      console.error("Verify OTP Error:", error);

      setError(
        error?.response?.data?.message ||
          error?.message ||
          "OTP verification failed",
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        {/* TITLE */}

        <h1 className="text-2xl font-bold text-slate-900">
          AstroNarhari Partner
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          {mode === "login"
            ? "Login to your partner account"
            : "Create your partner account"}
        </p>

        {/* LOGIN / REGISTER */}

        {step === "phone" && (
          <>
            <div className="mt-6 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setError("");
                }}
                className={`flex-1 rounded-lg px-4 py-3 text-sm font-semibold ${
                  mode === "login"
                    ? "bg-violet-600 text-white"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                Login
              </button>

              <button
                type="button"
                onClick={() => {
                  setMode("register");
                  setError("");
                }}
                className={`flex-1 rounded-lg px-4 py-3 text-sm font-semibold ${
                  mode === "register"
                    ? "bg-violet-600 text-white"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                Register
              </button>
            </div>

            {/* PHONE */}

            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter mobile number"
              className="mt-6 h-12 w-full rounded-lg border border-slate-200 px-4 outline-none focus:border-violet-500"
            />

            {/* SEND OTP */}

            <button
              type="button"
              onClick={sendOtp}
              disabled={loading}
              className="mt-4 h-12 w-full rounded-lg bg-violet-600 font-semibold text-white disabled:opacity-50"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </>
        )}

        {/* OTP */}

        {step === "otp" && (
          <>
            <p className="mt-6 text-sm text-slate-500">
              OTP sent to +91{phone}
            </p>

            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              maxLength={6}
              className="mt-4 h-12 w-full rounded-lg border border-slate-200 px-4 text-center tracking-[0.5em] outline-none focus:border-violet-500"
            />

            <button
              type="button"
              onClick={verifyOtp}
              disabled={loading}
              className="mt-4 h-12 w-full rounded-lg bg-violet-600 font-semibold text-white disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

            <button
              type="button"
              onClick={() => {
                setStep("phone");
                setOtp("");
                setError("");
              }}
              className="mt-3 w-full text-sm text-violet-600"
            >
              Change Number
            </button>
          </>
        )}

        {/* ERROR */}

        {error && (
          <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* RECAPTCHA */}

        <div id="recaptcha-container" />
      </div>
    </div>
  );
};

export default Auth;
