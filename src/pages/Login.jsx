import { useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function LoginPage({ onAuthSuccess }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: '' }));
    setMessage('');
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const nextErrors = {};
    if (!form.email.trim()) nextErrors.email = 'Email is required.';
    if (!form.password) nextErrors.password = 'Password is required.';

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email.trim(),
          password: form.password,
        }),
      });

      const payload = await response.json();

      if (!response.ok) {
        setMessage(payload.message || 'Unable to log in. Please try again.');
        return;
      }

      onAuthSuccess(payload.student);
    } catch (error) {
      setMessage('We could not reach the server. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="container page-content narrow-content">
      <section className="auth-shell reveal">
        <div className="auth-panel auth-panel-green">
          <span className="eyebrow"><span className="eyebrow-dot" /> STUDENT ACCESS</span>
          <h1>Welcome back.</h1>
          <p>Log in to keep your internship plans, applications, and next steps organized.</p>
          <div className="auth-points">
            <span>✓ Track your applications</span>
            <span>✓ Keep your search organized</span>
            <span>✓ Focus on the next opportunity</span>
          </div>
        </div>

        <div className="auth-panel auth-form-panel">
          <div className="auth-panel-heading">
            <h2>Student Login</h2>
            <p>Access your dashboard</p>
          </div>

          {message && (
            <div className="form-alert form-alert-error" role="alert">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <label className="form-field auth-field">
              Email address
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={updateField}
                placeholder="student@example.com"
                aria-invalid={Boolean(errors.email)}
              />
              {errors.email && <small className="field-error">{errors.email}</small>}
            </label>

            <label className="form-field auth-field">
              Password
              <div className="password-field">
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={updateField}
                  placeholder="Enter your password"
                  aria-invalid={Boolean(errors.password)}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              {errors.password && <small className="field-error">{errors.password}</small>}
            </label>

            <button type="submit" className="button button-green auth-submit" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p className="auth-switch">
            Need an account? <a href="#/register">Create one</a>
          </p>
        </div>
      </section>
    </main>
  );
}
