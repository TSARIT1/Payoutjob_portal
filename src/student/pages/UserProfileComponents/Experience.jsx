import React, { useState } from 'react';
import ProfileSection from './ProfileSection';
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';

const Experience = ({ data, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    duration: '',
    description: ''
  });
  const [experiences, setExperiences] = useState(data);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAdd = () => {
    setEditingIndex(null);
    setFormData({
      title: '',
      company: '',
      duration: '',
      description: ''
    });
    setIsEditing(true);
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setFormData(experiences[index]);
    setIsEditing(true);
  };

  const handleSave = () => {
    let updatedExperiences;
    if (editingIndex !== null) {
      updatedExperiences = [...experiences];
      updatedExperiences[editingIndex] = formData;
    } else {
      updatedExperiences = [...experiences, formData];
    }
    
    setExperiences(updatedExperiences);
    onSave(updatedExperiences);
    setIsEditing(false);
  };

  const handleDelete = (index) => {
    const updatedExperiences = experiences.filter((_, i) => i !== index);
    setExperiences(updatedExperiences);
    onSave(updatedExperiences);
  };

  return (
    <ProfileSection
      title="Work Experience"
      isEditing={isEditing}
      onAdd={handleAdd}
      onCancel={() => setIsEditing(false)}
      onSave={handleSave}
      hasData={experiences.length > 0}
    >
      {isEditing ? (
        <div className="edit-form">
          <div className="form-group">
            <label>Job Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Software Developer"
            />
          </div>
          <div className="form-group">
            <label>Company</label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="e.g. Google"
            />
          </div>
          <div className="form-group">
            <label>Duration</label>
            <input
              type="text"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              placeholder="e.g. Jan 2020 - Present"
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your responsibilities and achievements"
              rows="3"
            />
          </div>
        </div>
      ) : (
        <div className="items-list">
          {experiences.length === 0 ? (
            <div className="empty-state">
              <p>No work experience added yet</p>
              <button className="add-button" onClick={handleAdd}>
                <FiPlus size={14} /> Add Experience
              </button>
            </div>
          ) : (
            experiences.map((exp, index) => (
              <div key={index} className="item-card">
                <div className="item-content">
                  <h3>{exp.title}</h3>
                  <p>{exp.company}</p>
                  <p>{exp.duration}</p>
                  <p className="description">{exp.description}</p>
                </div>
                <div className="item-actions">
                  <button className="icon-button" onClick={() => handleEdit(index)}>
                    <FiEdit2 size={14} />
                  </button>
                  <button className="icon-button" onClick={() => handleDelete(index)}>
                    <FiTrash2 size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </ProfileSection>
  );
};

export default Experience;