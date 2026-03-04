import React, { useState } from 'react';
import ProfileSection from './ProfileSection';
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';

const Education = ({ data, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [formData, setFormData] = useState({
    degree: '',
    university: '',
    year: '',
    completed: true
  });
  const [educations, setEducations] = useState(data);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAdd = () => {
    setEditingIndex(null);
    setFormData({
      degree: '',
      university: '',
      year: '',
      completed: true
    });
    setIsEditing(true);
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setFormData(educations[index]);
    setIsEditing(true);
  };

  const handleSave = () => {
    let updatedEducations;
    if (editingIndex !== null) {
      updatedEducations = [...educations];
      updatedEducations[editingIndex] = formData;
    } else {
      updatedEducations = [...educations, formData];
    }
    
    setEducations(updatedEducations);
    onSave(updatedEducations);
    setIsEditing(false);
  };

  const handleDelete = (index) => {
    const updatedEducations = educations.filter((_, i) => i !== index);
    setEducations(updatedEducations);
    onSave(updatedEducations);
  };

  return (
    <ProfileSection
      title="Education"
      isEditing={isEditing}
      onAdd={handleAdd}
      onCancel={() => setIsEditing(false)}
      onSave={handleSave}
      hasData={educations.length > 0}
    >
      {isEditing ? (
        <div className="edit-form">
          <div className="form-group">
            <label>Degree</label>
            <input
              type="text"
              name="degree"
              value={formData.degree}
              onChange={handleChange}
              placeholder="e.g. Bachelor of Technology"
            />
          </div>
          <div className="form-group">
            <label>University/Institute</label>
            <input
              type="text"
              name="university"
              value={formData.university}
              onChange={handleChange}
              placeholder="e.g. Indian Institute of Technology"
            />
          </div>
          <div className="form-group">
            <label>Year</label>
            <input
              type="text"
              name="year"
              value={formData.year}
              onChange={handleChange}
              placeholder="e.g. 2015 - 2019"
            />
          </div>
          <div className="form-group checkbox-group">
            <input
              type="checkbox"
              name="completed"
              id="completed"
              checked={formData.completed}
              onChange={(e) => setFormData(prev => ({ ...prev, completed: e.target.checked }))}
            />
            <label htmlFor="completed">Completed</label>
          </div>
        </div>
      ) : (
        <div className="items-list">
          {educations.length === 0 ? (
            <div className="empty-state">
              <p>No education details added yet</p>
              <button className="add-button" onClick={handleAdd}>
                <FiPlus size={14} /> Add Education
              </button>
            </div>
          ) : (
            educations.map((edu, index) => (
              <div key={index} className="item-card">
                <div className="item-content">
                  <h3>{edu.degree}</h3>
                  <p>{edu.university}</p>
                  <p>{edu.year} • {edu.completed ? 'Completed' : 'Pursuing'}</p>
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

export default Education;