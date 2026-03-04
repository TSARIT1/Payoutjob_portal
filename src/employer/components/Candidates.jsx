import React, { useState } from 'react';

const Candidates = ({ 
  applications, 
  statusFilter = 'all',
  onViewProfile,
  onContactCandidate,
  onViewResume,
  onScheduleInterview
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);

  const statusScopedCandidates = statusFilter === 'all'
    ? applications
    : applications.filter(candidate => candidate.status === statusFilter);

  const filteredCandidates = statusScopedCandidates.filter(candidate =>
    candidate.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.candidateEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatusBadge = (status) => {
    const statusConfig = {
      review: { class: 'cat-badge-review', label: 'Under Review' },
      interview: { class: 'cat-badge-interview', label: 'Interview' },
      hired: { class: 'cat-badge-hired', label: 'Hired' },
      rejected: { class: 'cat-badge-rejected', label: 'Rejected' }
    };
    
    const config = statusConfig[status] || { class: 'cat-badge-review', label: status };
    return <span className={`cat-badge ${config.class}`}>{config.label}</span>;
  };

  const handleViewProfile = (candidate) => {
    setSelectedCandidate(candidate);
    setShowDetails(true);
  };

  const handleBackToList = () => {
    setShowDetails(false);
    setSelectedCandidate(null);
    setShowResumeModal(false);
  };

  const handleViewResume = (candidate) => {
    setSelectedCandidate(candidate);
    setShowResumeModal(true);
  };

  const handleContactCandidate = (candidate) => {
    if (onContactCandidate) {
      onContactCandidate(candidate);
    } else {
      const subject = 'Regarding your application';
      const body = `Dear ${candidate.candidateName},\n\n`;
      window.open(`mailto:${candidate.candidateEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
    }
  };

  const handleScheduleInterview = (candidate) => {
    if (onScheduleInterview) {
      onScheduleInterview(candidate);
    }
  };

  // Candidate Details View
  if (showDetails && selectedCandidate) {
    return (
      <div className="cat-details">
        <div className="cat-details-header">
          <button className="cat-back-btn" onClick={handleBackToList}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2"/>
            </svg>
            Back to Candidates
          </button>
          <h2>Candidate Profile</h2>
        </div>

        <div className="cat-details-content">
          <div className="cat-profile-header">
            <div className="cat-avatar xl">
              {selectedCandidate.candidateName.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="cat-profile-info">
              <h3>{selectedCandidate.candidateName}</h3>
              <p className="cat-email">{selectedCandidate.candidateEmail}</p>
              <p className="cat-location">{selectedCandidate.candidateLocation}</p>
              <div className="cat-meta">
                <span className="cat-exp">{selectedCandidate.experience} experience</span>
                {getStatusBadge(selectedCandidate.status)}
              </div>
            </div>
          </div>

          <div className="cat-sections">
            <div className="cat-section">
              <h4>Skills & Expertise</h4>
              <div className="cat-skills-grid">
                {selectedCandidate.skills.map((skill, index) => (
                  <div key={index} className="cat-skill-item">
                    {skill}
                  </div>
                ))}
              </div>
            </div>

            <div className="cat-section">
              <h4>Application Information</h4>
              <div className="cat-info-grid">
                <div className="cat-info-item">
                  <span className="cat-info-label">Status</span>
                  <span className="cat-info-value">{getStatusBadge(selectedCandidate.status)}</span>
                </div>
                <div className="cat-info-item">
                  <span className="cat-info-label">Experience</span>
                  <span className="cat-info-value">{selectedCandidate.experience}</span>
                </div>
                <div className="cat-info-item">
                  <span className="cat-info-label">Applied Date</span>
                  <span className="cat-info-value">{new Date(selectedCandidate.appliedDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div className="cat-section">
              <h4>Contact & Actions</h4>
              <div className="cat-action-group">
                <button 
                  className="cat-btn cat-btn-primary"
                  onClick={() => handleViewResume(selectedCandidate)}
                >
                  View Resume
                </button>
                <button 
                  className="cat-btn cat-btn-secondary"
                  onClick={() => handleScheduleInterview(selectedCandidate)}
                >
                  Schedule Interview
                </button>
                <button 
                  className="cat-btn cat-btn-secondary"
                  onClick={() => handleContactCandidate(selectedCandidate)}
                >
                  Contact Candidate
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Resume Modal */}
        {showResumeModal && (
          <div className="cat-modal">
            <div className="cat-modal-content cat-resume-modal">
              <div className="cat-modal-header">
                <h3>Resume - {selectedCandidate?.candidateName}</h3>
                <button className="cat-close-btn" onClick={() => setShowResumeModal(false)}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="currentColor"/>
                  </svg>
                </button>
              </div>
              <div className="cat-resume-content">
                {selectedCandidate?.cvUrl ? (
                  <iframe 
                    src={selectedCandidate.cvUrl} 
                    className="cat-resume-iframe"
                    title="Candidate Resume"
                  />
                ) : (
                  <div className="cat-no-resume">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" stroke="currentColor" strokeWidth="2"/>
                      <path d="M14 2v6h6" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    <p>No resume available for this candidate.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Candidates Grid View
  return (
    <div className="cat-tab">
      <div className="cat-tab-header">
        <h2>Candidates Pool</h2>
        <div className="cat-filters">
          <input 
            type="text" 
            placeholder="Search candidates..." 
            className="cat-search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="cat-grid">
        {filteredCandidates.length === 0 ? (
          <div className="cat-empty">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="currentColor"/>
            </svg>
            <h3>No candidates found</h3>
            <p>No candidates match your search criteria.</p>
          </div>
        ) : (
          filteredCandidates.map(candidate => (
            <div key={candidate.id} className="cat-card">
              <div className="cat-card-header">
                <div className="cat-avatar lg">
                  {candidate.candidateName.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="cat-card-info">
                  <h4>{candidate.candidateName}</h4>
                  <p>{candidate.candidateEmail}</p>
                  <span className="cat-card-location">{candidate.candidateLocation}</span>
                </div>
              </div>
              <div className="cat-card-skills">
                {candidate.skills.slice(0, 3).map((skill, index) => (
                  <span key={index} className="cat-skill-tag">{skill}</span>
                ))}
                {candidate.skills.length > 3 && (
                  <span className="cat-skill-more">+{candidate.skills.length - 3} more</span>
                )}
              </div>
              <div className="cat-card-meta">
                <span className="cat-card-exp">{candidate.experience} experience</span>
                {getStatusBadge(candidate.status)}
              </div>
              <div className="cat-card-actions">
                <button 
                  className="cat-btn cat-btn-sm cat-btn-primary"
                  onClick={() => handleViewProfile(candidate)}
                >
                  View Profile
                </button>
                <button 
                  className="cat-btn cat-btn-sm cat-btn-secondary"
                  onClick={() => handleContactCandidate(candidate)}
                >
                  Contact
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Candidates;