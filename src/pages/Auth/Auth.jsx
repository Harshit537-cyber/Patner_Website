import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  Phone,
  ShieldCheck,
  Star,
  Loader2,
  Crown,
} from "lucide-react";

import { RecaptchaVerifier } from "firebase/auth";

import { auth } from "../../firebase/firebase";
import { isValidPhone } from "../../utils/validators";
import { useAuth } from "../../hooks/useAuth";

const Auth = () => {
  const navigate = useNavigate();

  // loading now comes from context so it's shared with verifyOtp on the next screen
  const { login, loading } = useAuth();

  const [mode, setMode] = useState("login");

  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const recaptchaVerifierRef = useRef(null);

  /* =====================================================
     CLEAN PHONE
  ===================================================== */

  const getCleanPhone = () => {
    return phone.replace(/\D/g, "");
  };

  /* =====================================================
     CREATE RECAPTCHA
  ===================================================== */

  const createRecaptcha = () => {
    try {
      if (recaptchaVerifierRef.current) {
        return recaptchaVerifierRef.current;
      }

      const container = document.getElementById(
        "firebase-recaptcha-container"
      );

      if (!container) {
        throw new Error("Firebase reCAPTCHA container not found.");
      }

      const verifier = new RecaptchaVerifier(
        auth,
        "firebase-recaptcha-container",
        {
          size: "invisible",

          callback: () => {
            console.log("✅ Firebase reCAPTCHA verified");
          },

          "expired-callback": () => {
            console.log("⚠️ Firebase reCAPTCHA expired");

            if (recaptchaVerifierRef.current) {
              recaptchaVerifierRef.current.clear();
              recaptchaVerifierRef.current = null;
            }
          },
        }
      );

      recaptchaVerifierRef.current = verifier;

      return verifier;
    } catch (error) {
      console.error("❌ reCAPTCHA initialization error:", error);
      throw error;
    }
  };

  /* =====================================================
     CLEAR RECAPTCHA
  ===================================================== */

  const clearRecaptcha = () => {
    try {
      if (recaptchaVerifierRef.current) {
        recaptchaVerifierRef.current.clear();
        recaptchaVerifierRef.current = null;
      }
    } catch (error) {
      console.error("reCAPTCHA clear error:", error);
    }
  };

  /* =====================================================
     CLEANUP
  ===================================================== */

  useEffect(() => {
    return () => {
      clearRecaptcha();
    };
  }, []);

  /* =====================================================
     SWITCH LOGIN / REGISTER
  ===================================================== */

  const switchMode = (newMode) => {
    setMode(newMode);

    setPhone("");
    setPhoneError("");

    clearRecaptcha();
  };

  /* =====================================================
     SEND FIREBASE OTP
  ===================================================== */

  const handleSendOtp = async (e) => {
    e.preventDefault();

    const cleanPhone = getCleanPhone();

    if (!isValidPhone(cleanPhone)) {
      setPhoneError("Please enter a valid 10-digit mobile number");
      return;
    }

    try {
      setPhoneError("");

      const appVerifier = createRecaptcha();

      // login() lives in AuthContext: it calls authService.sendOtp and
      // tracks pendingPhone/loading so verifyOtp on the next screen can use it
      await login({ phone: cleanPhone, appVerifier });

      navigate("/verify-otp", {
        state: {
          phone: cleanPhone,
          isRegistration: mode === "register",
        },
      });
    } catch (error) {
      console.error("OTP Error:", error);

      setPhoneError(
        error?.message || "Failed to send OTP. Please try again."
      );

      // a failed send leaves a stale/expired verifier behind — drop it so
      // the next attempt builds a fresh one instead of silently failing
      clearRecaptcha();
    }
  };

  /* =====================================================
     BENEFITS
  ===================================================== */

  const loginBenefits = [
    {
      icon: ShieldCheck,
      title: "Secure OTP login",
      description:
        "Access your partner account securely using your registered mobile number.",
    },
    {
      icon: Star,
      title: "Manage your expertise",
      description:
        "Keep your professional profile and partner services up to date.",
    },
    {
      icon: Sparkles,
      title: "Stay connected",
      description:
        "Continue helping seekers with meaningful guidance and consultations.",
    },
  ];

  const registerBenefits = [
    {
      icon: Crown,
      title: "Join our expert network",
      description: "Create your professional presence on AstroNarhari.",
    },
    {
      icon: Star,
      title: "Showcase your expertise",
      description:
        "Share your skills and experience with people seeking guidance.",
    },
    {
      icon: ShieldCheck,
      title: "Secure verification",
      description:
        "Your mobile number is verified securely through Firebase OTP.",
    },
  ];

  const benefits = mode === "login" ? loginBenefits : registerBenefits;

  /* =====================================================
     UI
  ===================================================== */

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
            {/* LOGO */}

            <Link to="/" className="flex items-center gap-3">
              <motion.div
                whileHover={{
                  rotate: 8,
                  scale: 1.05,
                }}
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

            {/* DYNAMIC CONTENT */}

            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: -20,
                }}
                transition={{
                  duration: 0.4,
                }}
                className="max-w-lg"
              >
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-100 bg-violet-50 px-4 py-2">
                  {mode === "login" ? (
                    <ShieldCheck className="h-3.5 w-3.5 text-violet-600" />
                  ) : (
                    <Crown className="h-3.5 w-3.5 text-violet-600" />
                  )}

                  <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-violet-700">
                    {mode === "login"
                      ? "Welcome Back"
                      : "Join Our Expert Network"}
                  </span>
                </div>

                <h2 className="font-serif text-5xl font-bold leading-[1.08] text-slate-900 xl:text-6xl">
                  {mode === "login" ? (
                    <>
                      Continue your
                      <span className="block bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                        journey.
                      </span>
                    </>
                  ) : (
                    <>
                      Your expertise.
                      <span className="block bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                        Your platform.
                      </span>
                    </>
                  )}
                </h2>

                <p className="mt-7 text-sm leading-7 text-slate-500">
                  {mode === "login"
                    ? "Sign in securely with your mobile number and continue providing meaningful guidance to seekers."
                    : "Join AstroNarhari and create your professional partner profile to connect your expertise with people seeking guidance."}
                </p>

                <div className="mt-10 space-y-5">
                  {benefits.map(({ icon: Icon, title, description }) => (
                    <motion.div
                      key={title}
                      initial={{
                        opacity: 0,
                        x: -15,
                      }}
                      animate={{
                        opacity: 1,
                        x: 0,
                      }}
                      transition={{
                        duration: 0.4,
                      }}
                      className="flex gap-4"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-violet-100 bg-violet-50">
                        <Icon className="h-4 w-4 text-violet-600" />
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {title}
                        </p>

                        <p className="mt-1 text-xs leading-5 text-slate-500">
                          {description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>

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
          {/* HEADER */}

          <div className="flex items-center justify-between px-6 py-5 sm:px-10">
            <Link
              to="/"
              className="flex items-center gap-2 text-sm font-bold text-violet-700 lg:hidden"
            >
              <Sparkles className="h-4 w-4" />
              AstroNarhari
            </Link>

            <div className="ml-auto flex items-center gap-2 text-xs text-slate-400">
              {mode === "login" ? (
                <>
                  <span>New partner?</span>

                  <button
                    type="button"
                    onClick={() => switchMode("register")}
                    className="font-bold text-violet-700 hover:text-violet-900"
                  >
                    Create account
                  </button>
                </>
              ) : (
                <>
                  <span>Already a partner?</span>

                  <button
                    type="button"
                    onClick={() => switchMode("login")}
                    className="font-bold text-violet-700 hover:text-violet-900"
                  >
                    Sign in
                  </button>
                </>
              )}
            </div>
          </div>

          {/* MAIN */}

          <div className="mx-auto w-full max-w-3xl flex-1 px-6 pb-12 sm:px-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial={{
                  opacity: 0,
                  y: 25,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: -20,
                }}
                transition={{
                  duration: 0.4,
                }}
                className="mx-auto max-w-md pt-12 sm:pt-20"
              >
                {/* ICON */}

                <motion.div
                  initial={{
                    scale: 0.8,
                    opacity: 0,
                  }}
                  animate={{
                    scale: 1,
                    opacity: 1,
                  }}
                  className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-violet-700"
                >
                  <Phone className="h-6 w-6" />
                </motion.div>

                {/* HEADING */}

                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-violet-600">
                  {mode === "login" ? "Partner Login" : "Partner Registration"}
                </p>

                <h2 className="mt-2 font-serif text-4xl font-bold tracking-tight text-slate-900">
                  {mode === "login" ? "Welcome back" : "Start your journey"}
                </h2>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  {mode === "login"
                    ? "Enter your registered mobile number. We'll send you a secure OTP to continue."
                    : "Enter your mobile number first. We'll verify it with a secure OTP before creating your partner profile."}
                </p>

                {/* ERROR */}

                <AnimatePresence>
                  {phoneError && (
                    <motion.div
                      initial={{
                        opacity: 0,
                        y: -10,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      exit={{
                        opacity: 0,
                        y: -10,
                      }}
                      className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-medium text-red-600"
                    >
                      {phoneError}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* PHONE FORM */}

                <form onSubmit={handleSendOtp} className="mt-8 space-y-6">
                  <div>
                    <label className="mb-2 block text-xs font-semibold text-slate-700">
                      Mobile number
                    </label>

                    <div
                      className={`flex h-14 overflow-hidden rounded-2xl border bg-white transition-all ${
                        phoneError
                          ? "border-red-300 ring-4 ring-red-100"
                          : "border-slate-200 focus-within:border-violet-500 focus-within:ring-4 focus-within:ring-violet-500/10"
                      }`}
                    >
                      <div className="flex items-center gap-2 border-r border-slate-100 px-4 text-sm font-semibold text-slate-600">
                        <span>🇮🇳</span>
                        <span>+91</span>
                      </div>

                      <input
                        type="tel"
                        value={phone}
                        maxLength={10}
                        inputMode="numeric"
                        autoComplete="tel"
                        disabled={loading}
                        placeholder="98765 43210"
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "");

                          setPhone(value);
                          setPhoneError("");
                        }}
                        className="w-full bg-transparent px-4 text-sm text-slate-800 outline-none placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  {/* FIREBASE RECAPTCHA */}

                  <div
                    id="firebase-recaptcha-container"
                    className="flex justify-center"
                  />

                  {/* BUTTON */}

                  <motion.button
                    whileHover={{
                      y: -2,
                    }}
                    whileTap={{
                      scale: 0.98,
                    }}
                    type="submit"
                    disabled={loading}
                    className="group flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-violet-600 to-violet-800 text-sm font-bold text-white shadow-xl shadow-violet-200 transition disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Sending OTP...
                      </>
                    ) : (
                      <>
                        Continue with OTP
                        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                      </>
                    )}
                  </motion.button>
                </form>

                {/* SECURITY */}

                <motion.div
                  initial={{
                    opacity: 0,
                  }}
                  animate={{
                    opacity: 1,
                  }}
                  transition={{
                    delay: 0.3,
                  }}
                  className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-400"
                >
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  Secure Firebase OTP verification
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;