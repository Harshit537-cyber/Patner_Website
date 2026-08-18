import {
  createContext,
  useEffect,
  useState,
} from "react";

import {
  addBankAccount,
  getBankAccount,
  updateBankAccount,
} from "../services/partner";

export const PartnerContext = createContext(null);

const initialProfile = {
  personal: {},
  professional: {},
  kyc: {},
  documents: {},
  bank: {},
};

export const PartnerProvider = ({ children }) => {
  const [profile, setProfile] =
    useState(initialProfile);

  const [bankLoading, setBankLoading] =
    useState(true);

  useEffect(() => {
    const loadBankAccount = async () => {
      try {
        setBankLoading(true);

        console.log(
          "========== GET BANK ACCOUNT =========="
        );

        const partnerToken =
          localStorage.getItem("partnerToken");

        console.log(
          "Partner token available:",
          !!partnerToken
        );

        if (!partnerToken) {
          console.log(
            "⏳ Partner authentication not available. Bank API skipped."
          );

          return;
        }

        const response =
          await getBankAccount();

        console.log(
          "Bank API Response:",
          response
        );

        if (
          response?.success &&
          response?.bankAccount
        ) {
          console.log(
            "Existing bank account found:",
            response.bankAccount
          );

          setProfile((prev) => ({
            ...prev,
            bank: response.bankAccount,
          }));
        } else {
          console.log(
            "No existing bank account found."
          );
        }
      } catch (error) {
        console.error(
          "GET Bank Account Error:",
          error
        );
      } finally {
        setBankLoading(false);
      }
    };

    loadBankAccount();
  }, []);

  const updateSection = async (
    section,
    data
  ) => {
    if (section === "bank") {
      const payload = {
        accountHolderName:
          data.accountHolderName,

        bankName:
          data.bankName,

        accountNumber:
          data.accountNumber,

        ifscCode:
          data.ifscCode,

        branchName:
          data.branchName,
      };

      if (profile.bank?._id) {
        console.log(
          "Existing bank account:",
          profile.bank._id
        );

        console.log(
          "Updating bank account using PUT..."
        );

        const response =
          await updateBankAccount(payload);

        console.log(
          "PUT Bank Account Response:",
          response
        );

        if (
          response?.success &&
          response?.bankAccount
        ) {
          setProfile((prev) => ({
            ...prev,
            bank: response.bankAccount,
          }));
        }

        return response;
      }

      console.log(
        "Creating new bank account..."
      );

      const response =
        await addBankAccount(payload);

      console.log(
        "POST Bank Account Response:",
        response
      );

      if (
        response?.success &&
        response?.bankAccount
      ) {
        setProfile((prev) => ({
          ...prev,
          bank: response.bankAccount,
        }));
      }

      return response;
    }

    setProfile((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        ...data,
      },
    }));
  };

  return (
    <PartnerContext.Provider
      value={{
        profile,
        updateSection,
        bankLoading,
      }}
    >
      {children}
    </PartnerContext.Provider>
  );
};