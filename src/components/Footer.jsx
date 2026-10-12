export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-content">
        <span>Student Job Tracker <span className="footer-divider">|</span> Mini Project</span>
        <span>© {new Date().getFullYear()} Student Job Tracker</span>
      </div>
    </footer>
  );
}
