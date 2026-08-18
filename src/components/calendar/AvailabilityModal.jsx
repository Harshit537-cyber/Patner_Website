import { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import TimeSlot from './TimeSlot';

const ALL_SLOTS = ['09:00', '10:00', '11:00', '12:00', '15:00', '16:00', '17:00', '18:00', '19:00'];

const AvailabilityModal = ({ open, onClose, initialSlots = [], onSave }) => {
  const [slots, setSlots] = useState(initialSlots);

  const toggle = (slot) =>
    setSlots((prev) => (prev.includes(slot) ? prev.filter((s) => s !== slot) : [...prev, slot]));

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Update availability"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={() => { onSave(slots); onClose(); }}>Save</Button>
        </>
      }
    >
      <p style={{ fontSize: '0.85rem', color: 'var(--color-muted)', marginBottom: 14 }}>
        Select the time slots you're available for consultations.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
        {ALL_SLOTS.map((slot) => (
          <TimeSlot key={slot} time={slot} selected={slots.includes(slot)} onClick={() => toggle(slot)} />
        ))}
      </div>
    </Modal>
  );
};

export default AvailabilityModal;
