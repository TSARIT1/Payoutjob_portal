import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

export default function CompanyWorkspace() {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const run = async () => {
      try {
        const response = await fetch(`${API_BASE}/company/${slug}/portal-summary`);
        const body = await response.json();
        if (!response.ok) throw new Error(body.error || 'Unable to load workspace');
        setData(body);
      } catch (err) {
        setError(err.message);
      }
    };
    run();
  }, [slug]);

  return (
    <>
      <Navbar />
      <div style={{ minHeight: '100vh', background: '#f8fafc', padding: 16 }}>
        <div style={{ maxWidth: 960, margin: '0 auto', background: '#fff', borderRadius: 14, border: '1px solid #e2e8f0', padding: 20 }}>
          {!data && !error && <p>Loading workspace...</p>}
          {error && <p style={{ color: '#b91c1c' }}>{error}</p>}
          {data && (
            <>
              <h1 style={{ marginTop: 0 }}>{data.company.name} Workspace</h1>
              <p style={{ color: '#475569' }}>Internal HR operations portal for managed and external hiring workflows.</p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 10 }}>
                <div style={{ border: '1px solid #e2e8f0', borderRadius: 10, padding: 12 }}>
                  <div style={{ fontSize: 12, color: '#64748b' }}>Total Jobs</div>
                  <div style={{ fontSize: 26, fontWeight: 800 }}>{data.summary.totalJobs}</div>
                </div>
                <div style={{ border: '1px solid #e2e8f0', borderRadius: 10, padding: 12 }}>
                  <div style={{ fontSize: 12, color: '#64748b' }}>Active Jobs</div>
                  <div style={{ fontSize: 26, fontWeight: 800 }}>{data.summary.activeJobs}</div>
                </div>
                <div style={{ border: '1px solid #e2e8f0', borderRadius: 10, padding: 12 }}>
                  <div style={{ fontSize: 12, color: '#64748b' }}>Applications</div>
                  <div style={{ fontSize: 26, fontWeight: 800 }}>{data.summary.totalApplications}</div>
                </div>
              </div>

              <div style={{ marginTop: 16, fontSize: 13, color: '#334155' }}>
                <div><strong>Workspace Slug:</strong> {data.company.slug}</div>
                <div><strong>Onboarding Status:</strong> {data.company.onboardingStatus}</div>
                <div><strong>Location:</strong> {data.company.location || 'Not set'}</div>
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
