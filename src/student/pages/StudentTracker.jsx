import React, { useEffect, useState } from 'react';
import Navbar from '../../pages/components/Navbar';
import Footer from '../../pages/components/Footer';
import { fetchStudentTracker } from '../../services/api';

export default function StudentTracker() {
  const [data, setData] = useState({ summary: {}, timeline: [] });

  useEffect(() => {
    fetchStudentTracker().then(setData).catch(() => {});
  }, []);

  const cards = [
    ['Applications', data.summary.totalApplications || 0],
    ['Shortlisted', data.summary.shortlisted || 0],
    ['Interviews', data.summary.interviews || 0],
    ['Hired', data.summary.hired || 0],
    ['Saved Jobs', data.summary.savedJobs || 0]
  ];

  return (
    <>
      <Navbar />
      <div style={{ minHeight: '100vh', background: '#f8fafc', padding: 16 }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <h1 style={{ marginBottom: 6 }}>Job Seeker Tracker</h1>
          <p style={{ marginTop: 0, color: '#475569', fontSize: 14 }}>Track your entire hiring journey in one place.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 10, marginBottom: 16 }}>
            {cards.map(([label, value]) => (
              <div key={label} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 12 }}>
                <div style={{ color: '#64748b', fontSize: 12 }}>{label}</div>
                <div style={{ fontWeight: 800, fontSize: 24 }}>{value}</div>
              </div>
            ))}
          </div>

          <section style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 14 }}>
            <h3 style={{ marginTop: 0 }}>Recent Activity</h3>
            {data.timeline.length === 0 ? <p style={{ color: '#64748b' }}>No activity yet.</p> : data.timeline.map((entry, index) => (
              <div key={`${entry.action_type}-${index}`} style={{ padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}>
                <div style={{ fontWeight: 700, fontSize: 13 }}>{entry.action_type}</div>
                <div style={{ color: '#64748b', fontSize: 12 }}>{new Date(entry.created_at).toLocaleString()}</div>
              </div>
            ))}
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
}
