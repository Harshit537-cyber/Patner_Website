import { useEffect, useState } from 'react';
import CalendarView from '../../components/calendar/CalendarView';
import AvailabilityModal from '../../components/calendar/AvailabilityModal';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import { getAvailability, updateAvailability } from '../../services/calendar';

const Calendar = () => {
  const [availability, setAvailability] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    getAvailability().then(setAvailability);
  }, []);

  if (!availability) return <Loader label="Loading calendar..." />;

  const handleSave = async (slots) => {
    const updated = { ...availability, slots };
    setAvailability(updated);
    await updateAvailability(updated);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div className="page-toolbar" style={{ marginBottom: 0 }}>
        <h2 style={{ margin: 0, fontSize: '1.1rem' }}>Your calendar</h2>
        <Button onClick={() => setModalOpen(true)}>Edit time slots</Button>
      </div>
      <CalendarView workingDays={availability.workingDays} />
      <div className="page-card">
        <h3 style={{ marginTop: 0, fontSize: '1rem' }}>Available time slots</h3>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 12 }}>
          {availability.slots.map((slot) => (
            <span key={slot} style={{ padding: '8px 14px', borderRadius: 999, background: 'var(--color-soft-purple-bg)', color: 'var(--color-primary-dark)', fontSize: '0.85rem', fontWeight: 600 }}>
              {slot}
            </span>
          ))}
        </div>
      </div>
      <AvailabilityModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        initialSlots={availability.slots}
        onSave={handleSave}
      />
    </div>
  );
};

export default Calendar;
