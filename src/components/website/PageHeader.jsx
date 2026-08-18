const PageHeader = ({ eyebrow, title, subtitle }) => (
  <section className="section" style={{ paddingBottom: 40, textAlign: 'center' }}>
    <div className="container" style={{ maxWidth: 680, margin: '0 auto' }}>
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h1 style={{ fontSize: '2.4rem' }}>{title}</h1>
      {subtitle && <p style={{ fontSize: '1.05rem' }}>{subtitle}</p>}
    </div>
  </section>
);

export default PageHeader;
