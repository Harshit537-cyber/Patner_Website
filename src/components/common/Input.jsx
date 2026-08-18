import './Input.css';

const Input = ({ label, error, hint, id, ...rest }) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="field">
      {label && <label htmlFor={inputId} className="field-label">{label}</label>}
      <input id={inputId} className={`field-input ${error ? 'field-input-error' : ''}`} {...rest} />
      {hint && !error && <span className="field-hint">{hint}</span>}
      {error && <span className="field-error">{error}</span>}
    </div>
  );
};

export default Input;
