import React, { useState, useEffect } from 'react';
import { formatTimeAgo } from '../../utils/timeAgo';

const ApplicationsTab = ({ 
  applications, 
  jobs,
  onViewCV,
  onScheduleInterview,
  onStatusChange,
  onContactCandidate,
  onAddNote,
  onViewProfile,
  statusFilter: externalStatusFilter = 'all',
  onStatusFilterChange = () => {}
}) => {
  const [statusFilter, setStatusFilter] = useState(externalStatusFilter);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApp, setSelectedApp] = useState(null);
  const [showSchedule, setShowSchedule] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [showResume, setShowResume] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [notes, setNotes] = useState('');
  const [scheduleData, setScheduleData] = useState({
    date: '',
    time: '',
    type: 'video',
    notes: ''
  });

  useEffect(() => {
    setStatusFilter(externalStatusFilter);
  }, [externalStatusFilter]);

  const handleStatusFilterChange = (value) => {
    setStatusFilter(value);
    onStatusFilterChange(value);
  };

  const filteredApps = applications.filter(app => {
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    const matchesSearch = app.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.candidateEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         jobs.find(j => j.id === app.jobId)?.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      review: { class: 'badge-review', label: 'Under Review' },
      interview: { class: 'badge-interview', label: 'Interview' },
      hired: { class: 'badge-hired', label: 'Hired' },
      rejected: { class: 'badge-rejected', label: 'Rejected' }
    };
    
    const config = statusConfig[status] || { class: 'badge-review', label: status };
    return <span className={`badge ${config.class}`}>{config.label}</span>;
  };

  const handleViewDetails = (app) => {
    setSelectedApp(app);
    setShowDetails(true);
  };

  const handleBackToList = () => {
    setShowDetails(false);
    setSelectedApp(null);
    setShowSchedule(false);
    setShowNotes(false);
    setShowResume(false);
    setNotes('');
    setScheduleData({ date: '', time: '', type: 'video', notes: '' });
  };

  const handleViewResume = (app) => {
    setSelectedApp(app);
    setShowResume(true);
  };

  const handleSchedule = (app) => {
    setSelectedApp(app);
    setScheduleData({ date: '', time: '', type: 'video', notes: '' });
    setShowSchedule(true);
  };

  const handleScheduleSubmit = (e) => {
    e.preventDefault();
    if (onScheduleInterview && selectedApp) {
      onScheduleInterview(selectedApp.id, scheduleData);
    }
    setShowSchedule(false);
  };

  const handleStatusUpdate = (appId, newStatus) => {
    if (onStatusChange) {
      onStatusChange(appId, newStatus);
    }
  };

  const handleContact = (app) => {
    if (onContactCandidate) {
      onContactCandidate(app);
    } else {
      const job = jobs.find(j => j.id === app.jobId);
      const subject = `Regarding your application for ${job?.title}`;
      const body = `Dear ${app.candidateName},\n\n`;
      window.open(`mailto:${app.candidateEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
    }
  };

  const handleAddNote = (app) => {
    setSelectedApp(app);
    setNotes(app.notes || '');
    setShowNotes(true);
  };

  const handleSaveNotes = () => {
    if (onAddNote && selectedApp) {
      onAddNote(selectedApp.id, notes);
    }
    setShowNotes(false);
  };

  const getStatusOptions = (currentStatus) => {
    return ['review', 'interview', 'hired', 'rejected'].filter(status => status !== currentStatus);
  };

  const getStats = () => {
    const total = applications.length;
    const review = applications.filter(app => app.status === 'review').length;
    const interview = applications.filter(app => app.status === 'interview').length;
    const hired = applications.filter(app => app.status === 'hired').length;
    const rejected = applications.filter(app => app.status === 'rejected').length;

    return { total, review, interview, hired, rejected };
  };

  const stats = getStats();

  // Application Details View
  if (showDetails && selectedApp) {
    const job = jobs.find(j => j.id === selectedApp.jobId);
    return (
      <div className="app-details">
        <div className="details-header">
          <button className="back-btn" onClick={handleBackToList}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2"/>
            </svg>
            Back to Applications
          </button>
          <h2>Application Details</h2>
        </div>

        <div className="details-content">
          <div className="details-grid">
            <div className="detail-section">
              <h3>Candidate Information</h3>
              <div className="candidate-card">
                <div className="avatar large">
                  {selectedApp.candidateName.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="candidate-info">
                  <h4>{selectedApp.candidateName}</h4>
                  <p>{selectedApp.candidateEmail}</p>
                  <span className="location">{selectedApp.candidateLocation}</span>
                  <div className="meta">
                    <span className="exp">{selectedApp.experience} experience</span>
                  </div>
                </div>
              </div>
              <div className="skills">
                <h4>Skills</h4>
                <div className="skills-list">
                  {selectedApp.skills.map((skill, index) => (
                    <span key={index} className="skill">{skill}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="detail-section job-section">
              <h3>Job Information</h3>
              <div className="job-card">
                <h4>{job?.title}</h4>
                <div className="job-info">
                  <p><strong>Department:</strong> {job?.department}</p>
                  <p><strong>Location:</strong> {job?.location}</p>
                  <p><strong>Type:</strong> {job?.type}</p>
                  <p><strong>Salary:</strong> {job?.salary}</p>
                  <p><strong>Posted:</strong> {formatTimeAgo(job?.datePosted)}</p>
                </div>
              </div>
              <div className="job-description">
                <h3>Job Description</h3>
                <div className="description-content">
                  {job?.description ? (
                    <p>{job.description}</p>
                  ) : (
                    <p className="muted">No job description provided for this posting.</p>
                  )}
                </div>
              </div>
            </div>

            <div className="detail-section">
              <h3>Application Details</h3>
              <div className="app-info">
                <div className="info-row">
                  <span className="label">Applied Date:</span>
                  <span className="value">{new Date(selectedApp.appliedDate).toLocaleDateString()}</span>
                </div>
                <div className="info-row">
                  <span className="label">Status:</span>
                  <span className="value">{getStatusBadge(selectedApp.status)}</span>
                </div>
                <div className="info-row">
                  <span className="label">Experience:</span>
                  <span className="value">{selectedApp.experience}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="actions-section">
            <div className="action-btns">
              <button className="btn primary" onClick={() => handleViewResume(selectedApp)}>
                View Resume
              </button>
              <button className="btn secondary" onClick={() => handleSchedule(selectedApp)}>
                Schedule Interview
              </button>
              <button className="btn secondary" onClick={() => handleContact(selectedApp)}>
                Contact Candidate
              </button>
              <button className="btn secondary" onClick={() => handleAddNote(selectedApp)}>
                Add Notes
              </button>
            </div>

            <div className="status-control">
              <label>Update Status:</label>
              <select 
                value={selectedApp.status}
                onChange={(e) => handleStatusUpdate(selectedApp.id, e.target.value)}
              >
                {getStatusOptions(selectedApp.status).map(status => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Modals */}
        {showSchedule && (
          <div className="modal">
            <div className="modal-content">
              <div className="modal-header">
                <h3>Schedule Interview</h3>
                <button className="close-btn" onClick={() => setShowSchedule(false)}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="currentColor"/>
                  </svg>
                </button>
              </div>
              <form onSubmit={handleScheduleSubmit} className="form">
                <div className="form-group">
                  <label>Candidate</label>
                  <input type="text" value={selectedApp?.candidateName || ''} disabled />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Date *</label>
                    <input
                      type="date"
                      value={scheduleData.date}
                      onChange={(e) => setScheduleData(prev => ({ ...prev, date: e.target.value }))}
                      required
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div className="form-group">
                    <label>Time *</label>
                    <input
                      type="time"
                      value={scheduleData.time}
                      onChange={(e) => setScheduleData(prev => ({ ...prev, time: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Interview Type</label>
                  <select
                    value={scheduleData.type}
                    onChange={(e) => setScheduleData(prev => ({ ...prev, type: e.target.value }))}
                  >
                    <option value="video">Video Call</option>
                    <option value="phone">Phone Call</option>
                    <option value="in-person">In-Person</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Notes</label>
                  <textarea
                    value={scheduleData.notes}
                    onChange={(e) => setScheduleData(prev => ({ ...prev, notes: e.target.value }))}
                    rows="3"
                    placeholder="Add any additional notes or instructions..."
                  />
                </div>
                <div className="form-actions">
                  <button type="button" className="btn secondary" onClick={() => setShowSchedule(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn primary">
                    Schedule Interview
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showNotes && (
          <div className="modal">
            <div className="modal-content">
              <div className="modal-header">
                <h3>Notes for {selectedApp?.candidateName}</h3>
                <button className="close-btn" onClick={() => setShowNotes(false)}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="currentColor"/>
                  </svg>
                </button>
              </div>
              <div className="notes-form">
                <div className="form-group">
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows="6"
                    placeholder="Add your notes about this candidate..."
                  />
                </div>
                <div className="form-actions">
                  <button type="button" className="btn secondary" onClick={() => setShowNotes(false)}>
                    Cancel
                  </button>
                  <button type="button" className="btn primary" onClick={handleSaveNotes}>
                    Save Notes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showResume && (
          <div className="modal">
            <div className="modal-content resume-modal">
              <div className="modal-header">
                <h3>Resume - {selectedApp?.candidateName}</h3>
                <button className="close-btn" onClick={() => setShowResume(false)}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="currentColor"/>
                  </svg>
                </button>
              </div>
              <div className="resume-content">
                {selectedApp?.cvUrl ? (
                  <iframe src={selectedApp.cvUrl} title="Candidate Resume" />
                ) : (
                  <div className="no-resume">
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

  // Table View
  return (
    <div className="applications-tab">
      {/* Stats */}
      <div className="stats">
        <div
          className={`stat clickable ${statusFilter === 'all' ? 'active' : ''}`}
          role="button"
          tabIndex={0}
          onClick={() => handleStatusFilterChange('all')}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleStatusFilterChange('all')}
        >
          <span className="number">{stats.total}</span>
          <span className="label">Total</span>
        </div>
        <div
          className={`stat clickable ${statusFilter === 'review' ? 'active' : ''}`}
          role="button"
          tabIndex={0}
          onClick={() => handleStatusFilterChange('review')}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleStatusFilterChange('review')}
        >
          <span className="number review">{stats.review}</span>
          <span className="label">Under Review</span>
        </div>
        <div
          className={`stat clickable ${statusFilter === 'interview' ? 'active' : ''}`}
          role="button"
          tabIndex={0}
          onClick={() => handleStatusFilterChange('interview')}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleStatusFilterChange('interview')}
        >
          <span className="number interview">{stats.interview}</span>
          <span className="label">Interview</span>
        </div>
        <div
          className={`stat clickable ${statusFilter === 'hired' ? 'active' : ''}`}
          role="button"
          tabIndex={0}
          onClick={() => handleStatusFilterChange('hired')}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleStatusFilterChange('hired')}
        >
          <span className="number hired">{stats.hired}</span>
          <span className="label">Hired</span>
        </div>
        <div
          className={`stat clickable ${statusFilter === 'rejected' ? 'active' : ''}`}
          role="button"
          tabIndex={0}
          onClick={() => handleStatusFilterChange('rejected')}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleStatusFilterChange('rejected')}
        >
          <span className="number rejected">{stats.rejected}</span>
          <span className="label">Rejected</span>
        </div>
      </div>

      <div className="tab-header">
        <h2>Applications</h2>
        <div className="filters">
          <select 
            value={statusFilter}
            onChange={(e) => handleStatusFilterChange(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="review">Under Review</option>
            <option value="interview">Interview</option>
            <option value="hired">Hired</option>
            <option value="rejected">Rejected</option>
          </select>
          <input 
            type="text" 
            placeholder="Search applications..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="table-container">
        {filteredApps.length === 0 ? (
          <div className="empty">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
              <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" fill="currentColor"/>
            </svg>
            <h3>No applications found</h3>
            <p>No applications match your current filters.</p>
          </div>
        ) : (
          <>
            <div className="table-header">
              <div>Candidate</div>
              <div>Job Applied</div>
              <div>Experience</div>
              <div>Status</div>
              <div>Applied Date</div>
              <div>Actions</div>
            </div>
            <div className="table-body">
              {filteredApps.map(app => {
                const job = jobs.find(j => j.id === app.jobId) || {};
                const desc = job.description || '';
                const snippet = desc.length > 120 ? desc.slice(0, 120) + '...' : desc;
                return (
                  <div key={app.id} className="table-row">
                    <div>
                      <div className="avatar">
                        {app.candidateName.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="candidate-details">
                        <div className="name">{app.candidateName}</div>
                        <div className="email">{app.candidateEmail}</div>
                      </div>
                    </div>
                    <div>
                      <div className="job-title">{job.title}</div>
                      {snippet && <div className="job-desc-snippet">{snippet}</div>}
                    </div>
                    <div>{app.experience}</div>
                    <div>
                      <div className="status">
                        {getStatusBadge(app.status)}
                      </div>
                    </div>
                    <div>
                      {new Date(app.appliedDate).toLocaleDateString()}
                    </div>
                    <div>
                      <div className="actions">
                        <button className="btn sm primary" onClick={() => handleViewDetails(app)}>
                          View
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ApplicationsTab;