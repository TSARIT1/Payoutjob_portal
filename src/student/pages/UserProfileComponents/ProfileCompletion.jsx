import React from 'react';

const ProfileCompletion = ({ percentage }) => {
  return (
    <div className="profile-completion">
      <div className="completion-header">
        <h3>Profile Strength: {percentage}%</h3>
        <span>Complete your profile to get better opportunities</span>
      </div>
      <div className="progress-bar-container">
        <div 
          className="progress-bar" 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      {percentage < 100 && (
        <div className="completion-tip">
          Add more details to reach 100% profile completion
        </div>
      )}
    </div>
  );
};

export default ProfileCompletion;