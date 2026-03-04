import React, { useState } from 'react';
import { FiEdit2, FiChevronDown, FiChevronUp, FiX, FiPlus } from 'react-icons/fi';

const ProfileSection = ({ title, children, onAdd, onSave, onCancel, isEditing, onEdit, hasData }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="profile-section">
      <div className="section-header" onClick={() => setIsExpanded(!isExpanded)}>
        <h2>{title}</h2>
        <div className="section-actions">
          {!isEditing && hasData && (
            <button className="icon-button" onClick={(e) => { e.stopPropagation(); onEdit(); }}>
              <FiEdit2 size={16} />
            </button>
          )}
          {!isEditing && onAdd && (
            <button className="icon-button" onClick={(e) => { e.stopPropagation(); onAdd(); }}>
              <FiPlus size={16} />
            </button>
          )}
          <button className="icon-button" onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}>
            {isExpanded ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
          </button>
        </div>
      </div>
      
      {isExpanded && (
        <div className="section-content">
          {children}
          
          {isEditing && (
            <div className="section-edit-actions">
              <button className="save-button" onClick={onSave}>Save</button>
              <button className="cancel-button" onClick={onCancel}>Cancel</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfileSection;