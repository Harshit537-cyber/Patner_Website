import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Camera,
  FileCheck2,
  BadgeCheck,
  MapPin,
  Upload,
  ShieldCheck,
  Clock3,
  XCircle,
} from "lucide-react";
import { getKycStatus, uploadKyc } from "../../services/partner";
import "./KYC.css";

const documentConfig = [
  {
    key: "selfie",
    title: "Selfie",
    description: "Clear recent photo of yourself",
    icon: Camera,
  },
  {
    key: "nationalId",
    title: "National ID",
    description: "Aadhaar, passport or driving licence",
    icon: FileCheck2,
  },
  {
    key: "astrologyCertificate",
    title: "Astrology Certificate",
    description: "Your valid astrology certification",
    icon: BadgeCheck,
  },
  {
    key: "addressProof",
    title: "Address Proof",
    description: "Recent document showing your address",
    icon: MapPin,
  },
];

const KYC = () => {
  const [files, setFiles] = useState({
    selfie: null,
    nationalId: null,
    astrologyCertificate: null,
    addressProof: null,
  });

  const [kycData, setKycData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchKycStatus = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getKycStatus();
      setKycData(response);
    } catch (err) {
      setError(err.message || "Failed to load KYC status");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKycStatus();
  }, []);

  const handleFileChange = (field, event) => {
    const file = event.target.files?.[0] || null;

    setFiles((prev) => ({
      ...prev,
      [field]: file,
    }));

    setMessage("");
    setError("");
  };

  const handleUpload = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");

    const missing = documentConfig.some(
      (document) => !files[document.key]
    );

    if (missing) {
      setError("Please select all four KYC documents.");
      return;
    }

    try {
      setUploading(true);

      const response = await uploadKyc(files);

      setKycData(response);
      setMessage("KYC documents uploaded successfully.");

      setFiles({
        selfie: null,
        nationalId: null,
        astrologyCertificate: null,
        addressProof: null,
      });

      await fetchKycStatus();
    } catch (err) {
      setError(err.message || "KYC upload failed");
    } finally {
      setUploading(false);
    }
  };

  const status = kycData?.kycStatus || kycData?.status || "Pending";

  const getDocumentStatus = (key) =>
    kycData?.[key]?.status || "Not uploaded";

  const getStatusClass = (value) => {
    const normalized = String(value).toLowerCase();

    if (normalized === "approved") return "approved";
    if (normalized === "rejected") return "rejected";
    if (normalized === "pending") return "pending";

    return "not-uploaded";
  };

  if (loading) {
    return (
      <div className="kyc-page">
        <div className="kyc-loading-card">
          <div className="kyc-loader">
            <ShieldCheck size={30} />
          </div>
          <h2>Loading KYC status</h2>
          <p>Checking your verification details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="kyc-page">
      <motion.div
        className="kyc-glow kyc-glow-left"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.55, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="kyc-glow kyc-glow-right"
        animate={{
          scale: [1, 1.25, 1],
          opacity: [0.25, 0.5, 0.25],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="kyc-container">
        <motion.div
          className="kyc-hero-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="kyc-hero-content">
            <div className="kyc-eyebrow">
              <ShieldCheck size={15} />
              Identity Verification
            </div>

            <h1>Complete your KYC</h1>

            <p>
              Upload your verification documents to activate your
              AstroNarhari partner profile.
            </p>
          </div>

          <div className={`kyc-main-status ${getStatusClass(status)}`}>
            {String(status).toLowerCase() === "approved" ? (
              <BadgeCheck size={18} />
            ) : String(status).toLowerCase() === "rejected" ? (
              <XCircle size={18} />
            ) : (
              <Clock3 size={18} />
            )}
            <span>{status}</span>
          </div>
        </motion.div>

        {message && (
          <motion.div
            className="kyc-alert kyc-success"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <BadgeCheck size={20} />
            <span>{message}</span>
          </motion.div>
        )}

        {error && (
          <motion.div
            className="kyc-alert kyc-error"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <XCircle size={20} />
            <span>{error}</span>
          </motion.div>
        )}

        <form onSubmit={handleUpload}>
          <div className="kyc-section-heading">
            <div>
              <span className="kyc-section-label">DOCUMENTS</span>
              <h2>Verification documents</h2>
              <p>
                Upload clear and readable copies of all required
                documents.
              </p>
            </div>

            <div className="kyc-security">
              <ShieldCheck size={18} />
              Secure & private
            </div>
          </div>

          <div className="kyc-document-grid">
            {documentConfig.map((document, index) => {
              const Icon = document.icon;
              const documentStatus = getDocumentStatus(document.key);
              const selectedFile = files[document.key];

              return (
                <motion.label
                  key={document.key}
                  className="kyc-document-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.45,
                    delay: index * 0.08,
                  }}
                  whileHover={{ y: -5 }}
                >
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(event) =>
                      handleFileChange(document.key, event)
                    }
                  />

                  <div className="kyc-document-top">
                    <div className="kyc-document-icon">
                      <Icon size={23} />
                    </div>

                    <span
                      className={`kyc-document-status ${getStatusClass(
                        documentStatus
                      )}`}
                    >
                      {documentStatus}
                    </span>
                  </div>

                  <div className="kyc-document-info">
                    <h3>{document.title}</h3>
                    <p>{document.description}</p>
                  </div>

                  <div
                    className={`kyc-upload-box ${
                      selectedFile ? "selected" : ""
                    }`}
                  >
                    <Upload size={20} />

                    <div>
                      <strong>
                        {selectedFile
                          ? selectedFile.name
                          : "Choose file"}
                      </strong>

                      <span>
                        {selectedFile
                          ? "File selected"
                          : "PNG, JPG or PDF"}
                      </span>
                    </div>
                  </div>
                </motion.label>
              );
            })}
          </div>

          <motion.button
            type="submit"
            className="kyc-submit-button"
            disabled={uploading}
            whileHover={{ scale: uploading ? 1 : 1.01 }}
            whileTap={{ scale: uploading ? 1 : 0.98 }}
          >
            <Upload size={19} />
            {uploading ? "Uploading documents..." : "Submit KYC Documents"}
          </motion.button>
        </form>

        <div className="kyc-footer-note">
          <ShieldCheck size={18} />
          <div>
            <strong>Your documents are protected</strong>
            <span>
              Your KYC information is securely processed and used only
              for partner verification.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KYC;