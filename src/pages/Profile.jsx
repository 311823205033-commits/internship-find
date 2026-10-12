export default function ProfilePage({ user, onLogout }) {
  if (!user) {
    return (
      <main className="container page-content narrow-content">
        <div className="empty-state auth-empty-state">
          <span className="empty-icon">◌</span>
          <h2>Please log in to view your profile.</h2>
          <a className="button button-green" href="#/login">Go to login</a>
        </div>
      </main>
    );
  }

  return (
    <main className="container page-content narrow-content">
      <section className="page-intro reveal">
        <span className="eyebrow"><span className="eyebrow-dot" /> STUDENT PROFILE</span>
        <h1>Your <span>career profile.</span></h1>
      </section>

      <section className="form-card reveal profile-card">
        <div className="profile-header">
          <div className="profile-avatar">{user.name?.charAt(0)?.toUpperCase() || 'S'}</div>
          <div>
            <h2>{user.name}</h2>
            <p>{user.email}</p>
          </div>
        </div>

        <div className="profile-details">
          <div>
            <small>Member since</small>
            <strong>{new Date(user.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</strong>
          </div>
          <div>
            <small>Account status</small>
            <strong>Active</strong>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="button button-green" onClick={onLogout}>Logout</button>
          <a href="#/applications" className="button button-light">View applications</a>
        </div>
      </section>
    </main>
  );
}
