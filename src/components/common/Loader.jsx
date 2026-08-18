import './Loader.css';

const Loader = ({ size = 32, label }) => (
  <div className="loader-wrap">
    <span className="loader-ring" style={{ width: size, height: size }} />
    {label && <p className="loader-label">{label}</p>}
  </div>
);

export default Loader;
