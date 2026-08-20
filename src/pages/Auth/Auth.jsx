import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";

import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  Zap,
} from "lucide-react";

import { auth } from "../../firebase/firebase";
import api from "../../services/api";

const Auth = () => {
  const navigate = useNavigate();

  const [mode, setMode] = useState("login");

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");

  const [confirmationResult, setConfirmationResult] =
    useState(null);

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

      const formattedPhone = phone.startsWith("+")
        ? phone
        : `+91${phone}`;

      // Avoid duplicate reCAPTCHA instances
      if (window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.clear();
        } catch (e) {}
      }

      const recaptcha = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
        },
      );

      window.recaptchaVerifier = recaptcha;

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

      setError(
        error?.message || "Failed to send OTP",
      );

      if (window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.clear();
        } catch (e) {}

        window.recaptchaVerifier = null;
      }
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
      setError("");

      if (!confirmationResult) {
        throw new Error("Please request OTP again.");
      }

      // IMPORTANT:
      // Confirm the OTP entered by the user
      const firebaseResult =
        await confirmationResult.confirm(otp);

      const firebaseUser = firebaseResult.user;

      if (!firebaseUser) {
        throw new Error("Firebase user not found");
      }

      const idToken = await firebaseUser.getIdToken(true);

      console.log("Firebase ID Token:", idToken);

      const response = await api.post(
        "/partner/verify-otp",
        {
          idToken,
        },
      );

      console.log(
        "Backend Verify Response:",
        response,
      );

      const result = response.data;

      if (!result.success) {
        throw new Error(
          result.message ||
            "Authentication failed",
        );
      }

      // =================================================
      // SAVE LOGIN DATA
      // =================================================

      localStorage.setItem(
        "partnerToken",
        result.token,
      );

      localStorage.setItem(
        "partnerUser",
        JSON.stringify(result.data),
      );

      console.log(
        "Authentication successful",
      );

      console.log(
        "Partner:",
        result.data,
      );

      // =================================================
      // REDIRECT
      // =================================================

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
      console.error(
        "Verify OTP Error:",
        error,
      );

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
  // CHANGE PHONE
  // =====================================================

  const changePhone = () => {
    setStep("phone");
    setOtp("");
    setError("");
    setConfirmationResult(null);

    if (window.recaptchaVerifier) {
      try {
        window.recaptchaVerifier.clear();
      } catch (e) {}

      window.recaptchaVerifier = null;
    }
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#faf8ff]">

      {/* =================================================
          BACKGROUND
      ================================================= */}

      <div className="absolute inset-0 overflow-hidden pointer-events-none">

        <div className="absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full bg-violet-300/20 blur-3xl" />

        <div className="absolute -bottom-40 -right-40 h-[600px] w-[600px] rounded-full bg-fuchsia-300/20 blur-3xl" />

        <div className="absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-200/10 blur-3xl" />

      </div>

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="relative z-10 border-b border-violet-100/80 bg-white/70 backdrop-blur-xl">

        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">

          {/* LOGO */}

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 shadow-lg shadow-violet-200">

              <Sparkles className="h-5 w-5 text-white" />

            </div>

            <div>
              <h1 className="font-serif text-lg font-bold tracking-[0.15em] text-slate-900">
                ASTRONARHARI
              </h1>

              <p className="text-[9px] font-bold tracking-[0.3em] text-violet-600">
                PARTNER PORTAL
              </p>
            </div>

          </div>

          {/* HEADER RIGHT */}

          <div className="hidden items-center gap-6 md:flex">

            <div className="flex items-center gap-2 text-sm text-slate-500">
              <ShieldCheck className="h-4 w-4 text-violet-600" />
              Secure authentication
            </div>

            <div className="h-5 w-px bg-slate-200" />

            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Users className="h-4 w-4 text-violet-600" />
              Join thousands of seekers
            </div>

          </div>

        </div>

      </header>

      {/* =================================================
          MAIN
      ================================================= */}

      <main className="relative z-10 mx-auto flex min-h-[calc(100vh-80px)] max-w-7xl items-center px-5 py-10 sm:px-8 lg:px-10">

        <div className="grid w-full items-center gap-12 lg:grid-cols-[1fr_480px]">

          {/* =================================================
              LEFT SIDE
          ================================================= */}

          <section className="hidden lg:block">

            {/* Badge */}

            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white px-4 py-2 shadow-sm">

              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-100">

                <Sparkles className="h-3.5 w-3.5 text-violet-600" />

              </span>

              <span className="text-xs font-bold uppercase tracking-[0.18em] text-violet-700">
                AstroNarhari Partner
              </span>

            </div>

            {/* Heading */}

            <h2 className="max-w-2xl font-serif text-5xl font-bold leading-[1.08] tracking-tight text-slate-900 xl:text-6xl">

              Turn your wisdom

              <span className="block bg-gradient-to-r from-violet-600 via-fuchsia-600 to-violet-700 bg-clip-text text-transparent">
                into meaningful guidance.
              </span>

            </h2>

            <p className="mt-6 max-w-xl text-base leading-7 text-slate-500">
              Connect with people looking for your expertise,
              build your professional presence and grow your
              consultation practice with AstroNarhari.
            </p>

            {/* BENEFITS */}

            <div className="mt-9 grid max-w-2xl grid-cols-2 gap-4">

              <FeatureCard
                icon={Users}
                title="Reach seekers"
                description="Connect with people who need your guidance."
              />

              <FeatureCard
                icon={Clock3}
                title="Flexible schedule"
                description="Choose when you want to be available."
              />

              <FeatureCard
                icon={Zap}
                title="Grow your practice"
                description="Build your profile and professional identity."
              />

              <FeatureCard
                icon={ShieldCheck}
                title="Secure platform"
                description="Your account and information stay protected."
              />

            </div>

            {/* RATING */}

            <div className="mt-9 flex items-center gap-4">

              <div className="flex -space-x-2">

                {[
                  "A",
                  "S",
                  "R",
                  "M",
                ].map((letter, index) => (
                  <div
                    key={index}
                    className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-violet-500 to-fuchsia-500 text-xs font-bold text-white"
                  >
                    {letter}
                  </div>
                ))}

              </div>

              <div>

                <div className="flex items-center gap-1">

                  {[1, 2, 3, 4, 5].map(
                    (star) => (
                      <Star
                        key={star}
                        className="h-3.5 w-3.5 fill-violet-500 text-violet-500"
                      />
                    ),
                  )}

                </div>

                <p className="mt-1 text-xs text-slate-500">
                  Trusted by astrology professionals
                </p>

              </div>

            </div>

          </section>

          {/* =================================================
              AUTH CARD
          ================================================= */}

          <section className="w-full">

            <div className="rounded-[2rem] border border-violet-100 bg-white p-6 shadow-[0_25px_80px_rgba(91,33,182,0.10)] sm:p-8">

              {/* CARD HEADER */}

              <div className="text-center">

                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 shadow-lg shadow-violet-200">

                  <Sparkles className="h-6 w-6 text-white" />

                </div>

                <h3 className="font-serif text-3xl font-bold text-slate-900">
                  Welcome to AstroNarhari
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {mode === "login"
                    ? "Login to manage your partner account."
                    : "Create your partner account and start your journey."}
                </p>

              </div>

              {/* =================================================
                  PHONE STEP
              ================================================= */}

              {step === "phone" && (
                <div className="mt-7">

                  {/* LOGIN REGISTER */}

                  <div className="flex rounded-2xl bg-violet-50 p-1.5">

                    <button
                      type="button"
                      onClick={() => {
                        setMode("login");
                        setError("");
                      }}
                      className={`flex-1 rounded-xl py-3 text-sm font-bold transition ${
                        mode === "login"
                          ? "bg-white text-violet-700 shadow-sm"
                          : "text-slate-500 hover:text-violet-600"
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
                      className={`flex-1 rounded-xl py-3 text-sm font-bold transition ${
                        mode === "register"
                          ? "bg-white text-violet-700 shadow-sm"
                          : "text-slate-500 hover:text-violet-600"
                      }`}
                    >
                      Register
                    </button>

                  </div>

                  {/* PHONE */}

                  <div className="mt-7">

                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-700">
                      Mobile Number
                    </label>

                    <div className="relative">

                      <div className="absolute left-4 top-1/2 flex -translate-y-1/2 items-center gap-2">

                        <span className="text-sm font-bold text-slate-700">
                          +91
                        </span>

                        <div className="h-5 w-px bg-slate-200" />

                      </div>

                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => {
                          const value =
                            e.target.value.replace(
                              /\D/g,
                              "",
                            );

                          setPhone(
                            value.slice(0, 10),
                          );

                          setError("");
                        }}
                        placeholder="Enter 10-digit mobile number"
                        className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-20 pr-4 text-sm font-medium text-slate-900 outline-none transition focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-500/10"
                      />

                    </div>

                  </div>

                  {/* OTP BUTTON */}

                  <button
                    type="button"
                    onClick={sendOtp}
                    disabled={
                      loading ||
                      phone.length !== 10
                    }
                    className="group mt-5 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-sm font-bold text-white shadow-lg shadow-violet-200 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
                  >

                    {loading ? (
                      <>
                        <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        Sending OTP...
                      </>
                    ) : (
                      <>
                        Continue with OTP

                        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                      </>
                    )}

                  </button>

                  {/* SECURITY */}

                  <div className="mt-5 flex items-center justify-center gap-2 text-xs text-slate-400">

                    <ShieldCheck className="h-4 w-4 text-emerald-500" />

                    Your phone number is securely verified

                  </div>

                </div>
              )}

              {/* =================================================
                  OTP STEP
              ================================================= */}

              {step === "otp" && (
                <div className="mt-7">

                  {/* OTP INFO */}

                  <div className="rounded-2xl border border-violet-100 bg-violet-50 p-4 text-center">

                    <p className="text-xs font-medium text-violet-600">
                      Verification code sent to
                    </p>

                    <p className="mt-1 text-base font-bold text-slate-900">
                      +91 {phone}
                    </p>

                  </div>

                  {/* OTP INPUT */}

                  <div className="mt-6">

                    <label className="mb-2 block text-center text-xs font-bold uppercase tracking-wider text-slate-700">
                      Enter 6-digit OTP
                    </label>

                    <input
                      type="text"
                      inputMode="numeric"
                      value={otp}
                      onChange={(e) => {
                        const value =
                          e.target.value.replace(
                            /\D/g,
                            "",
                          );

                        setOtp(
                          value.slice(0, 6),
                        );

                        setError("");
                      }}
                      maxLength={6}
                      placeholder="••••••"
                      className="h-16 w-full rounded-2xl border border-slate-200 bg-slate-50 text-center text-2xl font-bold tracking-[0.45em] text-slate-900 outline-none transition focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-500/10"
                    />

                  </div>

                  {/* VERIFY */}

                  <button
                    type="button"
                    onClick={verifyOtp}
                    disabled={
                      loading ||
                      otp.length !== 6
                    }
                    className="group mt-5 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-sm font-bold text-white shadow-lg shadow-violet-200 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
                  >

                    {loading ? (
                      <>
                        <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        Verifying OTP...
                      </>
                    ) : (
                      <>
                        Verify & Continue

                        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                      </>
                    )}

                  </button>

                  {/* CHANGE NUMBER */}

                  <button
                    type="button"
                    onClick={changePhone}
                    className="mt-5 w-full text-center text-sm font-semibold text-violet-600 transition hover:text-violet-800"
                  >
                    ← Change mobile number
                  </button>

                </div>
              )}

              {/* =================================================
                  ERROR
              ================================================= */}

              {error && (
                <div className="mt-5 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                  {error}
                </div>
              )}

              {/* RECAPTCHA */}

              <div id="recaptcha-container" />

              {/* FOOTER */}

              <div className="mt-7 border-t border-slate-100 pt-5">

                <div className="flex items-start gap-3">

                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50">

                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />

                  </div>

                  <p className="text-[11px] leading-5 text-slate-400">
                    By continuing, you agree to AstroNarhari's
                    partner terms and acknowledge that your
                    account will be verified using your mobile
                    number.
                  </p>

                </div>

              </div>

            </div>

            {/* MOBILE TRUST */}

            <div className="mt-5 flex justify-center gap-5 lg:hidden">

              <TrustItem
                icon={ShieldCheck}
                text="Secure"
              />

              <TrustItem
                icon={Users}
                text="Trusted"
              />

              <TrustItem
                icon={Zap}
                text="Fast"
              />

            </div>

          </section>

        </div>

      </main>

    </div>
  );
};

// =====================================================
// FEATURE CARD
// =====================================================

const FeatureCard = ({
  icon: Icon,
  title,
  description,
}) => {
  return (
    <div className="group rounded-2xl border border-violet-100 bg-white/70 p-4 transition hover:-translate-y-1 hover:bg-white hover:shadow-lg hover:shadow-violet-100">

      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600 transition group-hover:bg-violet-600 group-hover:text-white">

        <Icon className="h-5 w-5" />

      </div>

      <h4 className="text-sm font-bold text-slate-900">
        {title}
      </h4>

      <p className="mt-1 text-xs leading-5 text-slate-400">
        {description}
      </p>

    </div>
  );
};

// =====================================================
// TRUST ITEM
// =====================================================

const TrustItem = ({
  icon: Icon,
  text,
}) => {
  return (
    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">

      <Icon className="h-4 w-4 text-violet-600" />

      {text}

    </div>
  );
};

export default Auth;