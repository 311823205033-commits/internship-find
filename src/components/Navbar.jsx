const defaultLinks = [
  { label: 'Home', path: '#/' },
  { label: 'Jobs', path: '#/jobs' },
  { label: 'Add Application', path: '#/add-application' },
  { label: 'Applications', path: '#/applications' },
];

export default function Navbar({ currentPage, user, onLogout }) {
  const links = user ? [...defaultLinks, { label: 'Profile', path: '#/profile' }] : defaultLinks;

  return (
    <header className="site-header">
      <nav className="navbar container" aria-label="Main navigation">
        <a className="brand" href="#/" aria-label="Job Tracker home">
          <span className="brand-mark" aria-hidden="true">↗</span>
          <span>Job Tracker</span>
        </a>

        <div className="nav-links">
          {links.map((link) => {
            const active = currentPage === link.path;
            return (
              <a
                key={link.path}
                href={link.path}
                className={`nav-link${active ? ' active' : ''}`}
                aria-current={active ? 'page' : undefined}
              >
                {link.label}
              </a>
            );
          })}
        </div>
        <div className="nav-actions">
          {user ? (
            <>
              <a href="#/profile" className="user-chip" aria-label="Open student profile">
                <span className="user-avatar" aria-hidden="true">{user.name.trim().charAt(0).toUpperCase()}</span>
                <span>Hi, {user.name.split(' ')[0]}</span>
              </a>
              <button type="button" className="nav-logout" onClick={onLogout} aria-label="Log out">Logout</button>
            </>
          ) : (
            <a href="#/login" className={`nav-link nav-login${currentPage === '#/login' ? ' active' : ''}`}>
              Login <span aria-hidden="true">↗</span>
            </a>
          )}
        </div>
      </nav>
    </header>
  );
}
