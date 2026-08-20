import { useState } from "react";
import ProfileHeader from "../../components/profile/ProfileHeader";
import ProfileDetails from "../../components/profile/ProfileDetails";
import EditProfile from "../../components/profile/EditProfile";
import ConsultationRates from "../../components/profile/ConsultationRates";
import { usePartner } from "../../hooks/usePartner";

const Profile = () => {
  const { profile, updateSection } = usePartner();
  const [editing, setEditing] = useState(false);

  const displayProfile = {
    fullName: profile.personal.fullName || "Radhika Sharma",
    city: profile.personal.city || "Jaipur",
    language: profile.personal.language || "Hindi",
    experience: profile.professional.experience || "6-10 years",
    bio:
      profile.professional.bio ||
      "Vedic astrologer specializing in career and relationship guidance.",
  };

  const rates = {
    chatRate: profile.professional.chatRate || 12,
    callRate: profile.professional.callRate || 20,
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <ProfileHeader
        name={displayProfile.fullName}
        specialization={
          profile.professional.specialization || "Vedic Astrology"
        }
        rating={4.8}
      />
      {editing ? (
        <EditProfile
          profile={displayProfile}
          onSave={(data) => {
            updateSection("personal", data);
            setEditing(false);
          }}
        />
      ) : (
        <div>
          <ProfileDetails profile={displayProfile} />
          <button
            onClick={() => setEditing(true)}
            style={{
              marginTop: 12,
              background: "none",
              border: "none",
              color: "var(--color-primary)",
              fontWeight: 600,
              cursor: "pointer",
              fontSize: "0.88rem",
            }}
          >
            Edit profile
          </button>
        </div>
      )}
      <ConsultationRates
        rates={rates}
        onSave={(data) => updateSection("professional", data)}
      />
    </div>
  );
};

export default Profile;
