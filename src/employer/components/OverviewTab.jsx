import React from 'react';
import { Link } from 'react-router-dom';

const OverviewTab = ({ jobs, applications, emailHistory = [] }) => {
  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { class: 'evw-badge-active', label: 'Active' },
      draft: { class: 'evw-badge-draft', label: 'Draft' },
      closed: { class: 'evw-badge-closed', label: 'Closed' }
    };
    
    const config = statusConfig[status] || { class: 'evw-badge-draft', label: status };
    return <span className={`evw-badge ${config.class}`}>{config.label}</span>;
  };

  const getApplicationStatusBadge = (status) => {
    const statusConfig = {
      review: { class: 'evw-badge-review', label: 'Under Review' },
      interview: { class: 'evw-badge-interview', label: 'Interview' },
      hired: { class: 'evw-badge-hired', label: 'Hired' },
      rejected: { class: 'evw-badge-rejected', label: 'Rejected' }
    };
    
    const config = statusConfig[status] || { class: 'evw-badge-review', label: status };
    return <span className={`evw-badge ${config.class}`}>{config.label}</span>;
  };

  return (
    <div className="overview-tab">
      <div className="overview-grid">
        {/* Recent Applications */}
        <div className="overview-card">
          <div className="card-header">
            <h3>Recent Applications</h3>
            <Link to="/applications" className="view-all">View All</Link>
          </div>
          <div className="applications-list">
            {applications.slice(0, 5).map(application => (
              <div key={application.id} className="application-item">
                <div className="application-main">
                  <div className="candidate-info">
                    <h4>{application.candidateName}</h4>
                    <p>{application.candidateEmail}</p>
                    <span className="job-title">
                      Applied for {jobs.find(j => j.id === application.jobId)?.title}
                    </span>
                  </div>
                  <div className="application-meta">
                    {getApplicationStatusBadge(application.status)}
                    <span className="application-date">
                      {new Date(application.appliedDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="application-skills">
                  {application.skills.map((skill, index) => (
                    <span key={index} className="skill-tag">{skill}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Jobs */}
        <div className="overview-card">
          <div className="card-header">
            <h3>Active Jobs</h3>
            <Link to="/jobs" className="view-all">View All</Link>
          </div>
          <div className="jobs-list">
            {jobs.filter(job => job.status === 'active').map(job => (
              <div key={job.id} className="job-item">
                <div className="job-main">
                  <h4>{job.title}</h4>
                  <p>{job.department} • {job.location}</p>
                </div>
                <div className="job-meta">
                  <span className="applications-count">
                    {job.applications} applications
                  </span>
                  {getStatusBadge(job.status)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="overview-card">
          <div className="card-header">
            <h3>Email Activity</h3>
            <span className="view-all">Last 5 sends</span>
          </div>
          <div className="applications-list">
            {emailHistory.length === 0 ? (
              <div className="application-item">
                <div className="application-main">
                  <div className="candidate-info">
                    <h4>No emails yet</h4>
                    <p>Use Contact Candidate to send tracked messages from the dashboard.</p>
                  </div>
                </div>
              </div>
            ) : (
              emailHistory.slice(0, 5).map((email) => (
                <div key={email.id} className="application-item">
                  <div className="application-main">
                    <div className="candidate-info">
                      <h4>{email.recipientName || email.recipientEmail}</h4>
                      <p>{email.subject}</p>
                      <span className="job-title">{email.recipientEmail}</span>
                    </div>
                    <div className="application-meta">
                      <span className={`evw-badge ${email.status === 'sent' ? 'evw-badge-hired' : email.status === 'simulated' ? 'evw-badge-interview' : 'evw-badge-rejected'}`}>
                        {email.status}
                      </span>
                      <span className="application-date">
                        {new Date(email.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;