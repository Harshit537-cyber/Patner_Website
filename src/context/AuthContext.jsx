import { createContext, useState, useEffect } from "react";
import { storage } from "../utils/storage";

import {
  sendOtp,
  verifyOtp as firebaseVerifyOtp,
  clearAuthSession,
} from "../services/authService";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => storage.get("user"));
  const [loading, setLoading] = useState(false);
  const [pendingPhone, setPendingPhone] = useState("");

  useEffect(() => {
    if (user) {
      storage.set("user", user);
    } else {
      storage.remove("user");
    }
  }, [user]);

  const login = async ({ phone }) => {
    setLoading(true);

    try {
      const result = await sendOtp(phone);

      setPendingPhone(result.phone);

      return result;
    } catch (error) {
      console.error("Login OTP Error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

const verifyOtp = async (otp) => {
  setLoading(true);

  try {
    console.log("========== VERIFY OTP START ==========");

    const result = await firebaseVerifyOtp(otp);

    const firebaseUser = result.user;
    const partnerToken = result.token;

    console.log("✅ Firebase user:", firebaseUser);
    console.log("✅ Partner Token:", partnerToken);

    if (partnerToken) {
      localStorage.setItem(
        "partnerToken",
        partnerToken
      );

      console.log(
        "✅ partnerToken saved to localStorage"
      );
    } else {
      console.warn(
        "⚠️ Partner token was not returned by backend"
      );
    }

    const newUser = {
      id: firebaseUser.uid,
      uid: firebaseUser.uid,
      phone: firebaseUser.phoneNumber || pendingPhone,
      name: "New Partner",
      applicationStatus: "pending",
    };

    setUser(newUser);

    console.log(
      "Stored partnerToken:",
      localStorage.getItem("partnerToken")
    );

    return {
      ...newUser,
      token: partnerToken,
      firebaseToken: result.firebaseToken,
    };
  } catch (error) {
    console.error(
      "❌ Verify OTP Error:",
      error
    );

    throw error;
  } finally {
    setLoading(false);
  }
};

  const logout = () => {
    clearAuthSession();
    setUser(null);
    setPendingPhone("");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        login,
        verifyOtp,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};