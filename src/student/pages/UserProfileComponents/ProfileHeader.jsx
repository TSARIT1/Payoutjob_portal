import React from 'react';
import { FiEdit2 } from 'react-icons/fi';
import { FaLinkedin, FaGithub, FaTwitter, FaGlobe } from 'react-icons/fa';

const ProfileHeader = ({ data, socialLinks, onEdit }) => {
  return (
    <div className="profile-header">
      <div className="profile-image-container">
        <img src={data.image} alt="Profile" className="profile-image" />
        <button className="edit-button" onClick={onEdit}>
          <FiEdit2 size={14} />
        </button>
      </div>
      <div className="profile-info">
        <h1>{data.name}</h1>
        <p className="headline">{data.headline}</p>
        <div className="contact-info">
          <span>{data.location}</span>
          <span>•</span>
          <span>{data.email}</span>
          <span>•</span>
          <span>{data.phone}</span>
        </div>
        <div className="social-icons">
          {socialLinks.linkedin && (
            <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
              <FaLinkedin size={18} />
            </a>
          )}
          {socialLinks.github && (
            <a href={socialLinks.github} target="_blank" rel="noopener noreferrer">
              <FaGithub size={18} />
            </a>
          )}
          {socialLinks.twitter && (
            <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer">
              <FaTwitter size={18} />
            </a>
          )}
          {socialLinks.portfolio && (
            <a href={socialLinks.portfolio} target="_blank" rel="noopener noreferrer">
              <FaGlobe size={18} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;