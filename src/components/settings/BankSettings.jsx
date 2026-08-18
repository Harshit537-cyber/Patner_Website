import {
  useEffect,
  useState,
} from "react";

import Input from "../common/Input";
import Button from "../common/Button";
import { usePartner } from "../../hooks/usePartner";

import "./BankSettings.css";

const BankSettings = () => {
  const {
    profile,
    updateSection,
    bankLoading,
  } = usePartner();

  const [form, setForm] = useState({
    accountHolderName: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    branchName: "",
  });

  const [loading, setLoading] = useState(false);

  // ==========================================
  // GET API SE FORM FILL KARNA
  // ==========================================
  useEffect(() => {
    if (profile?.bank?._id) {
      console.log(
        "Bank account received from GET:",
        profile.bank
      );

      setForm({
        accountHolderName:
          profile.bank.accountHolderName || "",

        bankName:
          profile.bank.bankName || "",

        accountNumber:
          profile.bank.accountNumber || "",

        ifscCode:
          profile.bank.ifscCode || "",

        branchName:
          profile.bank.branchName || "",
      });
    }
  }, [profile?.bank]);

  // ==========================================
  // INPUT CHANGE
  // ==========================================
  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // ==========================================
  // SAVE
  // ==========================================
  const handleSave = async (e) => {
    e?.preventDefault();

    try {
      setLoading(true);

      console.log(
        "Saving bank details:",
        form
      );

      const response = await updateSection(
        "bank",
        form
      );

      console.log(
        "Bank save result:",
        response
      );

      if (response?.success) {
        alert(
          response?.message ||
            "Bank details saved successfully!"
        );
      }
    } catch (error) {
      console.error(
        "Bank account error:",
        error
      );

      alert(
        error?.message ||
          "Failed to save bank details"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bento-bank-container">
      <div className="bento-bank-glow" />

      <div className="bento-bank-card">
        <div className="bento-bank-top-glow" />

        {/* HEADER */}
        <div className="bento-bank-header">
          <div className="bento-bank-title-wrap">
            <span className="bento-bank-eyebrow">
              <span className="sparkle">
                ✦
              </span>{" "}
              Payout Preferences
            </span>

            <h3 className="bento-bank-title">
              Bank{" "}
              <span className="highlight">
                Settings
              </span>
            </h3>

            <p className="bento-bank-sub">
              Payouts receive karne ke liye
              apne bank details enter karein.
            </p>
          </div>

          <div className="bento-badge-encrypted">
            <svg
              width="14"
              height="14"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>

            Encrypted
          </div>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSave}
          className="bento-bank-form"
        >
          <div className="bento-grid-2col">
            <div className="grid-col-full">
              <Input
                label="Account Holder Name"
                name="accountHolderName"
                placeholder="e.g. Rahul Sharma"
                value={
                  form.accountHolderName
                }
                onChange={handleChange}
                inputClassName="bento-bank-input"
                className="bento-bank-input"
              />
            </div>

            <Input
              label="Bank Name"
              name="bankName"
              placeholder="e.g. HDFC Bank"
              value={form.bankName}
              onChange={handleChange}
              inputClassName="bento-bank-input"
              className="bento-bank-input"
            />

            <Input
              label="Account Number"
              name="accountNumber"
              placeholder="501000••••••••"
              value={form.accountNumber}
              onChange={handleChange}
              inputClassName="bento-bank-input"
              className="bento-bank-input"
            />

            <Input
              label="IFSC Code"
              name="ifscCode"
              placeholder="e.g. HDFC0001234"
              value={form.ifscCode}
              onChange={handleChange}
              inputClassName="bento-bank-input"
              className="bento-bank-input"
            />

            <Input
              label="Branch Name"
              name="branchName"
              placeholder="e.g. Connaught Place"
              value={form.branchName}
              onChange={handleChange}
              inputClassName="bento-bank-input"
              className="bento-bank-input"
            />
          </div>

          {/* FOOTER */}
          <div className="bento-bank-footer">
            <div className="bento-status-pill">
              <span className="pulse-dot" />

              {bankLoading
                ? "Loading Bank Account..."
                : profile?.bank?._id
                ? "Verified Payout Account"
                : "Bank Account Not Added"}
            </div>

            <Button
              type="submit"
              className="bento-save-btn"
              disabled={
                loading || bankLoading
              }
            >
              <span>
                {bankLoading
                  ? "Loading..."
                  : loading
                  ? "Saving..."
                  : "Save Bank Details"}
              </span>

              <svg
                className="btn-arrow-icon"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BankSettings;