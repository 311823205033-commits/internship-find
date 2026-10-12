import JobCard from '../components/JobCard.jsx';

export default function Home({ jobCount, applications, featuredJobs, onTrack }) {
  const inProgress = applications.filter((application) => ['Applied', 'Interview'].includes(application.status)).length;
  const progress = applications.length ? Math.min(100, Math.round((inProgress / applications.length) * 100)) : 0;
  const interviews = applications.filter((application) => application.status === 'Interview').length;
  const selected = applications.filter((application) => application.status === 'Selected').length;

  return (
    <main className="container page-content">
      <section className="hero-card reveal">
        <div className="hero-copy">
          <span className="eyebrow"><span className="eyebrow-dot" /> YOUR NEXT CHAPTER STARTS HERE</span>
          <h1>Small steps today.<br /><span>Big careers tomorrow.</span></h1>
          <p>Discover internship opportunities, stay on top of applications, and build momentum toward your future.</p>
          <div className="hero-actions">
            <a className="button button-green" href="#/jobs">Explore Opportunities <span aria-hidden="true">→</span></a>
            <a className="button button-light" href="#/applications">Track Applications</a>
          </div>
          <div className="hero-note"><span aria-hidden="true">✳</span> Your next step starts here.</div>
        </div>
        <div className="hero-art" aria-label="Career growth illustration" role="img">
          <div className="art-sun" />
          <div className="art-card art-chart"><strong>Career growth</strong><div className="chart-bars" aria-hidden="true"><i /><i /><i /><i /><i /><i /></div><small>One step at a time</small></div>
          <div className="art-card art-card-front"><span className="art-check">↗</span><div><strong>Keep going</strong><small>Your next opportunity awaits</small></div></div>
          <div className="art-plant"><i /><i /><i /><b /></div>
          <span className="art-sparkle sparkle-one">✦</span><span className="art-sparkle sparkle-two">✳</span>
        </div>
      </section>

      <section className="stats-grid" aria-label="Your tracker summary">
        <article className="stat-card reveal"><span className="stat-icon icon-green">⌕</span><div><p>Total opportunities</p><strong>{jobCount}</strong><small>In the directory</small></div></article>
        <article className="stat-card reveal"><span className="stat-icon icon-green">▤</span><div><p>Total applications</p><strong>{applications.length}</strong><small>Tracked by you</small></div></article>
        <article className="stat-card reveal"><span className="stat-icon icon-teal">◷</span><div><p>Interviews</p><strong>{interviews}</strong><small>Next steps in progress</small></div></article>
        <article className="stat-card reveal"><span className="stat-icon icon-green">✓</span><div><p>Selected</p><strong>{selected}</strong><small>Career milestones</small></div></article>
      </section>

      <section className="progress-section reveal">
        <div className="section-heading"><div><span className="eyebrow">KEEP MOVING FORWARD</span><h2>Your career progress</h2></div><a className="text-link" href="#/applications">View applications <span aria-hidden="true">→</span></a></div>
        <div className="progress-card">
          <div className="progress-message"><div className="progress-symbol">✦</div><div><strong>Every application is a step forward.</strong><p>{applications.length} {applications.length === 1 ? 'application' : 'applications'} tracked so far.</p></div></div>
          <div className="progress-track-wrap"><div className="progress-track" role="progressbar" aria-label="Applications in progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow={progress}><span style={{ width: `${progress}%` }} /></div><small>{applications.length ? `${inProgress} of ${applications.length} applications in progress` : 'Start by finding an internship that inspires you'}</small></div>
          <a className="button button-green button-small" href="#/add-application">＋ Add an application</a>
        </div>
      </section>
      <section className="featured-section reveal">
        <div className="section-heading"><div><span className="eyebrow">A PLACE TO BEGIN</span><h2>Featured opportunities</h2></div><a className="text-link" href="#/jobs">View all jobs <span aria-hidden="true">→</span></a></div>
        <div className="jobs-grid">{featuredJobs.map((job) => <JobCard key={job.id} job={job} onTrack={onTrack} />)}</div>
      </section>
      <section className="home-tip"><span aria-hidden="true">☘</span><p><strong>A little career tip</strong> — Stay curious, keep learning, and remember: your first internship is just the beginning.</p></section>
    </main>
  );
}
