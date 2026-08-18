import './Input.css';

const Select = ({ label, error, options = [], id, placeholder = 'Select an option', ...rest }) => {
  const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="field">
      {label && <label htmlFor={selectId} className="field-label">{label}</label>}
      <select id={selectId} className={`field-input ${error ? 'field-input-error' : ''}`} {...rest}>
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value ?? opt} value={opt.value ?? opt}>
            {opt.label ?? opt}
          </option>
        ))}
      </select>
      {error && <span className="field-error">{error}</span>}
    </div>
  );
};

export default Select;
