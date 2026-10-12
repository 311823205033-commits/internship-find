import { useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function RegisterPage({ onAuthSuccess }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: '' }));
    setMessage('');
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = 'Full name is required.';
    if (!form.email.trim()) nextErrors.email = 'Email is required.';
    if (!form.password) nextErrors.password = 'Password is required.';
    if (form.password.length < 8) nextErrors.password = 'Password must be at least 8 characters.';
    if (!form.confirmPassword) nextErrors.confirmPassword = 'Please confirm your password.';
    if (form.confirmPassword && form.confirmPassword !== form.password) {
      nextErrors.confirmPassword = 'Passwords do not match.';
    }

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
          confirmPassword: form.confirmPassword,
        }),
      });

      const payload = await response.json();

      if (!response.ok) {
        setMessage(payload.message || 'Registration failed. Please try again.');
        return;
      }

      setMessage('Registration successful. Redirecting...');
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
          <span className="eyebrow"><span className="eyebrow-dot" /> START YOUR JOURNEY</span>
          <h1>Build your student profile.</h1>
          <p>Create your account to start tracking applications and making progress toward your next internship.</p>
          <div className="auth-points">
            <span>✓ Save your internship goals</span>
            <span>✓ Track each application</span>
            <span>✓ Stay organized and focused</span>
          </div>
        </div>

        <div className="auth-panel auth-form-panel">
          <div className="auth-panel-heading">
            <h2>Student Registration</h2>
            <p>Create your account</p>
          </div>

          {message && (
            <div className="form-alert form-alert-success" role="status">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <label className="form-field auth-field">
              Full name
              <input
                name="name"
                type="text"
                value={form.name}
                onChange={updateField}
                placeholder="Alex Johnson"
                aria-invalid={Boolean(errors.name)}
              />
              {errors.name && <small className="field-error">{errors.name}</small>}
            </label>

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
                  placeholder="Create a strong password"
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

            <label className="form-field auth-field">
              Confirm password
              <div className="password-field">
                <input
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={form.confirmPassword}
                  onChange={updateField}
                  placeholder="Confirm your password"
                  aria-invalid={Boolean(errors.confirmPassword)}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword((current) => !current)}
                  aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                >
                  {showConfirmPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              {errors.confirmPassword && <small className="field-error">{errors.confirmPassword}</small>}
            </label>

            <button type="submit" className="button button-green auth-submit" disabled={isLoading}>
              {isLoading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account? <a href="#/login">Log in</a>
          </p>
        </div>
      </section>
    </main>
  );
}
