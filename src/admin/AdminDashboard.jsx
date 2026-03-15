import React, { useEffect, useMemo, useState } from 'react';
import Navbar from '../pages/components/Navbar';
import Footer from '../pages/components/Footer';
import { approveEmployer, fetchAdminContactMessages, fetchAdminDashboard, fetchAdminEmployers, rejectEmployer } from '../services/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [activities, setActivities] = useState([]);
  const [employers, setEmployers] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [dashboardData, employersData, contactData] = await Promise.all([
        fetchAdminDashboard(),
        fetchAdminEmployers(),
        fetchAdminContactMessages()
      ]);
      setStats(dashboardData.stats || {});
      setActivities(dashboardData.recentActivities || []);
      setEmployers(employersData.employers || []);
      setContacts(contactData.messages || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const pendingEmployers = useMemo(
    () => employers.filter((entry) => entry.onboarding_status === 'pending'),
    [employers]
  );

  const onApprove = async (id) => {
    await approveEmployer(id, { note: 'Approved by super admin.' });
    await load();
  };

  const onReject = async (id) => {
    await rejectEmployer(id, { note: 'Please complete details and re-apply.' });
    await load();
  };

  return (
    <>
      <Navbar />
      <div style={{ minHeight: '100vh', background: '#f1f5f9', padding: 16 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h1 style={{ marginTop: 6, marginBottom: 6 }}>Super Admin Dashboard</h1>
          <p style={{ marginTop: 0, color: '#475569', fontSize: 14 }}>Industrial control center for employer onboarding, operations, quality and support.</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 12, margin: '16px 0' }}>
            {[
              ['Students', stats.students || 0],
              ['Employers', stats.employers || 0],
              ['Pending Employers', stats.pendingEmployers || 0],
              ['Jobs', stats.jobs || 0],
              ['Applications', stats.applications || 0],
              ['New Contacts', stats.newContacts || 0]
            ].map(([label, value]) => (
              <div key={label} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 14 }}>
                <div style={{ color: '#64748b', fontSize: 12 }}>{label}</div>
                <div style={{ fontSize: 24, fontWeight: 800, color: '#0f172a' }}>{value}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 14 }}>
            <section style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 14 }}>
              <h3 style={{ marginTop: 0 }}>Employer Onboarding Approvals</h3>
              {loading ? <p>Loading...</p> : pendingEmployers.length === 0 ? <p style={{ color: '#64748b' }}>No pending employers.</p> : pendingEmployers.map((entry) => (
                <div key={entry.id} style={{ border: '1px solid #e2e8f0', borderRadius: 10, padding: 10, marginBottom: 10 }}>
                  <div style={{ fontWeight: 700 }}>{entry.company_name || entry.full_name}</div>
                  <div style={{ fontSize: 13, color: '#64748b' }}>{entry.email}</div>
                  <div style={{ fontSize: 12, color: '#334155', marginTop: 6 }}>Company Workspace: /company/{entry.company_slug || 'n/a'}</div>
                  <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
                    <button onClick={() => onApprove(entry.id)} style={{ border: 'none', borderRadius: 8, padding: '8px 12px', color: '#fff', background: '#16a34a', fontWeight: 700 }}>Approve</button>
                    <button onClick={() => onReject(entry.id)} style={{ border: 'none', borderRadius: 8, padding: '8px 12px', color: '#fff', background: '#dc2626', fontWeight: 700 }}>Reject</button>
                  </div>
                </div>
              ))}
            </section>

            <section style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 14 }}>
              <h3 style={{ marginTop: 0 }}>Recent Platform Activity</h3>
              <div style={{ maxHeight: 430, overflow: 'auto' }}>
                {activities.map((entry) => (
                  <div key={entry.id} style={{ borderBottom: '1px solid #f1f5f9', padding: '8px 0' }}>
                    <div style={{ fontWeight: 700, fontSize: 13 }}>{entry.action_type}</div>
                    <div style={{ color: '#64748b', fontSize: 12 }}>{entry.full_name || 'System'} • {new Date(entry.created_at).toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <section style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 14, marginTop: 14 }}>
            <h3 style={{ marginTop: 0 }}>Contact Us Inbox</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left', padding: 8, borderBottom: '1px solid #e2e8f0' }}>Name</th>
                    <th style={{ textAlign: 'left', padding: 8, borderBottom: '1px solid #e2e8f0' }}>Email</th>
                    <th style={{ textAlign: 'left', padding: 8, borderBottom: '1px solid #e2e8f0' }}>Subject</th>
                    <th style={{ textAlign: 'left', padding: 8, borderBottom: '1px solid #e2e8f0' }}>Received</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.slice(0, 20).map((entry) => (
                    <tr key={entry.id}>
                      <td style={{ padding: 8, borderBottom: '1px solid #f1f5f9' }}>{entry.name}</td>
                      <td style={{ padding: 8, borderBottom: '1px solid #f1f5f9' }}>{entry.email}</td>
                      <td style={{ padding: 8, borderBottom: '1px solid #f1f5f9' }}>{entry.subject}</td>
                      <td style={{ padding: 8, borderBottom: '1px solid #f1f5f9' }}>{new Date(entry.created_at).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
}
