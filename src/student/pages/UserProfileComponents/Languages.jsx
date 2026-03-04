import React, { useState } from 'react';
import ProfileSection from './ProfileSection';
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';

const Languages = ({ data, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    proficiency: 'Intermediate'
  });
  const [languages, setLanguages] = useState(data);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAdd = () => {
    setEditingIndex(null);
    setFormData({
      name: '',
      proficiency: 'Intermediate'
    });
    setIsEditing(true);
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setFormData(languages[index]);
    setIsEditing(true);
  };

  const handleSave = () => {
    let updatedLanguages;
    if (editingIndex !== null) {
      updatedLanguages = [...languages];
      updatedLanguages[editingIndex] = formData;
    } else {
      updatedLanguages = [...languages, formData];
    }
    
    setLanguages(updatedLanguages);
    onSave(updatedLanguages);
    setIsEditing(false);
  };

  const handleDelete = (index) => {
    const updatedLanguages = languages.filter((_, i) => i !== index);
    setLanguages(updatedLanguages);
    onSave(updatedLanguages);
  };

  return (
    <ProfileSection
      title="Languages"
      isEditing={isEditing}
      onAdd={handleAdd}
      onCancel={() => setIsEditing(false)}
      onSave={handleSave}
      hasData={languages.length > 0}
    >
      {isEditing ? (
        <div className="edit-form">
          <div className="form-row">
            <div className="form-group">
              <label>Language</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. English"
              />
            </div>
            <div className="form-group">
              <label>Proficiency</label>
              <select
                name="proficiency"
                value={formData.proficiency}
                onChange={handleChange}
              >
                <option value="Basic">Basic</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Fluent">Fluent</option>
                <option value="Native">Native</option>
              </select>
            </div>
          </div>
        </div>
      ) : (
        <div className="items-list">
          {languages.length === 0 ? (
            <div className="empty-state">
              <p>No languages added yet</p>
              <button className="add-button" onClick={handleAdd}>
                <FiPlus size={14} /> Add Language
              </button>
            </div>
          ) : (
            languages.map((lang, index) => (
              <div key={index} className="item-card">
                <div className="item-content">
                  <h3>{lang.name}</h3>
                  <p>Proficiency: {lang.proficiency}</p>
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

export default Languages;