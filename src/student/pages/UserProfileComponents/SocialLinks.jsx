import React, { useState } from 'react';
import ProfileSection from './ProfileSection';
import { FaLinkedin, FaGithub, FaTwitter, FaGlobe } from 'react-icons/fa';
import { FiEdit2 } from 'react-icons/fi';

const SocialLinks = ({ data, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(data);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onSave(formData);
    setIsEditing(false);
  };

  const handleAdd = () => {
    setFormData({ linkedin: '', github: '', twitter: '', portfolio: '' });
    setIsEditing(true);
  };

  return (
    <ProfileSection
      title="Social Links"
      isEditing={isEditing}
      onAdd={handleAdd}
      onEdit={() => setIsEditing(true)}
      onCancel={() => { setIsEditing(false); setFormData(data); }}
      onSave={handleSave}
      hasData={!!data.linkedin || !!data.github || !!data.twitter || !!data.portfolio}
    >
      {isEditing ? (
        <div className="edit-form">
          <div className="form-group">
            <label><FaLinkedin /> LinkedIn URL</label>
            <input
              type="url"
              name="linkedin"
              value={formData.linkedin}
              onChange={handleChange}
              placeholder="https://linkedin.com/in/username"
            />
          </div>
          <div className="form-group">
            <label><FaGithub /> GitHub URL</label>
            <input
              type="url"
              name="github"
              value={formData.github}
              onChange={handleChange}
              placeholder="https://github.com/username"
            />
          </div>
          <div className="form-group">
            <label><FaTwitter /> Twitter URL</label>
            <input
              type="url"
              name="twitter"
              value={formData.twitter}
              onChange={handleChange}
              placeholder="https://twitter.com/username"
            />
          </div>
          <div className="form-group">
            <label><FaGlobe /> Portfolio URL</label>
            <input
              type="url"
              name="portfolio"
              value={formData.portfolio}
              onChange={handleChange}
              placeholder="https://yourportfolio.com"
            />
          </div>
        </div>
      ) : (
        <div className="social-links-display">
          {data.linkedin && (
            <a href={data.linkedin} target="_blank" rel="noopener noreferrer" className="social-link">
              <FaLinkedin size={18} /> LinkedIn
            </a>
          )}
          {data.github && (
            <a href={data.github} target="_blank" rel="noopener noreferrer" className="social-link">
              <FaGithub size={18} /> GitHub
            </a>
          )}
          {data.twitter && (
            <a href={data.twitter} target="_blank" rel="noopener noreferrer" className="social-link">
              <FaTwitter size={18} /> Twitter
            </a>
          )}
          {data.portfolio && (
            <a href={data.portfolio} target="_blank" rel="noopener noreferrer" className="social-link">
              <FaGlobe size={18} /> Portfolio
            </a>
          )}
          {!data.linkedin && !data.github && !data.twitter && !data.portfolio && (
            <p>No social links added yet</p>
          )}
        </div>
      )}
    </ProfileSection>
  );
};

export default SocialLinks;