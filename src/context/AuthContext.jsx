import { createContext, useContext, useEffect, useState } from "react";

import { signOut, signInWithPhoneNumber } from "firebase/auth";

import { auth } from "../firebase/firebase";
import api from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("partnerUser");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("partnerToken") || null;
  });

  const [loading, setLoading] = useState(false);

  const [confirmationResult, setConfirmationResult] = useState(null);

  /* =====================================================
     SEND OTP
  ===================================================== */

  const sendOtp = async (phone, appVerifier) => {
    try {
      setLoading(true);

      const formattedPhone = phone.startsWith("+") ? phone : `+91${phone}`;

      const result = await signInWithPhoneNumber(
        auth,
        formattedPhone,
        appVerifier,
      );

      setConfirmationResult(result);

      return result;
    } catch (error) {
      console.error("Send OTP Error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     VERIFY OTP
  ===================================================== */

  const verifyOtp = async (otp) => {
    try {
      if (!confirmationResult) {
        throw new Error("OTP session expired. Please request a new OTP.");
      }

      setLoading(true);

      // Firebase OTP verification
      const credential = await confirmationResult.confirm(otp);

      // Firebase ID token
      const idToken = await credential.user.getIdToken(true);

      // Backend verification
      const response = await api.post("/partner/verify-otp", {
        idToken,
      });

      const responseData = response.data;

      if (!responseData.success) {
        throw new Error(responseData.message || "Authentication failed");
      }

      const backendToken = responseData.token;
      const partner = responseData.data;

      // Save authentication
      localStorage.setItem("partnerToken", backendToken);

      localStorage.setItem("partnerUser", JSON.stringify(partner));

      setToken(backendToken);
      setUser(partner);

      // OTP session no longer needed
      setConfirmationResult(null);

      return responseData;
    } catch (error) {
      console.error("Verify OTP Error:", error);

      throw new Error(
        error?.response?.data?.message ||
          error?.message ||
          "OTP verification failed",
      );
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     LOGOUT
  ===================================================== */

  const logout = async () => {
    try {
      setLoading(true);

      if (token) {
        try {
          await api.post(
            "/partner/logout",
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );
        } catch (error) {
          console.error("Backend logout error:", error);
        }
      }

      await signOut(auth);

      localStorage.removeItem("partnerToken");
      localStorage.removeItem("partnerUser");

      setToken(null);
      setUser(null);
      setConfirmationResult(null);
    } catch (error) {
      console.error("Logout Error:", error);
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     CLEAR AUTH
  ===================================================== */

  useEffect(() => {
    const handleStorage = () => {
      const savedToken = localStorage.getItem("partnerToken");

      const savedUser = localStorage.getItem("partnerUser");

      setToken(savedToken);

      setUser(savedUser ? JSON.parse(savedUser) : null);
    };

    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const value = {
    user,
    token,
    loading,

    sendOtp,
    verifyOtp,
    logout,

    isAuthenticated: !!token && !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};
