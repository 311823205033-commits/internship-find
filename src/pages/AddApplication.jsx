import { useEffect, useState } from 'react';

const emptyForm = { studentName: '', email: '', jobTitle: '', companyName: '', applicationDate: new Date().toISOString().slice(0, 10), status: 'Applied' };
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function AddApplication({ prefillJob, onSave, authUser }) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    if (authUser) {
      setForm((current) => ({
        ...current,
        studentName: current.studentName || authUser.name || '',
        email: current.email || authUser.email || '',
      }));
    }
  }, [authUser]);

  useEffect(() => {
    if (prefillJob) {
      setForm((current) => ({
        ...current,
        jobTitle: prefillJob.title || current.jobTitle,
        companyName: prefillJob.company || current.companyName,
      }));
      setSaved(false);
      setSaveMessage('');
    }
  }, [prefillJob]);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: '' }));
    setSaved(false);
    setSaveMessage('');
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = {};
    ['studentName', 'email', 'jobTitle', 'companyName', 'applicationDate', 'status'].forEach((field) => {
      if (typeof form[field] !== 'string' || !form[field].trim()) nextErrors[field] = 'This field is required.';
    });
    if (form.email && !emailPattern.test(form.email.trim())) nextErrors.email = 'Enter a valid email address, for example name@example.com.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    const result = await onSave({
      ...form,
      studentName: form.studentName.trim(),
      email: form.email.trim(),
      jobTitle: form.jobTitle.trim(),
      companyName: form.companyName.trim(),
    });

    if (result?.ok) {
      setSaved(true);
      setSaveMessage(result.message || 'Application saved successfully. You can view it in Applications.');
      setForm({ ...emptyForm, applicationDate: new Date().toISOString().slice(0, 10) });
      if (authUser) {
        setForm((current) => ({ ...emptyForm, studentName: authUser.name || '', email: authUser.email || '', applicationDate: new Date().toISOString().slice(0, 10), status: current.status || 'Applied' }));
      }
    } else {
      setSaveMessage(result?.message || 'Unable to save this application.');
      setSaved(false);
    }
  }

  return (
    <main className="container page-content narrow-content">
      <section className="page-intro reveal">
        <span className="eyebrow"><span className="eyebrow-dot" /> MAKE IT OFFICIAL</span>
        <h1>Track your <span>next step.</span></h1>
        <p>Add an application to your career dashboard and keep everything in one place.</p>
      </section>
      <section className="form-card reveal">
        <div className="form-card-heading"><div className="form-heading-icon">＋</div><div><h2>Application details</h2><p>Fields marked with <span aria-hidden="true">*</span> are required.</p></div></div>
        {saved && saveMessage && <div className="success-message" role="status"><span aria-hidden="true">✓</span> {saveMessage}</div>}
        {!saved && saveMessage && <div className="form-alert form-alert-error" role="alert">{saveMessage}</div>}
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-grid">
            <label className="form-field">Student name <span>*</span><input name="studentName" value={form.studentName} onChange={updateField} placeholder="e.g. Alex Johnson" aria-invalid={Boolean(errors.studentName)} />{errors.studentName && <small className="field-error">{errors.studentName}</small>}</label>
            <label className="form-field">Email address <span>*</span><input name="email" type="email" value={form.email} onChange={updateField} placeholder="you@example.com" aria-invalid={Boolean(errors.email)} />{errors.email && <small className="field-error">{errors.email}</small>}</label>
            <label className="form-field">Job title <span>*</span><input name="jobTitle" value={form.jobTitle} onChange={updateField} placeholder="e.g. Software Intern" aria-invalid={Boolean(errors.jobTitle)} />{errors.jobTitle && <small className="field-error">{errors.jobTitle}</small>}</label>
            <label className="form-field">Company name <span>*</span><input name="companyName" value={form.companyName} onChange={updateField} placeholder="e.g. Acme Technologies" aria-invalid={Boolean(errors.companyName)} />{errors.companyName && <small className="field-error">{errors.companyName}</small>}</label>
            <label className="form-field">Application date <span>*</span><input name="applicationDate" type="date" value={form.applicationDate} onChange={updateField} aria-invalid={Boolean(errors.applicationDate)} />{errors.applicationDate && <small className="field-error">{errors.applicationDate}</small>}</label>
            <label className="form-field">Application status <span>*</span><select name="status" value={form.status} onChange={updateField} aria-invalid={Boolean(errors.status)}><option>Applied</option><option>Interview</option><option>Selected</option><option>Rejected</option></select>{errors.status && <small className="field-error">{errors.status}</small>}</label>
          </div>
          <div className="form-actions"><button className="button button-green" type="submit">Save application <span aria-hidden="true">→</span></button><a className="button button-light" href="#/applications">View applications</a></div>
        </form>
      </section>
      <aside className="form-tip"><span aria-hidden="true">✦</span><p><strong>Keep your momentum.</strong> Add each application as you send it, so every next step stays easy to find.</p></aside>
    </main>
  );
}
