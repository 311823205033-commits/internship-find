export default function JobCard({ job, onTrack }) {
  return (
    <article className="job-card reveal">
      <div className="job-card-top">
        <div className="company-avatar" aria-hidden="true">{job.company.slice(0, 1)}</div>
        <span className="badge">{job.category}</span>
      </div>
      <h3>{job.title}</h3>
      <p className="company-name">{job.company}</p>
      <div className="job-meta">
        <span><span aria-hidden="true">⌖</span> {job.location}</span>
        <span><span aria-hidden="true">◷</span> {job.type}</span>
      </div>
      <div className="job-card-actions">
        <a className="button button-outline button-small" href={`https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(`${job.title} ${job.company}`)}`} target="_blank" rel="noreferrer">Apply link <span aria-hidden="true">↗</span></a>
        <button className="button button-green button-small" type="button" onClick={() => onTrack(job)}>Track application</button>
      </div>
    </article>
  );
}
