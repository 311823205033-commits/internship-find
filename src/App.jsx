import { useEffect, useState } from 'react';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import Jobs, { jobs } from './pages/Jobs.jsx';
import AddApplication from './pages/AddApplication.jsx';
import Applications from './pages/Applications.jsx';
import LoginPage from './pages/Login.jsx';
import RegisterPage from './pages/Register.jsx';
import ProfilePage from './pages/Profile.jsx';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const validRoutes = ['#/', '#/jobs', '#/add-application', '#/applications', '#/login', '#/register', '#/profile'];
const protectedRoutes = new Set(['#/add-application', '#/applications', '#/profile']);

function normalizeHash() {
  const hash = window.location.hash || '#/';
  return validRoutes.includes(hash) ? hash : '#/';
}

async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  const contentType = response.headers.get('content-type') || '';
  const payload = contentType.includes('application/json') ? await response.json() : { message: await response.text() };

  return {
    ok: response.ok,
    status: response.status,
    data: payload,
  };
}

export default function App() {
  const [currentPage, setCurrentPage] = useState(() => normalizeHash());
  const [authUser, setAuthUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [applications, setApplications] = useState([]);
  const [applicationsLoading, setApplicationsLoading] = useState(false);
  const [prefillJob, setPrefillJob] = useState(null);

  useEffect(() => {
    function syncPageWithHash() {
      setCurrentPage(normalizeHash());
    }

    window.addEventListener('hashchange', syncPageWithHash);
    return () => window.removeEventListener('hashchange', syncPageWithHash);
  }, []);

  useEffect(() => {
    async function checkAuth() {
      setAuthLoading(true);
      try {
        const result = await apiRequest('/api/auth/me');
        if (result.ok && result.data?.student) {
          setAuthUser(result.data.student);
        } else {
          setAuthUser(null);
        }
      } catch (error) {
        setAuthUser(null);
      } finally {
        setAuthLoading(false);
      }
    }

    checkAuth();
  }, []);

  useEffect(() => {
    if (authLoading) return;

    if (!authUser && protectedRoutes.has(currentPage)) {
      sessionStorage.setItem('jobTrackerRedirect', currentPage);
      window.location.hash = '#/login';
      return;
    }

    if (authUser && (currentPage === '#/login' || currentPage === '#/register')) {
      const redirectTarget = sessionStorage.getItem('jobTrackerRedirect') || '#/applications';
      sessionStorage.removeItem('jobTrackerRedirect');
      window.location.hash = redirectTarget;
    }
  }, [authLoading, authUser, currentPage]);

  useEffect(() => {
    if (!authUser) {
      setApplications([]);
      return;
    }

    let isMounted = true;

    async function loadApplications() {
      setApplicationsLoading(true);
      try {
        const result = await apiRequest('/api/applications');
        if (!isMounted) return;
        if (result.ok) {
          setApplications(result.data.applications || []);
        } else {
          setApplications([]);
        }
      } catch (error) {
        if (isMounted) {
          setApplications([]);
        }
      } finally {
        if (isMounted) {
          setApplicationsLoading(false);
        }
      }
    }

    loadApplications();
    return () => {
      isMounted = false;
    };
  }, [authUser]);

  function handleAuthSuccess(student) {
    setAuthUser(student);
    const redirectTarget = sessionStorage.getItem('jobTrackerRedirect') || '#/applications';
    sessionStorage.removeItem('jobTrackerRedirect');
    window.location.hash = redirectTarget;
  }

  async function trackJob(job) {
    if (!authUser) {
      sessionStorage.setItem('jobTrackerRedirect', '#/add-application');
      window.location.hash = '#/login';
      return;
    }

    setPrefillJob(job);
    window.location.hash = '#/add-application';
  }

  async function saveApplication(application) {
    if (!authUser) {
      return { ok: false, message: 'You must be logged in to save applications.' };
    }

    const result = await apiRequest('/api/applications', {
      method: 'POST',
      body: JSON.stringify({
        ...application,
        studentName: authUser.name || application.studentName,
        email: authUser.email || application.email,
      }),
    });

    if (!result.ok) {
      return {
        ok: false,
        message: result.data?.message || 'Unable to save application.',
      };
    }

    const nextApplication = result.data.application;
    setApplications((current) => [nextApplication, ...current]);
    setPrefillJob(null);
    return {
      ok: true,
      message: result.data.message || 'Application saved successfully.',
    };
  }

  async function deleteApplication(id) {
    const result = await apiRequest(`/api/applications/${id}`, { method: 'DELETE' });

    if (!result.ok) {
      return false;
    }

    setApplications((current) => current.filter((application) => application.id !== id));
    return true;
  }

  async function logout() {
    try {
      await apiRequest('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout request failed:', error);
    }

    sessionStorage.removeItem('jobTrackerRedirect');
    setAuthUser(null);
    setApplications([]);
    window.location.hash = '#/login';
  }

  let page;
  switch (currentPage) {
    case '#/jobs':
      page = <Jobs onTrack={trackJob} />;
      break;
    case '#/add-application':
      page = <AddApplication prefillJob={prefillJob} onSave={saveApplication} authUser={authUser} />;
      break;
    case '#/applications':
      page = <Applications applications={applications} onDelete={deleteApplication} loading={applicationsLoading} />;
      break;
    case '#/login':
      page = <LoginPage onAuthSuccess={handleAuthSuccess} />;
      break;
    case '#/register':
      page = <RegisterPage onAuthSuccess={handleAuthSuccess} />;
      break;
    case '#/profile':
      page = <ProfilePage user={authUser} onLogout={logout} />;
      break;
    default:
      page = <Home jobCount={jobs.length} applications={applications} featuredJobs={jobs.slice(0, 3)} onTrack={trackJob} />;
  }

  return (
    <div className="app-shell">
      <Navbar currentPage={currentPage} user={authUser} onLogout={logout} />
      {authLoading ? (
        <div className="session-loading" role="status" aria-live="polite">
          <div className="loading-spinner" aria-hidden="true" />
          Checking your session...
        </div>
      ) : (
        page
      )}
      <Footer />
    </div>
  );
}
