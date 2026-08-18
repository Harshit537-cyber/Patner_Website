import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import OnboardingLayout from "./OnboardingLayout";
import Input from "../../components/common/Input";
import Select from "../../components/common/Select";
import Button from "../../components/common/Button";
import { usePartner } from "../../hooks/usePartner";
import { isValidPAN } from "../../utils/validators";
import { api } from "../../services/api";

const KYC = () => {
  const { profile, updateSection } = usePartner();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    idType: profile.kyc.idType || "",
    idNumber: profile.kyc.idNumber || "",
    pan: profile.kyc.pan || "",
  });

  const [files, setFiles] = useState({
    selfie: null,
    nationalId: null,
    astrologyCertificate: null,
    addressProof: null,
  });

  const [kycStatus, setKycStatus] = useState("Pending");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(true);

  useEffect(() => {
    const fetchKycStatus = async () => {
      try {
        const response = await api.get("/partner/kyc/status");

        setKycStatus(response?.kycStatus || "Pending");
      } catch (err) {
        console.error("KYC STATUS ERROR:", err);
      } finally {
        setStatusLoading(false);
      }
    };

    fetchKycStatus();
  }, []);

  const handleChange = (e) => {
    setForm((f) => ({
      ...f,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target;

    setFiles((prev) => ({
      ...prev,
      [name]: selectedFiles?.[0] || null,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.pan && !isValidPAN(form.pan)) {
      setError("Enter a valid PAN, e.g. ABCDE1234F");
      return;
    }

    if (
      !files.selfie ||
      !files.nationalId ||
      !files.astrologyCertificate ||
      !files.addressProof
    ) {
      setError("Please upload all KYC documents.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const formData = new FormData();

      formData.append("selfie", files.selfie);
      formData.append("nationalId", files.nationalId);
      formData.append(
        "astrologyCertificate",
        files.astrologyCertificate
      );
      formData.append("addressProof", files.addressProof);

      const response = await api.post(
        "/partner/kyc/upload",
        formData
      );

      console.log("KYC UPLOAD RESPONSE:", response);

      updateSection("kyc", form);

      setKycStatus(response?.kycStatus || "Pending");

      navigate("/onboarding/documents");
    } catch (err) {
      console.error("KYC UPLOAD ERROR:", err);
      setError(
        err.message || "KYC documents upload failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <OnboardingLayout
      activeKey="kyc"
      title="Identity verification"
      subtitle="Used only to confirm your identity — never shown to clients"
    >
      <form onSubmit={handleSubmit}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
            padding: "12px 16px",
            borderRadius: 10,
            background: "#f7f3fb",
          }}
        >
          <strong>KYC Status</strong>

          <span
            style={{
              fontWeight: 600,
              color:
                kycStatus === "Approved"
                  ? "#2e7d32"
                  : kycStatus === "Rejected"
                  ? "#c62828"
                  : "#ef6c00",
            }}
          >
            {statusLoading ? "Checking..." : kycStatus}
          </span>
        </div>

        <div className="onboarding-grid">
          <Select
            label="ID proof type"
            name="idType"
            value={form.idType}
            onChange={handleChange}
            options={[
              "Aadhaar Card",
              "PAN Card",
              "Passport",
              "Driving Licence",
            ]}
          />

          <Input
            label="ID number"
            name="idNumber"
            value={form.idNumber}
            onChange={handleChange}
            required
          />
        </div>

        <Input
          label="PAN number"
          name="pan"
          placeholder="ABCDE1234F"
          value={form.pan}
          error={error}
          onChange={handleChange}
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(250px, 1fr))",
            gap: 16,
            marginTop: 20,
          }}
        >
          <div>
            <label>Selfie</label>
            <input
              type="file"
              name="selfie"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>

          <div>
            <label>National ID</label>
            <input
              type="file"
              name="nationalId"
              accept="image/*,.pdf"
              onChange={handleFileChange}
            />
          </div>

          <div>
            <label>Astrology Certificate</label>
            <input
              type="file"
              name="astrologyCertificate"
              accept="image/*,.pdf"
              onChange={handleFileChange}
            />
          </div>

          <div>
            <label>Address Proof</label>
            <input
              type="file"
              name="addressProof"
              accept="image/*,.pdf"
              onChange={handleFileChange}
            />
          </div>
        </div>

        {error && (
          <div
            style={{
              marginTop: 16,
              padding: 12,
              borderRadius: 8,
              background: "#ffebee",
              color: "#c62828",
            }}
          >
            {error}
          </div>
        )}

        <div className="onboarding-actions">
          <Button
            type="button"
            variant="ghost"
            onClick={() =>
              navigate("/onboarding/professional-details")
            }
            disabled={loading}
          >
            Back
          </Button>

          <Button type="submit" disabled={loading}>
            {loading ? "Uploading..." : "Continue"}
          </Button>
        </div>
      </form>
    </OnboardingLayout>
  );
};

export default KYC;