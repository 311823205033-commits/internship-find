import { useMemo, useState } from 'react';

const statusOptions = ['All', 'Applied', 'Interview', 'Selected', 'Rejected'];

export default function Applications({ applications, onDelete, loading }) {
  const [statusFilter, setStatusFilter] = useState('All');
  const shownApplications = useMemo(() => statusFilter === 'All' ? applications : applications.filter((application) => application.status === statusFilter), [applications, statusFilter]);
  const interviewCount = applications.filter((application) => application.status === 'Interview').length;
  const selectedCount = applications.filter((application) => application.status === 'Selected').length;
  const followUpCount = applications.filter((application) => application.status === 'Applied').length;

  async function confirmDelete(application) {
    if (window.confirm(`Delete the application for ${application.jobTitle} at ${application.companyName}?`)) {
      const result = await onDelete(application.id);
      if (!result) {
        window.alert('You can only delete your own applications.');
      }
    }
  }

  return (
    <main className="container page-content">
      <section className="page-intro reveal dashboard-intro">
        <div><span className="eyebrow"><span className="eyebrow-dot" /> YOUR CAREER DASHBOARD</span><h1>Your journey, <span>in view.</span></h1><p>Every application is progress. Keep your next steps organized here.</p></div>
        <a className="button button-green" href="#/add-application">＋ Add application</a>
      </section>
      <section className="dashboard-summary reveal" aria-label="Application overview">
        <div className="dashboard-stat"><span className="summary-icon summary-icon-mint">▤</span><div><small>Total applications</small><strong>{applications.length}</strong></div></div>
        <div className="dashboard-stat"><span className="summary-icon summary-icon-teal">◷</span><div><small>Interviews</small><strong>{interviewCount}</strong></div></div>
        <div className="dashboard-stat"><span className="summary-icon summary-icon-mint">✓</span><div><small>Selected</small><strong>{selectedCount}</strong></div></div>
        <div className="dashboard-stat"><span className="summary-icon summary-icon-followup">↗</span><div><small>To follow up</small><strong>{followUpCount}</strong></div></div>
      </section>
      <section className="applications-section">
        <div className="section-heading applications-heading"><div><span className="eyebrow">YOUR OPPORTUNITIES</span><h2>Tracked applications <span className="count-pill">{applications.length}</span></h2></div><label className="status-filter">Filter status <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>{statusOptions.map((status) => <option key={status}>{status}</option>)}</select></label></div>
        {loading ? (
          <div className="session-loading small-session-loading" role="status" aria-live="polite">
            <div className="loading-spinner" aria-hidden="true" />
            Loading applications...
          </div>
        ) : shownApplications.length ? (
          <div className="applications-grid">{shownApplications.map((application) => (
            <article className="application-card reveal" key={application.id}>
              <div className="application-card-top"><div className="company-avatar">{application.companyName.slice(0, 1).toUpperCase()}</div><span className={`status-badge status-${application.status.toLowerCase()}`}>{application.status}</span></div>
              <h3>{application.jobTitle}</h3><p className="company-name">{application.companyName}</p>
              <div className="application-details"><span><small>STUDENT</small><strong>{application.studentName}</strong></span><span><small>APPLIED ON</small><strong>{new Date(`${application.applicationDate}T00:00:00`).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</strong></span></div>
              <div className="application-card-footer"><span className="application-step"><i /> {application.status === 'Selected' ? 'Milestone reached' : application.status === 'Rejected' ? 'Keep moving forward' : 'Next step ahead'}</span><button className="delete-button" type="button" onClick={() => confirmDelete(application)} aria-label={`Delete ${application.jobTitle} application`}>Delete</button></div>
            </article>
          ))}</div>
        ) : (
          <div className="empty-state"><span className="empty-icon">▤</span><h2>No applications found</h2><p>{applications.length ? 'There are no applications in this status. Try another filter.' : 'Once you apply for a role, add it here to keep your career journey organized.'}</p>{!applications.length && <a className="button button-green" href="#/add-application">Add your first application</a>}</div>
        )}
      </section>
    </main>
  );
}
