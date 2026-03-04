import React, { useState, useEffect } from 'react';

const formatTitle = (value = '') =>
  value
    .split(' ')
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

const toBulletList = (items) => items.map(item => `- ${item}`).join('\n');

const getAiJobContent = (title = '', location = '', type = 'Full-time') => {
  const formattedTitle = formatTitle(title.trim() || 'Skilled Professional');
  const locationText = location ? ` in ${location}` : '';
  const roleLine = `We are looking for a ${formattedTitle}${locationText} to help us build delightful digital experiences.`;
  const typeLine = `This is a ${type.toLowerCase()} opportunity where you will collaborate with product, design, and engineering partners.`;

  const responsibilities = toBulletList([
    `Own end-to-end delivery of new ${formattedTitle.toLowerCase()} initiatives`,
    'Partner with cross-functional teams to translate ideas into polished solutions',
    'Measure impact, share insights, and iterate quickly based on data',
    'Champion best practices around documentation, accessibility, and performance'
  ]);

  const perks = toBulletList([
    'Modern tooling, mentorship, and clear growth paths',
    'Remote-friendly culture with flexible hours',
    'Quarterly learning stipends and conference budget'
  ]);

  const requirements = toBulletList([
    `3+ years of hands-on experience as a ${formattedTitle.toLowerCase()}`,
    "Bachelor's degree in a relevant field or equivalent experience",
    'Strong communication skills and a builder mindset',
    'Comfortable working in fast-paced, agile environments'
  ]);

  return {
    description: `${roleLine} ${typeLine}\n\nKey Responsibilities:\n${responsibilities}\n\nWhat You Will Love:\n${perks}`,
    requirements: `Required Qualifications:\n${requirements}`
  };
};

const JobsTab = ({ 
  jobs, 
  onEditJob, 
  onViewApplications, 
  onDeleteJob,
  onAddJob,
  onStatusChange,
  statusFilter: externalStatusFilter = 'all',
  onStatusFilterChange = () => {}
}) => {
  const [statusFilter, setStatusFilter] = useState(externalStatusFilter);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  // Form state
  const [jobForm, setJobForm] = useState({
    title: '',
    department: '',
    location: '',
    type: 'Full-time',
    status: 'draft',
    salary: '',
    experience: '',
    description: '',
    requirements: ''
  });
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  const [aiStatus, setAiStatus] = useState(null);

  useEffect(() => {
    setStatusFilter(externalStatusFilter);
  }, [externalStatusFilter]);

  const handleStatusFilterChange = (value) => {
    setStatusFilter(value);
    onStatusFilterChange(value);
  };

  const filteredJobs = jobs.filter(job => {
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { class: 'status-active', label: 'Active' },
      draft: { class: 'status-draft', label: 'Draft' },
      closed: { class: 'status-closed', label: 'Closed' }
    };
    
    const config = statusConfig[status] || { class: 'status-draft', label: status };
    return <span className={`status-badge ${config.class}`}>{config.label}</span>;
  };

  // Form handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setJobForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddNew = () => {
    setJobForm({
      title: '',
      department: '',
      location: '',
      type: 'Full-time',
      status: 'draft',
      salary: '',
      experience: '',
      description: '',
      requirements: ''
    });
    setAiStatus(null);
    setIsGeneratingDescription(false);
    setEditingJob(null);
    setShowAddForm(true);
  };

  const handleEdit = (job) => {
    setJobForm({
      title: job.title,
      department: job.department,
      location: job.location,
      type: job.type,
      status: job.status,
      salary: job.salary,
      experience: job.experience || '',
      description: job.description || '',
      requirements: job.requirements || ''
    });
    setAiStatus(null);
    setIsGeneratingDescription(false);
    setEditingJob(job);
    setShowAddForm(true);
  };

  const handleSaveJob = (e) => {
    e.preventDefault();
    
    if (editingJob) {
      // Update existing job
      onEditJob && onEditJob(editingJob.id, jobForm);
    } else {
      // Add new job
      onAddJob && onAddJob({
        ...jobForm,
        applications: 0,
        datePosted: new Date().toISOString()
      });
    }
    
    setShowAddForm(false);
    setEditingJob(null);
    setAiStatus(null);
    setIsGeneratingDescription(false);
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingJob(null);
    setAiStatus(null);
    setIsGeneratingDescription(false);
  };

  const handleViewApplications = (jobId) => {
    onViewApplications && onViewApplications(jobId);
  };

  const handleDeleteClick = (jobId) => {
    setShowDeleteConfirm(jobId);
  };

  const handleDeleteConfirm = () => {
    onDeleteJob && onDeleteJob(showDeleteConfirm);
    setShowDeleteConfirm(null);
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(null);
  };

  const handleStatusChange = (jobId, newStatus) => {
    onStatusChange && onStatusChange(jobId, newStatus);
  };

  const getStatusOptions = (currentStatus) => {
    const options = {
      draft: ['draft', 'active'],
      active: ['active', 'closed'],
      closed: ['closed', 'active']
    };
    
    return options[currentStatus] || ['draft', 'active', 'closed'];
  };

  const handleGenerateDescription = () => {
    if (!jobForm.title.trim()) {
      setAiStatus({ type: 'error', message: 'Add a job title to generate content.' });
      return;
    }

    setIsGeneratingDescription(true);
    setAiStatus({ type: 'info', message: 'Crafting role-specific copy...' });

    setTimeout(() => {
      const aiCopy = getAiJobContent(jobForm.title, jobForm.location, jobForm.type);
      setJobForm(prev => ({
        ...prev,
        description: aiCopy.description,
        requirements: aiCopy.requirements
      }));
      setAiStatus({ type: 'success', message: 'AI description added. Adjust anything to fit your tone.' });
      setIsGeneratingDescription(false);
    }, 600);
  };

  return (
    <div className="jobs-tab">
      {/* Add/Edit Job Modal */}
      {showAddForm && (
        <div className="modal-overlay">
          <div className="modal-content job-modal">
            <div className="job-modal-header">
              <div>
                <p className="job-modal-overline">{editingJob ? 'Update Job Posting' : 'Add New Job'}</p>
                <h3>{jobForm.title || 'Craft a compelling listing'}</h3>
                <span className="job-modal-subtext">Share key context so top talent can picture themselves in the role.</span>
              </div>
              <button className="btn-close" onClick={handleCancel} aria-label="Close job form">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="currentColor"/>
                </svg>
              </button>
            </div>
            <form onSubmit={handleSaveJob} className="job-form job-modal-form">
              <div className="job-modal-grid">
                <div className="form-group">
                  <label>Job Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={jobForm.title}
                    onChange={handleInputChange}
                    required
                    placeholder="frontend developer"
                  />
                </div>
                <div className="form-group">
                  <label>Location *</label>
                  <input
                    type="text"
                    name="location"
                    value={jobForm.location}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., Bengaluru, Remote"
                  />
                </div>
                <div className="form-group">
                  <label>Job Type *</label>
                  <select
                    name="type"
                    value={jobForm.type}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="Full-time">Full Time</option>
                    <option value="Part-time">Part Time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Status *</label>
                  <select
                    name="status"
                    value={jobForm.status}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="draft">Draft</option>
                    <option value="active">Open</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Department *</label>
                  <input
                    type="text"
                    name="department"
                    value={jobForm.department}
                    onChange={handleInputChange}
                    required
                    placeholder="Engineering"
                  />
                </div>
                <div className="form-group">
                  <label>Salary (Optional)</label>
                  <input
                    type="text"
                    name="salary"
                    value={jobForm.salary}
                    onChange={handleInputChange}
                    placeholder="e.g., ₹18 LPA - ₹24 LPA"
                  />
                </div>
                <div className="form-group">
                  <label>Experience *</label>
                  <input
                    type="text"
                    name="experience"
                    value={jobForm.experience}
                    onChange={handleInputChange}
                    placeholder="e.g., 3-5 years"
                    required
                  />
                </div>
              </div>

              <div className="job-modal-section">
                <div className="section-title">
                  <label>Job Description *</label>
                  <button
                    type="button"
                    className="ai-generate-btn"
                    onClick={handleGenerateDescription}
                    disabled={isGeneratingDescription}
                  >
                    <span className="spark-icon" aria-hidden="true">*</span>
                    {isGeneratingDescription ? 'Generating...' : 'AI Generate'}
                  </button>
                </div>
                <textarea
                  name="description"
                  value={jobForm.description}
                  onChange={handleInputChange}
                  rows="5"
                  required
                  placeholder="Outline impact, day-to-day work, and team rituals..."
                />
                <div className="ai-hint-row">
                  <span className="ai-detection-badge">
                    <span className="pulse-dot" aria-hidden="true" />
                    AI content detection available
                  </span>
                  {aiStatus && (
                    <span className={`ai-status ${aiStatus.type}`}>
                      {aiStatus.message}
                    </span>
                  )}
                </div>
              </div>

              <div className="job-modal-section">
                <label>Requirements</label>
                <textarea
                  name="requirements"
                  value={jobForm.requirements}
                  onChange={handleInputChange}
                  rows="4"
                  placeholder="Required Qualifications:\n- Bachelor's degree in relevant field..."
                />
              </div>

              <div className="form-actions job-modal-actions">
                <button type="button" className="btn-secondary" onClick={handleCancel}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingJob ? 'Update Job' : 'Create Job'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal-overlay">
          <div className="modal-content confirm-modal">
            <div className="modal-header">
              <h3>Confirm Delete</h3>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete this job posting? This action cannot be undone.</p>
            </div>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={handleDeleteCancel}>
                Cancel
              </button>
              <button className="btn-danger" onClick={handleDeleteConfirm}>
                Delete Job
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Jobs Interface */}
      <div className="tab-header">
        <h2>Job Postings</h2>
        <div className="filter-controls">
          <select 
            className="filter-select"
            value={statusFilter}
            onChange={(e) => handleStatusFilterChange(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="closed">Closed</option>
          </select>
          <input 
            type="text" 
            placeholder="Search jobs..." 
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="btn-primary" style={{padding:'5px 20px',display:'flex',alignItems:'center',gap:'10px',cursor:'pointer' }} onClick={handleAddNew}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" fill="currentColor"/>
            </svg>
            Add New Job
          </button>
        </div>
      </div>

      <div className="jobs-table">
        {filteredJobs.length === 0 ? (
          <div className="empty-state">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" stroke="currentColor" strokeWidth="2"/>
              <path d="M14 2v6h6" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <h3>No jobs found</h3>
            <p>Get started by creating your first job posting.</p>
            <button className="btn-primary" onClick={handleAddNew}>
              Create Your First Job
            </button>
          </div>
        ) : (
          <>
            <div className="table-header">
              <div className="col">Job Title</div>
              <div className="col">Department</div>
              <div className="col">Location</div>
              <div className="col">Applications</div>
              <div className="col">Status</div>
              <div className="col">Actions</div>
            </div>
            <div className="table-body">
              {filteredJobs.map(job => (
                <div key={job.id} className="table-row">
                  <div className="col">
                    <div className="col-sub">
                      <div className="job-title">{job.title}</div>
                    <div className="job-meta">
                      <span className="job-type">{job.type} |  {job.salary && <span className="job-salary">{job.salary}</span>} </span> 
                     
                    </div>
                    </div>
                  </div>
                  <div className="col">{job.department}</div>
                  <div className="col">{job.location}</div>
                  <div className="col">
                    <span className="applications-badge">{job.applications}</span>
                  </div>
                  <div className="col">
                    <div className="status-control">
                      {getStatusBadge(job.status)}
                      <select 
                        className="status-select"
                        value={job.status}
                        onChange={(e) => handleStatusChange(job.id, e.target.value)}
                      >
                        {getStatusOptions(job.status).map(status => (
                          <option key={status} value={status}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="col">
                    <div className="action-buttons">
                      <button 
                        className="btn-icon" 
                        title="Edit"
                        onClick={() => handleEdit(job)}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="currentColor"/>
                        </svg>
                      </button>
               
                      <button 
                        className="btn-icon btn-danger" 
                        title="Delete"
                        onClick={() => handleDeleteClick(job.id)}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="currentColor"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default JobsTab;