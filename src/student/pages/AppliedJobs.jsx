import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { FiMapPin, FiDollarSign, FiCalendar, FiBriefcase, FiClock, FiCheckCircle, FiXCircle, FiEye } from 'react-icons/fi';
import Navbar from '../../pages/components/Navbar';
import './AppliedJobs.css';
import { formatTimeAgo } from '../../utils/timeAgo';
import { fetchMyApplications } from '../../services/api';

const AppliedJobs = () => {
  const { user } = useAuth();
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const [expandedJobId, setExpandedJobId] = useState(null);

  // Mock job data - in a real app, this would come from an API
  const allJobs = useMemo(() => [
    {
      id: 1,
      title: "UI / UX Designer",
      company: "Tech Solutions Inc.",
      location: "Bangalore, Karnataka",
      salary: "₹30,000 - ₹45,000",
      postedDate: "2024-01-15",
      appliedDate: "2024-01-16",
      experience: "3-5 years",
      type: "Full Time",
      status: "under-review",
      description: "We are looking for a creative UI/UX Designer to join our team...",
      logo: "https://via.placeholder.com/60x60/2e2882/ffffff?text=TS"
    },
    {
      id: 2,
      title: "Sr. Product Designer",
      company: "Innovation Labs",
      location: "Hyderabad, Telangana",
      salary: "₹40,000 - ₹60,000",
      postedDate: "2024-01-14",
      appliedDate: "2024-01-17",
      experience: "5-8 years",
      type: "Full Time",
      status: "interview-scheduled",
      description: "Senior Product Designer role with focus on user-centered design...",
      logo: "https://via.placeholder.com/60x60/f76754/ffffff?text=IL"
    },
    {
      id: 3,
      title: "Frontend Developer",
      company: "Digital Corp",
      location: "Mumbai, Maharashtra",
      salary: "₹25,000 - ₹35,000",
      postedDate: "2024-01-13",
      appliedDate: "2024-01-15",
      experience: "2-4 years",
      type: "Full Time",
      status: "rejected",
      description: "Join our frontend development team working with React and modern technologies...",
      logo: "https://via.placeholder.com/60x60/55acee/ffffff?text=DC"
    },
    {
      id: 4,
      title: "Full Stack Developer",
      company: "StartupXYZ",
      location: "Delhi, NCR",
      salary: "₹35,000 - ₹50,000",
      postedDate: "2024-01-12",
      appliedDate: "2024-01-14",
      experience: "3-6 years",
      type: "Full Time",
      status: "shortlisted",
      description: "Full stack developer needed for our growing startup...",
      logo: "https://via.placeholder.com/60x60/4CAF50/ffffff?text=SX"
    },
    {
      id: 5,
      title: "Mobile App Developer",
      company: "AppWorks",
      location: "Pune, Maharashtra",
      salary: "₹28,000 - ₹42,000",
      postedDate: "2024-01-11",
      appliedDate: "2024-01-13",
      experience: "2-5 years",
      type: "Full Time",
      status: "under-review",
      description: "Develop innovative mobile applications for iOS and Android...",
      logo: "https://via.placeholder.com/60x60/FF9800/ffffff?text=AW"
    }
  ], []);

  useEffect(() => {
    // Simulate API call to fetch applied jobs
    const fetchAppliedJobs = async () => {
      setLoading(true);
      try {
        const data = await fetchMyApplications();
        setAppliedJobs((data.applications || []).length ? data.applications : allJobs);
      } catch (error) {
        console.error('Failed to load applied jobs:', error);
        setAppliedJobs(allJobs);
      } finally {
        setLoading(false);
      }
    };

    fetchAppliedJobs();
  }, [allJobs]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'under-review': return '#ffa726';
      case 'shortlisted': return '#42a5f5';
      case 'interview-scheduled': return '#66bb6a';
      case 'rejected': return '#ef5350';
      case 'accepted': return '#26a69a';
      default: return '#9e9e9e';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'under-review': return <FiClock />;
      case 'shortlisted': return <FiCheckCircle />;
      case 'interview-scheduled': return <FiCalendar />;
      case 'rejected': return <FiXCircle />;
      case 'accepted': return <FiCheckCircle />;
      default: return <FiBriefcase />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'under-review': return 'Under Review';
      case 'shortlisted': return 'Shortlisted';
      case 'interview-scheduled': return 'Interview Scheduled';
      case 'rejected': return 'Not Selected';
      case 'accepted': return 'Accepted';
      default: return 'Applied';
    }
  };

  const filteredJobs = appliedJobs.filter(job => {
    if (filterStatus === 'all') return true;
    return job.status === filterStatus;
  });

  const stats = {
    total: appliedJobs.length,
    underReview: appliedJobs.filter(job => job.status === 'under-review').length,
    shortlisted: appliedJobs.filter(job => job.status === 'shortlisted').length,
    interviews: appliedJobs.filter(job => job.status === 'interview-scheduled').length,
    rejected: appliedJobs.filter(job => job.status === 'rejected').length,
  };

  const toggleDetails = (jobId) => {
    setExpandedJobId(prev => (prev === jobId ? null : jobId));
  };

  if (loading) {
    return (
      <div className="applied-jobs-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading your applied jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="applied-jobs-container">
      <div className="applied-jobs-header">
        <h1>My Applied Jobs</h1>
        <p>Track the status of jobs you've applied to</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon total">
            <FiBriefcase />
          </div>
          <div className="stat-info">
            <h3>{stats.total}</h3>
            <p>Total Applied</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon review">
            <FiClock />
          </div>
          <div className="stat-info">
            <h3>{stats.underReview}</h3>
            <p>Under Review</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon shortlisted">
            <FiCheckCircle />
          </div>
          <div className="stat-info">
            <h3>{stats.shortlisted}</h3>
            <p>Shortlisted</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon interview">
            <FiCalendar />
          </div>
          <div className="stat-info">
            <h3>{stats.interviews}</h3>
            <p>Interviews</p>
          </div>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="filter-buttons">
        <button
          className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
          onClick={() => setFilterStatus('all')}
        >
          All ({stats.total})
        </button>
        <button
          className={`filter-btn ${filterStatus === 'under-review' ? 'active' : ''}`}
          onClick={() => setFilterStatus('under-review')}
        >
          Under Review ({stats.underReview})
        </button>
        <button
          className={`filter-btn ${filterStatus === 'shortlisted' ? 'active' : ''}`}
          onClick={() => setFilterStatus('shortlisted')}
        >
          Shortlisted ({stats.shortlisted})
        </button>
        <button
          className={`filter-btn ${filterStatus === 'interview-scheduled' ? 'active' : ''}`}
          onClick={() => setFilterStatus('interview-scheduled')}
        >
          Interviews ({stats.interviews})
        </button>
        <button
          className={`filter-btn ${filterStatus === 'rejected' ? 'active' : ''}`}
          onClick={() => setFilterStatus('rejected')}
        >
          Rejected ({stats.rejected})
        </button>
      </div>

      {/* Applied Jobs List */}
      <div className="applied-jobs-list">
        {filteredJobs.length === 0 ? (
          <div className="no-jobs">
            <FiBriefcase size={48} />
            <h3>No jobs found</h3>
            <p>You haven't applied to any jobs yet or no jobs match your filter.</p>
          </div>
        ) : (
          filteredJobs.map(job => (
            <div key={job.id} className="applied-job-card">
              <div className="job-card-header">
                <div className="company-logo">
                  <img src={job.logo} alt={job.company} />
                </div>
                <div className="job-info">
                  <h3>{job.title}</h3>
                  <p className="company">{job.company}</p>
                  <div className="job-meta">
                    <span className="location">
                      <FiMapPin size={14} />
                      {job.location}
                    </span>
                    <span className="salary">
                      <FiDollarSign size={14} />
                      {job.salary}
                    </span>
                    <span className="experience">
                      <FiBriefcase size={14} />
                      {job.experience}
                    </span>
                  </div>
                </div>
                <div className="status-badge" style={{ backgroundColor: getStatusColor(job.status) }}>
                  {getStatusIcon(job.status)}
                  <span>{getStatusText(job.status)}</span>
                </div>
              </div>

              <div className="job-card-body">
                <p className="job-description">{job.description}</p>
                <div className="job-dates">
                  <span className="posted-date">
                    <FiCalendar size={14} />
                    Posted {formatTimeAgo(job.postedDate)}
                  </span>
                  <span className="applied-date">
                    <FiClock size={14} />
                    Applied: {new Date(job.appliedDate).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="job-card-footer">
                <span className="job-type">{job.type}</span>
                <button
                  className="view-details-btn"
                  onClick={() => toggleDetails(job.id)}
                >
                  <FiEye size={14} />
                  {expandedJobId === job.id ? 'Hide Details' : 'View Details'}
                </button>
              </div>

              {expandedJobId === job.id && (
                <div className="job-details">
                  <div className="detail-grid">
                    <div>
                      <p className="detail-label">Status</p>
                      <p className="detail-value">{getStatusText(job.status)}</p>
                    </div>
                    <div>
                      <p className="detail-label">Type</p>
                      <p className="detail-value">{job.type}</p>
                    </div>
                    <div>
                      <p className="detail-label">Salary</p>
                      <p className="detail-value">{job.salary}</p>
                    </div>
                    <div>
                      <p className="detail-label">Experience</p>
                      <p className="detail-value">{job.experience}</p>
                    </div>
                    <div>
                      <p className="detail-label">Posted</p>
                      <p className="detail-value">{formatTimeAgo(job.postedDate)}</p>
                    </div>
                    <div>
                      <p className="detail-label">Applied</p>
                      <p className="detail-value">{new Date(job.appliedDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="detail-description">
                    <p className="detail-label">Description</p>
                    <p className="detail-value">{job.description}</p>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
      </div>
    </>
  );
};

export default AppliedJobs;