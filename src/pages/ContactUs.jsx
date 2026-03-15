import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { submitContactMessage } from '../services/api';

export default function ContactUs() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', subject: '', message: '' });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });
    try {
      const data = await submitContactMessage(form);
      setStatus({ type: 'success', message: data.message || 'Message sent successfully.' });
      setForm({ name: '', email: '', phone: '', company: '', subject: '', message: '' });
    } catch (error) {
      setStatus({ type: 'error', message: error?.response?.data?.error || 'Unable to send your message right now.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg,#f8fafc,#eef2ff)', padding: '28px 16px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: 18 }}>
            <h1 style={{ marginTop: 0 }}>Contact Us</h1>
            <p style={{ color: '#475569', lineHeight: 1.7 }}>
              Platform designed and manufactured by TSAR IT SERVICES. For enterprise onboarding,
              hiring operations support, and global deployment requests, contact our team.
            </p>
            <div style={{ fontSize: 14, color: '#0f172a', lineHeight: 1.8 }}>
              <div><strong>Company:</strong> TSAR IT SERVICES</div>
              <div><strong>Website:</strong> https://www.tsaritservices.com</div>
              <div><strong>Email:</strong> info@tsaritservices.com</div>
              <div><strong>Support Phone:</strong> +91 94913 01258</div>
            </div>
          </div>

          <form onSubmit={onSubmit} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: 18 }}>
            {['name', 'email', 'phone', 'company', 'subject'].map((field) => (
              <div key={field} style={{ marginBottom: 10 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 4, textTransform: 'capitalize' }}>{field}</label>
                <input
                  name={field}
                  value={form[field]}
                  onChange={onChange}
                  required={['name', 'email', 'subject'].includes(field)}
                  style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: 8, padding: '10px 12px' }}
                />
              </div>
            ))}
            <div style={{ marginBottom: 10 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 4 }}>Message</label>
              <textarea name="message" value={form.message} onChange={onChange} required rows={6} style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: 8, padding: '10px 12px', resize: 'vertical' }} />
            </div>

            {status.message && (
              <div style={{ marginBottom: 10, color: status.type === 'error' ? '#b91c1c' : '#166534', background: status.type === 'error' ? '#fef2f2' : '#f0fdf4', border: `1px solid ${status.type === 'error' ? '#fecaca' : '#bbf7d0'}`, borderRadius: 8, padding: '8px 10px', fontSize: 13 }}>
                {status.message}
              </div>
            )}

            <button disabled={loading} style={{ border: 'none', borderRadius: 10, padding: '11px 14px', width: '100%', color: '#fff', fontWeight: 700, background: 'linear-gradient(135deg,#ea580c,#f97316)' }}>
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}
