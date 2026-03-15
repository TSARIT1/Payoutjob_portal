import React, { useState, useEffect } from 'react';
import { Bell, CheckCheck, Briefcase, Heart, AlertCircle, Info } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { fetchNotifications, markNotificationRead, markAllNotificationsRead } from '../services/api';
import Navbar from './components/Navbar';
import { formatTimeAgo } from '../utils/timeAgo';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

const TYPE_ICON = {
  application: <Briefcase size={18} />,
  saved: <Heart size={18} />,
  alert: <Bell size={18} />,
  info: <Info size={18} />,
};

const TYPE_COLOR = {
  application: '#4f8bff',
  saved: '#ef4444',
  alert: '#f59e0b',
  info: '#6366f1',
};

export default function Notifications() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    fetchNotifications()
      .then((data) => setNotifications(data.notifications || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user, navigate]);

  const handleMarkRead = async (id) => {
    try {
      await markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: 1 } : n))
      );
    } catch { /* ignore */ }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: 1 })));
    } catch { /* ignore */ }
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const demoNotifications = [
    {
      id: 'd1',
      type: 'application',
      title: 'Your application was reviewed',
      body: 'TechCorp India reviewed your application for Frontend Engineer (React).',
      link: '/applied-jobs',
      is_read: 0,
      created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    },
    {
      id: 'd2',
      type: 'alert',
      title: 'New jobs match your alert',
      body: '5 new React Developer roles were posted matching your job alert.',
      link: '/jobs?keywords=React+Developer',
      is_read: 0,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    },
    {
      id: 'd3',
      type: 'info',
      title: 'Complete your profile',
      body: 'Profiles with 80%+ completion get 3x more recruiter views.',
      link: '/profile',
      is_read: 1,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    },
    {
      id: 'd4',
      type: 'application',
      title: 'Interview scheduled',
      body: 'You have an interview scheduled for Product Manager at InfraCloud.',
      link: '/applied-jobs',
      is_read: 1,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    },
  ];

  const displayList = notifications.length > 0 ? notifications : demoNotifications;

  return (
    <>
      <Navbar />
      <div
        style={{
          minHeight: '100vh',
          background: isDarkMode ? '#0f172a' : '#f1f5f9',
          padding: '32px 16px',
        }}
      >
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          {/* Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 24,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Bell size={24} color={isDarkMode ? '#93c5fd' : '#1e60e1'} />
              <h1
                style={{
                  margin: 0,
                  fontSize: 22,
                  fontWeight: 700,
                  color: isDarkMode ? '#f1f5f9' : '#0f172a',
                }}
              >
                Notifications
              </h1>
              {unreadCount > 0 && (
                <span
                  style={{
                    background: '#ef4444',
                    color: '#fff',
                    fontSize: 12,
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: 20,
                  }}
                >
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  background: 'none',
                  border: `1px solid ${isDarkMode ? '#334155' : '#cbd5e1'}`,
                  borderRadius: 8,
                  padding: '6px 14px',
                  cursor: 'pointer',
                  fontSize: 13,
                  color: isDarkMode ? '#94a3b8' : '#64748b',
                  fontWeight: 500,
                }}
              >
                <CheckCheck size={15} />
                Mark all read
              </button>
            )}
          </div>

          {/* Notification list */}
          {loading ? (
            <div style={{ textAlign: 'center', color: isDarkMode ? '#94a3b8' : '#64748b', padding: 40 }}>
              Loading notifications...
            </div>
          ) : displayList.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '60px 20px',
                color: isDarkMode ? '#64748b' : '#94a3b8',
              }}
            >
              <Bell size={48} style={{ opacity: 0.3, marginBottom: 16 }} />
              <p style={{ margin: 0, fontSize: 16 }}>No notifications yet.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {displayList.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => {
                    if (!notif.is_read && typeof notif.id === 'number') handleMarkRead(notif.id);
                    if (notif.link) navigate(notif.link);
                  }}
                  style={{
                    background: isDarkMode
                      ? notif.is_read ? '#1e293b' : '#1e3a5f'
                      : notif.is_read ? '#fff' : '#eff6ff',
                    borderRadius: 14,
                    padding: '16px 20px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 14,
                    cursor: notif.link ? 'pointer' : 'default',
                    boxShadow: notif.is_read ? 'none' : '0 2px 12px rgba(79,139,255,0.1)',
                    border: `1px solid ${isDarkMode ? '#334155' : notif.is_read ? '#e2e8f0' : '#bfdbfe'}`,
                    transition: 'transform 0.15s',
                  }}
                >
                  {/* Icon */}
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      background: TYPE_COLOR[notif.type] || '#6366f1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      flexShrink: 0,
                    }}
                  >
                    {TYPE_ICON[notif.type] || <AlertCircle size={18} />}
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontWeight: notif.is_read ? 500 : 700,
                        fontSize: 14,
                        color: isDarkMode ? '#f1f5f9' : '#0f172a',
                        marginBottom: 3,
                      }}
                    >
                      {notif.title}
                    </div>
                    {notif.body && (
                      <div
                        style={{
                          fontSize: 13,
                          color: isDarkMode ? '#94a3b8' : '#64748b',
                          lineHeight: 1.5,
                        }}
                      >
                        {notif.body}
                      </div>
                    )}
                    <div
                      style={{
                        fontSize: 11,
                        color: isDarkMode ? '#475569' : '#94a3b8',
                        marginTop: 6,
                      }}
                    >
                      {formatTimeAgo(notif.created_at)}
                    </div>
                  </div>

                  {/* Unread dot */}
                  {!notif.is_read && (
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: '#3b82f6',
                        flexShrink: 0,
                        marginTop: 6,
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
