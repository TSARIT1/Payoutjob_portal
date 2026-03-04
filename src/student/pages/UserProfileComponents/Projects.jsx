import React, { useState } from 'react';
import ProfileSection from './ProfileSection';
import { FiEdit2, FiTrash2, FiPlus, FiExternalLink ,FiX } from 'react-icons/fi';

const Projects = ({ data, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    duration: '',
    description: '',
    skills: [],
    link: ''
  });
  const [projects, setProjects] = useState(data);
  const [newSkill, setNewSkill] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (index) => {
    const updatedSkills = formData.skills.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, skills: updatedSkills }));
  };

  const handleAdd = () => {
    setEditingIndex(null);
    setFormData({
      title: '',
      duration: '',
      description: '',
      skills: [],
      link: ''
    });
    setIsEditing(true);
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setFormData(projects[index]);
    setIsEditing(true);
  };

  const handleSave = () => {
    let updatedProjects;
    if (editingIndex !== null) {
      updatedProjects = [...projects];
      updatedProjects[editingIndex] = formData;
    } else {
      updatedProjects = [...projects, formData];
    }
    
    setProjects(updatedProjects);
    onSave(updatedProjects);
    setIsEditing(false);
  };

  const handleDelete = (index) => {
    const updatedProjects = projects.filter((_, i) => i !== index);
    setProjects(updatedProjects);
    onSave(updatedProjects);
  };

  return (
    <ProfileSection
      title="Projects"
      isEditing={isEditing}
      onAdd={handleAdd}
      onCancel={() => setIsEditing(false)}
      onSave={handleSave}
      hasData={projects.length > 0}
    >
      {isEditing ? (
        <div className="edit-form">
          <div className="form-group">
            <label>Project Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. E-commerce Platform"
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Duration</label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                placeholder="e.g. Jan 2020 - Mar 2020"
              />
            </div>
            <div className="form-group">
              <label>Project Link</label>
              <input
                type="url"
                name="link"
                value={formData.link}
                onChange={handleChange}
                placeholder="https://example.com"
              />
            </div>
          </div>
          
          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              placeholder="Describe the project and your contributions"
            />
          </div>
          
          <div className="form-group">
            <label>Skills Used</label>
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
              {formData.skills.map((skill, index) => (
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
        </div>
      ) : (
        <div className="items-list">
          {projects.length === 0 ? (
            <div className="empty-state">
              <p>No projects added yet</p>
              <button className="add-button" onClick={handleAdd}>
                <FiPlus size={14} /> Add Project
              </button>
            </div>
          ) : (
            projects.map((project, index) => (
              <div key={index} className="item-card">
                <div className="item-content">
                  <h3>{project.title}</h3>
                  <p>{project.duration}</p>
                  <p className="description">{project.description}</p>
                  {project.skills.length > 0 && (
                    <div className="skills-tags">
                      {project.skills.map((skill, i) => (
                        <span key={i} className="skill-tag">{skill}</span>
                      ))}
                    </div>
                  )}
                  {project.link && (
                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="project-link">
                      <FiExternalLink size={14} /> View Project
                    </a>
                  )}
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

export default Projects;