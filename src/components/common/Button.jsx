import './Button.css';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  type = 'button',
  onClick,
  ...rest
}) => {
  return (
    <button
      type={type}
      className={`btn btn-${variant} btn-${size} ${fullWidth ? 'btn-full' : ''}`}
      disabled={disabled || loading}
      onClick={onClick}
      {...rest}
    >
      {loading ? <span className="btn-spinner" aria-hidden="true" /> : children}
    </button>
  );
};

export default Button;
