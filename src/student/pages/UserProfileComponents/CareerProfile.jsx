import React, { useState } from 'react';
import ProfileSection from './ProfileSection';

const CareerProfile = ({ data, onSave }) => {
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
      title="Career Profile"
      isEditing={isEditing}
      onEdit={() => setIsEditing(true)}
      onCancel={() => { setIsEditing(false); setFormData(data); }}
      onSave={handleSave}
      hasData={!!data.summary}
    >
      {isEditing ? (
        <div className="edit-form">
          <div className="form-group">
            <label>Career Summary</label>
            <textarea
              name="summary"
              value={formData.summary}
              onChange={handleChange}
              rows="4"
              placeholder="Describe your career objectives and profile"
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Current Industry</label>
              <input
                type="text"
                name="currentIndustry"
                value={formData.currentIndustry}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Functional Area</label>
              <input
                type="text"
                name="functionalArea"
                value={formData.functionalArea}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Role</label>
              <input
                type="text"
                name="role"
                value={formData.role}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Job Type</label>
              <select
                name="jobType"
                value={formData.jobType}
                onChange={handleChange}
              >
                <option value="Permanent">Permanent</option>
                <option value="Contract">Contract</option>
                <option value="Freelance">Freelance</option>
              </select>
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Desired Salary (₹)</label>
              <input
                type="text"
                name="desiredSalary"
                value={formData.desiredSalary}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Desired Location</label>
              <input
                type="text"
                name="desiredLocation"
                value={formData.desiredLocation}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="form-group">
            <label>Notice Period</label>
            <input
              type="text"
              name="noticePeriod"
              value={formData.noticePeriod}
              onChange={handleChange}
            />
          </div>
        </div>
      ) : (
        <div className="info-display">
          {data.summary ? (
            <>
              <div className="info-row">
                <span className="info-label">Summary:</span>
                <span className="info-value">{data.summary}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Industry:</span>
                <span className="info-value">{data.currentIndustry}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Role:</span>
                <span className="info-value">{data.role}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Desired Salary:</span>
                <span className="info-value">₹{data.desiredSalary}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Notice Period:</span>
                <span className="info-value">{data.noticePeriod}</span>
              </div>
            </>
          ) : (
            <p>No career profile information added yet</p>
          )}
        </div>
      )}
    </ProfileSection>
  );
};

export default CareerProfile;