import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";

import { auth } from "../firebase";
import { api } from "./api";

let confirmationResult = null;
let recaptchaVerifier = null;
let recaptchaRenderPromise = null;

const RECAPTCHA_CONTAINER =
  "firebase-recaptcha-container";

const getRecaptcha = async () => {
  if (recaptchaVerifier) {
    return recaptchaVerifier;
  }

  if (recaptchaRenderPromise) {
    return recaptchaRenderPromise;
  }

  const container = document.getElementById(
    RECAPTCHA_CONTAINER
  );

  if (!container) {
    throw new Error(
      "Firebase reCAPTCHA container not found."
    );
  }

  recaptchaRenderPromise = (async () => {
    try {
      if (recaptchaVerifier) {
        try {
          recaptchaVerifier.clear();
        } catch (error) {}
        recaptchaVerifier = null;
      }

      container.innerHTML = "";

      console.log(
        "🔄 Creating Firebase reCAPTCHA..."
      );

      const verifier = new RecaptchaVerifier(
        auth,
        RECAPTCHA_CONTAINER,
        {
          size: "normal",

          callback: () => {
            console.log(
              "✅ reCAPTCHA verified"
            );
          },

          "expired-callback": () => {
            console.log(
              "⚠️ reCAPTCHA expired"
            );

            clearRecaptcha();
          },

          "error-callback": (error) => {
            console.error(
              "❌ reCAPTCHA error:",
              error
            );

            clearRecaptcha();
          },
        }
      );

      await verifier.render();

      recaptchaVerifier = verifier;

      console.log(
        "✅ Firebase reCAPTCHA initialized"
      );

      return verifier;
    } catch (error) {
      console.error(
        "❌ reCAPTCHA initialization failed:",
        error
      );

      recaptchaVerifier = null;

      throw error;
    } finally {
      recaptchaRenderPromise = null;
    }
  })();

  return recaptchaRenderPromise;
};

export const sendOtp = async (phone) => {
  const cleanPhone = String(phone).replace(
    /\D/g,
    ""
  );

  if (cleanPhone.length !== 10) {
    throw new Error(
      "Enter a valid 10-digit mobile number."
    );
  }

  const phoneNumber = `+91${cleanPhone}`;

  console.log(
    "========== FIREBASE OTP START =========="
  );

  console.log(
    "Phone:",
    phoneNumber
  );

  try {
    const appVerifier =
      await getRecaptcha();

    console.log(
      "✅ App verifier ready"
    );

    confirmationResult =
      await signInWithPhoneNumber(
        auth,
        phoneNumber,
        appVerifier
      );

    console.log(
      "✅ Firebase OTP sent successfully"
    );

    return {
      success: true,
      phone: phoneNumber,
    };
  } catch (error) {
    console.error(
      "❌ Firebase OTP Error:",
      error
    );

    console.error(
      "Code:",
      error?.code
    );

    console.error(
      "Message:",
      error?.message
    );

    confirmationResult = null;

    clearRecaptcha();

    if (
      error?.code ===
        "auth/invalid-app-credential" ||
      error?.code ===
        "auth/captcha-check-failed" ||
      error?.code ===
        "auth/invalid-captcha"
    ) {
      console.error(
        "⚠️ Firebase reCAPTCHA credential problem."
      );
    }

    if (
      error?.code ===
      "auth/too-many-requests"
    ) {
      console.error(
        "⚠️ Firebase OTP rate limit reached."
      );
    }

    throw error;
  }
};

export const verifyOtp = async (otp) => {
  if (!confirmationResult) {
    throw new Error(
      "OTP session not found. Please request OTP again."
    );
  }

  const cleanOtp = String(otp).replace(
    /\D/g,
    ""
  );

  if (cleanOtp.length !== 6) {
    throw new Error(
      "Enter the complete 6-digit OTP."
    );
  }

  try {
    console.log(
      "========== VERIFY OTP START =========="
    );

    const result =
      await confirmationResult.confirm(
        cleanOtp
      );

    const user = result.user;

    console.log(
      "✅ Firebase user authenticated:",
      user.uid
    );

    const firebaseToken =
      await user.getIdToken(true);

    console.log(
      "✅ Firebase ID token received"
    );

    const mobile =
      user.phoneNumber || "";

    const backendResponse =
      await api.post(
        "/partner/verify-otp",
        {
          idToken: firebaseToken,
          mobile,
          countryCode: "+91",
        }
      );

    console.log(
      "========== VERIFY OTP BACKEND =========="
    );

    console.log(
      "Backend response:",
      backendResponse
    );

    const partnerToken =
      backendResponse?.token ||
      backendResponse?.data?.token ||
      backendResponse?.partnerToken ||
      backendResponse?.data?.partnerToken;

    if (partnerToken) {
      localStorage.setItem(
        "partnerToken",
        partnerToken
      );

      console.log(
        "✅ partnerToken saved"
      );

      window.dispatchEvent(
        new Event(
          "partner-authenticated"
        )
      );
    } else {
      console.error(
        "❌ PARTNER TOKEN NOT FOUND"
      );
    }

    confirmationResult = null;

    return {
      success: true,
      token: partnerToken,
      firebaseToken,
      user,
      data: backendResponse?.data,
    };
  } catch (error) {
    console.error(
      "❌ Verify OTP Error:",
      error
    );

    throw error;
  }
};

export const clearRecaptcha = () => {
  try {
    if (recaptchaVerifier) {
      recaptchaVerifier.clear();
    }
  } catch (error) {
    console.warn(
      "reCAPTCHA cleanup warning:",
      error
    );
  }

  recaptchaVerifier = null;
  recaptchaRenderPromise = null;

  const container = document.getElementById(
    RECAPTCHA_CONTAINER
  );

  if (container) {
    container.innerHTML = "";
  }
};

export const clearAuthSession = () => {
  confirmationResult = null;
  clearRecaptcha();
};

export const registerPartner = async (
  payload
) => {
  return await api.post(
    "/partner/register",
    payload
  );
};

export const requestPasswordReset = async (
  email
) => {
  return {
    success: true,
    email,
  };
};