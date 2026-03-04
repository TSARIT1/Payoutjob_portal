import React, { useState } from 'react';
import ProfileSection from './ProfileSection';
import { FiEdit2 } from 'react-icons/fi';

const PersonalInfo = ({ data, onSave }) => {
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

  return (
    <ProfileSection
      title="Personal Information"
      isEditing={isEditing}
      onEdit={() => setIsEditing(true)}
      onCancel={() => { setIsEditing(false); setFormData(data); }}
      onSave={handleSave}
      hasData={true}
    >
      {isEditing ? (
        <div className="edit-form">
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Headline</label>
            <input
              type="text"
              name="headline"
              value={formData.headline}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
        </div>
      ) : (
        <div className="info-display">
          <div className="info-row">
            <span className="info-label">Name:</span>
            <span className="info-value">{data.name}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Headline:</span>
            <span className="info-value">{data.headline}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Location:</span>
            <span className="info-value">{data.location}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Email:</span>
            <span className="info-value">{data.email}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Phone:</span>
            <span className="info-value">{data.phone}</span>
          </div>
        </div>
      )}
    </ProfileSection>
  );
};

export default PersonalInfo;