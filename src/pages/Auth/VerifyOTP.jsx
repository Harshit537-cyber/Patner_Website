import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Loader2,
  MessageSquareText,
} from "lucide-react";

import { useAuth } from "../../hooks/useAuth";

const OTP_LENGTH = 6;
const RESEND_SECONDS = 30;

const VerifyOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { verifyOtp, login, loading } = useAuth();

  const phone = location.state?.phone;
  const isRegistration = Boolean(location.state?.isRegistration);

  const [digits, setDigits] = useState(Array(OTP_LENGTH).fill(""));
  const [otpError, setOtpError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(RESEND_SECONDS);
  const [resending, setResending] = useState(false);

  const inputRefs = useRef([]);

  // No phone in state means someone landed here directly — send them back
  useEffect(() => {
    if (!phone) {
      navigate("/auth", { replace: true });
    }
  }, [phone, navigate]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (resendCooldown <= 0) return;

    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [resendCooldown]);

  const otpValue = digits.join("");

  /* =====================================================
     INPUT HANDLING
  ===================================================== */

  const focusInput = (index) => {
    inputRefs.current[index]?.focus();
    inputRefs.current[index]?.select();
  };

  const handleChange = (index, rawValue) => {
    const value = rawValue.replace(/\D/g, "");

    if (!value) {
      setDigits((prev) => {
        const next = [...prev];
        next[index] = "";
        return next;
      });
      return;
    }

    // handles fast typing/autofill where more than one char lands at once
    const chars = value.split("");

    setDigits((prev) => {
      const next = [...prev];
      let cursor = index;

      chars.forEach((char) => {
        if (cursor < OTP_LENGTH) {
          next[cursor] = char;
          cursor += 1;
        }
      });

      const nextEmpty = next.findIndex((d) => !d);
      focusInput(nextEmpty === -1 ? OTP_LENGTH - 1 : nextEmpty);

      return next;
    });

    setOtpError("");
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      focusInput(index - 1);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();

    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);

    if (!pasted) return;

    const next = Array(OTP_LENGTH).fill("");

    pasted.split("").forEach((char, i) => {
      next[i] = char;
    });

    setDigits(next);
    setOtpError("");

    focusInput(Math.min(pasted.length, OTP_LENGTH - 1));
  };

  /* =====================================================
     SUBMIT
  ===================================================== */

  const handleVerify = async (e) => {
    e?.preventDefault();

    if (otpValue.length !== OTP_LENGTH) {
      setOtpError(`Enter the ${OTP_LENGTH}-digit code sent to your phone`);
      return;
    }

    try {
      setOtpError("");

      await verifyOtp(otpValue);

      navigate(isRegistration ? "/create-profile" : "/dashboard", {
        replace: true,
      });
    } catch (error) {
      console.error("Verify OTP Error:", error);

      setOtpError(
        error?.message || "That code didn't work. Please try again."
      );

      setDigits(Array(OTP_LENGTH).fill(""));
      focusInput(0);
    }
  };

  // auto-submit the moment all boxes are filled
  useEffect(() => {
    if (otpValue.length === OTP_LENGTH) {
      handleVerify();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otpValue]);

  /* =====================================================
     RESEND
  ===================================================== */

  const handleResend = async () => {
    if (resendCooldown > 0 || resending) return;

    try {
      setResending(true);
      setOtpError("");

      // Note: sending a fresh OTP needs a fresh reCAPTCHA verifier, which
      // lives on the /auth screen. If your sendOtp requires an appVerifier,
      // route resend back through Auth.jsx instead of calling login() here.
      await login({ phone });

      setDigits(Array(OTP_LENGTH).fill(""));
      setResendCooldown(RESEND_SECONDS);
      focusInput(0);
    } catch (error) {
      console.error("Resend OTP Error:", error);
      setOtpError(error?.message || "Couldn't resend the code. Try again.");
    } finally {
      setResending(false);
    }
  };

  const formattedPhone = phone
    ? `+91 ${phone.slice(0, 5)} ${phone.slice(5)}`
    : "";

  if (!phone) return null;

  return (
    <div className="min-h-screen overflow-hidden bg-[#faf9ff]">
      <div className="flex min-h-screen">
        {/* =================================================
            LEFT PANEL
        ================================================= */}

        <div className="relative hidden overflow-hidden border-r border-slate-200 bg-white lg:flex lg:w-[44%]">
          <div className="absolute -left-32 -top-32 h-[450px] w-[450px] rounded-full bg-violet-100 blur-3xl" />

          <div className="absolute -bottom-32 -right-32 h-[450px] w-[450px] rounded-full bg-amber-100 blur-3xl" />

          <motion.div
            animate={{
              y: [0, -15, 0],
              x: [0, 8, 0],
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute right-20 top-24 h-20 w-20 rounded-full bg-violet-100/70 blur-xl"
          />

          <div className="relative z-10 flex w-full flex-col justify-between p-12 xl:p-16">
            <Link to="/" className="flex items-center gap-3">
              <motion.div
                whileHover={{ rotate: 8, scale: 1.05 }}
                className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-violet-800 shadow-lg shadow-violet-200"
              >
                <Sparkles className="h-5 w-5 text-white" />
              </motion.div>

              <div>
                <h1 className="font-serif text-xl font-bold tracking-[0.15em] text-slate-900">
                  ASTRONARHARI
                </h1>

                <p className="text-[9px] font-bold tracking-[0.28em] text-violet-600">
                  PARTNER PORTAL
                </p>
              </div>
            </Link>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="max-w-lg"
            >
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-100 bg-violet-50 px-4 py-2">
                <MessageSquareText className="h-3.5 w-3.5 text-violet-600" />

                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-violet-700">
                  One Last Step
                </span>
              </div>

              <h2 className="font-serif text-5xl font-bold leading-[1.08] text-slate-900 xl:text-6xl">
                Almost
                <span className="block bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                  there.
                </span>
              </h2>

              <p className="mt-7 text-sm leading-7 text-slate-500">
                We've sent a 6-digit verification code to your mobile
                number. Enter it to{" "}
                {isRegistration
                  ? "start building your partner profile."
                  : "get back to your dashboard."}
              </p>
            </motion.div>

            <p className="font-serif text-sm italic text-slate-400">
              "Every chart tells a story. Every expert helps someone
              understand theirs."
            </p>
          </div>
        </div>

        {/* =================================================
            RIGHT PANEL
        ================================================= */}

        <div className="flex w-full flex-1 flex-col">
          <div className="flex items-center px-6 py-5 sm:px-10">
            <Link
              to="/"
              className="flex items-center gap-2 text-sm font-bold text-violet-700 lg:hidden"
            >
              <Sparkles className="h-4 w-4" />
              AstroNarhari
            </Link>
          </div>

          <div className="mx-auto w-full max-w-3xl flex-1 px-6 pb-12 sm:px-10">
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mx-auto max-w-md pt-12 sm:pt-20"
            >
              <button
                type="button"
                onClick={() => navigate("/auth")}
                className="mb-6 flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-violet-700"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Change number
              </button>

              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-violet-700"
              >
                <MessageSquareText className="h-6 w-6" />
              </motion.div>

              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-violet-600">
                Verify OTP
              </p>

              <h2 className="mt-2 font-serif text-4xl font-bold tracking-tight text-slate-900">
                Enter the code
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                We sent a {OTP_LENGTH}-digit code to{" "}
                <span className="font-semibold text-slate-700">
                  {formattedPhone}
                </span>
                .
              </p>

              <AnimatePresence>
                {otpError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-medium text-red-600"
                  >
                    {otpError}
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleVerify} className="mt-8 space-y-8">
                <div>
                  <label className="mb-3 block text-xs font-semibold text-slate-700">
                    Verification code
                  </label>

                  <div
                    className="flex justify-between gap-2 sm:gap-3"
                    onPaste={handlePaste}
                  >
                    {digits.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el) => (inputRefs.current[index] = el)}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        disabled={loading}
                        onChange={(e) =>
                          handleChange(index, e.target.value)
                        }
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        className={`h-14 w-full max-w-[52px] rounded-2xl border bg-white text-center text-xl font-bold text-slate-800 outline-none transition-all ${
                          otpError
                            ? "border-red-300 ring-4 ring-red-100"
                            : digit
                            ? "border-violet-400 ring-4 ring-violet-500/10"
                            : "border-slate-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <motion.button
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading || otpValue.length !== OTP_LENGTH}
                  className="group flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-violet-600 to-violet-800 text-sm font-bold text-white shadow-xl shadow-violet-200 transition disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      Verify &amp; continue
                      <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                    </>
                  )}
                </motion.button>
              </form>

              <div className="mt-6 flex items-center justify-center gap-1.5 text-xs text-slate-400">
                <span>Didn't get the code?</span>

                {resendCooldown > 0 ? (
                  <span className="font-semibold text-slate-500">
                    Resend in {resendCooldown}s
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={resending}
                    className="font-bold text-violet-700 hover:text-violet-900 disabled:opacity-60"
                  >
                    {resending ? "Sending..." : "Resend code"}
                  </button>
                )}
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-400"
              >
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                Secure Firebase OTP verification
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;