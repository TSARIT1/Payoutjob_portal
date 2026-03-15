import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../pages/components/Navbar';
import Footer from '../pages/components/Footer';
import { useAuth } from '../contexts/AuthContext';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const onSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(email, password, 'Admin');
    setLoading(false);
    if (!result.success) {
      setError(result.error || 'Login failed');
      return;
    }
    navigate('/admin/dashboard');
  };

  return (
    <>
      <Navbar mode="admin-auth" />
      <div style={{ minHeight: '70vh', display: 'grid', placeItems: 'center', padding: 16, background: '#f8fafc' }}>
        <div style={{ width: '100%', maxWidth: 460, background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', padding: 24 }}>
          <h2 style={{ marginTop: 0, marginBottom: 8 }}>Super Admin Login</h2>
          <p style={{ marginTop: 0, color: '#475569', fontSize: 14 }}>Manage onboarding approvals, content, users, and platform health.</p>

          <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', color: '#1e3a8a', borderRadius: 10, padding: 10, marginBottom: 14, fontSize: 13 }}>
            Demo admin login: admin@payoutjob.com / Payout@123
          </div>

          <form onSubmit={onSubmit}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Admin Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required style={{ width: '100%', marginBottom: 10, border: '1px solid #cbd5e1', borderRadius: 10, padding: '10px 12px' }} />

            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Password</label>
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required style={{ width: '100%', marginBottom: 12, border: '1px solid #cbd5e1', borderRadius: 10, padding: '10px 12px' }} />

            {error && <div style={{ color: '#b91c1c', marginBottom: 10, fontSize: 13 }}>{error}</div>}

            <button disabled={loading} type="submit" style={{ width: '100%', border: 'none', borderRadius: 10, padding: 11, fontWeight: 700, color: '#fff', background: 'linear-gradient(135deg,#1d4ed8,#2563eb)' }}>
              {loading ? 'Signing in...' : 'Sign In as Admin'}
            </button>
          </form>

          <div style={{ marginTop: 12, fontSize: 13 }}>
            <Link to="/login">Job Seeker Login</Link> | <Link to="/employer/login">Employer Login</Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
