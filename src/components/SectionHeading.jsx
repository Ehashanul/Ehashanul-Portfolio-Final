export default function SectionHeading({ number, label, title, accent, description, action, id }) {
  return <header className="portfolio-section-heading">
    <div className="portfolio-section-meta"><span>{number} / {label}</span><span aria-hidden="true" /></div>
    <div className="portfolio-section-heading-row"><h2 id={id}>{title} <span>{accent}</span></h2>{(description || action) && <div className="portfolio-section-heading-aside">{description && <p>{description}</p>}{action}</div>}</div>
  </header>;
}
