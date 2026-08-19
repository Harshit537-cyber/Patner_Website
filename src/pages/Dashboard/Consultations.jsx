import { useEffect, useState } from "react";
import ConsultationTable from "../../components/consultations/ConsultationTable";
import ConsultationFilters from "../../components/consultations/ConsultationFilters";
import EmptyState from "../../components/common/EmptyState";
import Loader from "../../components/common/Loader";
import { getPartnerRequests } from "../../services/partner";

const Consultations = () => {
  const [all, setAll] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      setLoading(true);

      console.log("📋 Fetching partner booking requests...");

      const response = await getPartnerRequests();

      console.log("📋 getPartnerRequests result:", response);

      const bookings = Array.isArray(response)
        ? response
        : Array.isArray(response?.data)
        ? response.data
        : Array.isArray(response?.data?.data)
        ? response.data.data
        : [];

      console.log("📋 FINAL BOOKINGS:", bookings);
      console.log("📋 BOOKING COUNT:", bookings.length);

      setAll(bookings);
    } catch (error) {
      console.error("❌ Consultation API Error:", error);
      setAll([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // Don't hide valid bookings because of an unknown backend status
  const filtered =
    filter === "all"
      ? all
      : all.filter((booking) => {
          const status = String(booking?.status || "")
            .toLowerCase()
            .trim();

          return status === filter.toLowerCase();
        });

  console.log("📋 FILTER:", filter);
  console.log("📋 FILTERED BOOKINGS:", filtered);

  if (loading) {
    return <Loader label="Loading consultations..." />;
  }

  return (
    <div className="page-card">
      <div className="page-toolbar">
        <h2 style={{ margin: 0, fontSize: "1.1rem" }}>
          All consultations
        </h2>

        <ConsultationFilters
          active={filter}
          onChange={setFilter}
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No consultations here"
          description={
            all.length > 0
              ? `You have ${all.length} booking request(s), but none match the "${filter}" filter.`
              : "No booking requests were found."
          }
        />
      ) : (
        <ConsultationTable consultations={filtered} />
      )}
    </div>
  );
};

export default Consultations;