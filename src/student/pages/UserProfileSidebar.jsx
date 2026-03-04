import React, { useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiBriefcase, FiBook, FiTrendingUp } from 'react-icons/fi';
import { HiOfficeBuilding } from 'react-icons/hi';
import './userProfile.css';
import { useAuth } from '../../contexts/AuthContext';

const menuItems = [
  { label: 'My home', path: '/', icon: <FiHome /> },
  { label: 'Jobs', path: '/jobs', icon: <FiBriefcase /> },
  { label: 'Companies', path: '/companies', icon: <HiOfficeBuilding /> },
  { label: 'Blogs', path: '/blogs', icon: <FiBook /> },
];

const UserProfileSidebar = ({ personalInfo, socialLinks, completionPercentage }) => {
  const location = useLocation();
  const { user, updateProfile } = useAuth();
  const fileInputRef = useRef(null);

  const effectivePersonalInfo =
    personalInfo ||
    (user && {
      name: user.name,
      headline: user.headline || 'Software Developer',
      location: user.location || 'Bangalore, India',
      email: user.email,
      phone: user.phone,
      image: user.avatar,
    });

  const effectiveSocialLinks =
    socialLinks ||
    user?.socialLinks || {
      linkedin: '',
      github: '',
      twitter: '',
      portfolio: '',
    };

  const effectiveCompletion =
    typeof completionPercentage === 'number'
      ? completionPercentage
      : user?.profileCompletion || 0;

  const completionValue = Math.min(Math.max(effectiveCompletion || 0, 0), 100);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      fileInputRef.current?.click();
    }
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      updateProfile({ avatar: reader.result });
    };
    reader.readAsDataURL(file);

    // allow selecting the same file again
    event.target.value = '';
  };

  if (!effectivePersonalInfo) {
    return null;
  }

  return (
    <aside className="profile-sidebar">
      <div className="profile-card">
        {/* Profile Avatar */}
        <div className="profile-avatar-wrapper">
          <div className="profile-progress-pill">{completionValue}%</div>
          <div
            className="avatar-progress"
            style={{ '--pct': completionValue }}
            aria-label={`Profile completion ${completionValue}%`}
            role="button"
            tabIndex={0}
            onClick={handleAvatarClick}
            onKeyDown={handleAvatarKeyDown}
          >
            <div className="profile-avatar">
              <img src={effectivePersonalInfo.image || '/default-avatar.png'} alt="Profile" />
            </div>
            <div className="avatar-overlay">
              <span>Replace</span>
              <span>photo</span>
            </div>
          </div>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="avatar-file-input"
            onChange={handleAvatarChange}
          />
        </div>

        {/* Profile Info */}
        <div className="profile-card-info">
          <h2 className="profile-name">{effectivePersonalInfo.name}</h2>
          <p className="profile-education">{effectivePersonalInfo.headline}</p>
          <p className="profile-institution">@ {effectivePersonalInfo.location}</p>
          <p className="profile-updated">Last updated 1m ago</p>
        </div>

        {/* View Profile Button */}
        <button className="view-profile-btn">View profile</button>

        {/* Profile Performance */}
        <div className="profile-performance">
          <div className="performance-header">
            <span>Profile performance</span>
            <span className="info-icon">ⓘ</span>
          </div>
          <div className="performance-metrics">
            <Link to="/profile/search-appearances" className="metric metric-link">
              <span className="metric-label">Search appearances</span>
              <span className="metric-value">4 <span className="metric-arrow">↑</span></span>
            </Link>
            <Link to="/profile/search-appearances" className="metric metric-link">
              <span className="metric-label">Recruiter actions</span>
              <span className="metric-value">11 <span className="metric-arrow">↑</span></span>
            </Link>
          </div>
        </div>

        {/* Boost Message */}
        <div className="profile-boost">
          <FiTrendingUp className="boost-icon" />
          <div className="boost-text">
            <span>Get 3X boost to your profile performance</span>
          </div>
          <span className="boost-arrow">→</span>
        </div>

        {/* Navigation Menu */}
        <nav className="sidebar-navigation">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${
                location.pathname === item.path ? 'active' : ''
              }`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default UserProfileSidebar;
