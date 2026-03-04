import React, { useState } from 'react';
import ProfileSection from './ProfileSection';
import { FiEdit2, FiX, FiPlus } from 'react-icons/fi';

const Skills = ({ data, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [skills, setSkills] = useState(data);
  const [newSkill, setNewSkill] = useState('');

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (index) => {
    const updatedSkills = skills.filter((_, i) => i !== index);
    setSkills(updatedSkills);
  };

  const handleSave = () => {
    onSave(skills);
    setIsEditing(false);
  };

  return (
    <ProfileSection
      title="Skills"
      isEditing={isEditing}
      onEdit={() => setIsEditing(true)}
      onCancel={() => { setIsEditing(false); setSkills(data); }}
      onSave={handleSave}
      hasData={skills.length > 0}
    >
      {isEditing ? (
        <div className="skills-edit">
          <div className="skills-input-container">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Add a skill"
              onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
            />
            <button className="add-skill-button" onClick={handleAddSkill}>
              <FiPlus size={14} /> Add
            </button>
          </div>
          
          <div className="skills-tags">
            {skills.map((skill, index) => (
              <div key={index} className="skill-tag">
                {skill}
                <button 
                  className="remove-skill" 
                  onClick={() => handleRemoveSkill(index)}
                >
                  <FiX size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="skills-display">
          {skills.length === 0 ? (
            <p>No skills added yet</p>
          ) : (
            <div className="skills-tags">
              {skills.map((skill, index) => (
                <div key={index} className="skill-tag">
                  {skill}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </ProfileSection>
  );
};

export default Skills;