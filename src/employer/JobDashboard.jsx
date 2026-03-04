import React, { useState, useEffect } from 'react';
import './JobDashboard.css';
import Jobs from './components/jobs';
import ApplicationsTab from './components/Applications';
import Candidates from './components/Candidates';
import OverviewTab from './components/OverviewTab';
import AssistantChat from '../components/AssistantChat';

const JobDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0,
    hiredCandidates: 0
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [jobForm, setJobForm] = useState({
    title: '',
    department: '',
    location: '',
    type: 'Full-time',
    status: 'draft',
    salary: '',
    
    experience: '',
    description: ''
  });
  const [jobStatusFilter, setJobStatusFilter] = useState('all');
  const [applicationStatusFilter, setApplicationStatusFilter] = useState('all');
  const [candidateStatusFilter, setCandidateStatusFilter] = useState('all');
  const [activeStatCard, setActiveStatCard] = useState(null);
  const [employerProfile, setEmployerProfile] = useState({
    name: '',
    industry: '',
    size: '',
    website: '',
    location: '',
    logo: '',
    description: '',
    contactEmail: '',
    contactPhone: '',
    companyType: '',
    yearEstablished: '',
    registrationNumber: '',
    headOfficeLocation: '',
    branchLocations: '',
    country: '',
    stateRegion: '',
    city: '',
    pinCode: '',
    address: '',
    googleMapsLink: '',
    hrName: '',
    officialEmail: '',
    altEmail: '',
    mobileNumber: '',
    altPhone: '',
    designation: '',
    linkedin: '',
    facebook: '',
    twitter: '',
    instagram: '',
    shortDescription: '',
    detailedOverview: '',
    missionVision: '',
    servicesProducts: '',
    workCultureNotes: ''
  });
  const [showProfileEditor, setShowProfileEditor] = useState(false);
  const [modalEditing, setModalEditing] = useState(false);

  const openProfileEditor = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    // debug log - remove if not needed
    try { console.log('Opening profile editor'); } catch(_){}
    setModalEditing(false);
    setShowProfileEditor(true);
  };

  // load saved profile (frontend-only)
  useEffect(() => {
    try {
      const saved = localStorage.getItem('employerProfile');
      if (saved) setEmployerProfile(JSON.parse(saved));
    } catch (e) {
      // ignore
    }
  }, []);

  const handleLogoChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    if (!/image\/(png|jpe?g)/.test(file.type)) return alert('Please upload PNG or JPG');
    const reader = new FileReader();
    reader.onload = (ev) => {
      setEmployerProfile(prev => ({ ...prev, logo: ev.target.result }));
    };
    reader.readAsDataURL(file);
  };

  const removeLogo = () => setEmployerProfile(prev => ({ ...prev, logo: '' }));

  const updateProfile = () => {
    try {
      localStorage.setItem('employerProfile', JSON.stringify(employerProfile));
      alert('Employer profile updated');
    } catch (e) {
      console.error('save failed', e);
    }
  };

  // Mock data
  useEffect(() => {
   const mockJobs = [
  {
    id: 1,
    title: 'Senior Frontend Developer',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
    status: 'active',
    applications: 24,
    datePosted: '2024-01-15',
    salary: '₹90,000 - ₹120,000'
  },
  {
    id: 2,
    title: 'Product Manager',
    department: 'Product',
    location: 'New York, NY',
    type: 'Full-time',
    status: 'active',
    applications: 18,
    datePosted: '2024-01-10',
    salary: '₹110,000 - ₹140,000'
  },
  {
    id: 3,
    title: 'UX Designer',
    department: 'Design',
    location: 'San Francisco, CA',
    type: 'Contract',
    status: 'draft',
    applications: 0,
    datePosted: '2024-01-18',
    salary: '₹80,000 - ₹100,000'
  },
  {
    id: 4,
    title: 'Backend Engineer',
    department: 'Engineering',
    location: 'Bangalore, India',
    type: 'Full-time',
    status: 'active',
    applications: 32,
    datePosted: '2023-12-01',
    salary: '₹95,000 - ₹125,000'
  },
  {
    id: 5,
    title: 'Data Scientist',
    department: 'Analytics',
    location: 'Hybrid',
    type: 'Full-time',
    status: 'active',
    applications: 15,
    datePosted: '2024-01-08',
    salary: '₹100,000 - ₹130,000'
  },
  {
    id: 6,
    title: 'DevOps Engineer',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
    status: 'closed',
    applications: 28,
    datePosted: '2023-11-20',
    salary: '₹85,000 - ₹115,000'
  },
  {
    id: 7,
    title: 'Marketing Intern',
    department: 'Marketing',
    location: 'Mumbai, India',
    type: 'Internship',
    status: 'active',
    applications: 42,
    datePosted: '2024-01-05',
    salary: '₹25,000 - ₹35,000'
  },
  {
    id: 8,
    title: 'Sales Representative',
    department: 'Sales',
    location: 'Delhi, India',
    type: 'Full-time',
    status: 'draft',
    applications: 0,
    datePosted: '2024-01-22',
    salary: '₹60,000 - ₹80,000'
  }
];

const mockApplications = [
  {
    id: 1,
    jobId: 1,
    candidateName: 'John Smith',
    candidateEmail: 'john.smith@email.com',
    candidateLocation: 'San Francisco, CA',
    status: 'review',
    appliedDate: '2024-01-20',
    experience: '5 years',
    skills: ['React', 'TypeScript', 'Node.js', 'JavaScript', 'HTML/CSS'],
    cvUrl: 'https://example.com/john-smith-cv.pdf',
    notes: 'Strong portfolio with enterprise projects'
  },
  {
    id: 2,
    jobId: 1,
    candidateName: 'Sarah Johnson',
    candidateEmail: 'sarah.j@email.com',
    candidateLocation: 'New York, NY',
    status: 'interview',
    appliedDate: '2024-01-18',
    experience: '3 years',
    skills: ['Vue', 'JavaScript', 'CSS', 'UI/UX', 'Figma'],
    cvUrl: 'https://example.com/sarah-johnson-cv.pdf',
    notes: 'Good communication skills'
  },
  {
    id: 3,
    jobId: 2,
    candidateName: 'Mike Chen',
    candidateEmail: 'mike.chen@email.com',
    candidateLocation: 'Chicago, IL',
    status: 'hired',
    appliedDate: '2024-01-12',
    experience: '6 years',
    skills: ['Product Strategy', 'Agile', 'Analytics', 'Roadmapping', 'JIRA'],
    cvUrl: 'https://example.com/mike-chen-cv.pdf',
    notes: 'Previous experience at FAANG company'
  },
  {
    id: 4,
    jobId: 1,
    candidateName: 'Emily Davis',
    candidateEmail: 'emily.davis@email.com',
    candidateLocation: 'Austin, TX',
    status: 'rejected',
    appliedDate: '2024-01-22',
    experience: '4 years',
    skills: ['React', 'Redux', 'Testing', 'Jest', 'Webpack'],
    cvUrl: 'https://example.com/emily-davis-cv.pdf',
    notes: 'Lacking TypeScript experience'
  },
  {
    id: 5,
    jobId: 4,
    candidateName: 'Raj Patel',
    candidateEmail: 'raj.patel@email.com',
    candidateLocation: 'Bangalore, India',
    status: 'interview',
    appliedDate: '2024-01-19',
    experience: '4 years',
    skills: ['Java', 'Spring Boot', 'MySQL', 'Microservices', 'AWS'],
    cvUrl: 'https://example.com/raj-patel-cv.pdf',
    notes: 'Strong backend fundamentals'
  },
  {
    id: 6,
    jobId: 5,
    candidateName: 'Priya Sharma',
    candidateEmail: 'priya.sharma@email.com',
    candidateLocation: 'Hyderabad, India',
    status: 'review',
    appliedDate: '2024-01-21',
    experience: '3 years',
    skills: ['Python', 'Machine Learning', 'TensorFlow', 'SQL', 'Statistics'],
    cvUrl: 'https://example.com/priya-sharma-cv.pdf',
    notes: 'PhD in Data Science'
  },
  {
    id: 7,
    jobId: 3,
    candidateName: 'David Kim',
    candidateEmail: 'david.kim@email.com',
    candidateLocation: 'Seattle, WA',
    status: 'review',
    appliedDate: '2024-01-16',
    experience: '2 years',
    skills: ['Figma', 'Sketch', 'Adobe Creative Suite', 'Wireframing', 'Prototyping'],
    cvUrl: 'https://example.com/david-kim-cv.pdf',
    notes: 'Creative portfolio'
  },
  {
    id: 8,
    jobId: 6,
    candidateName: 'Maria Garcia',
    candidateEmail: 'maria.garcia@email.com',
    candidateLocation: 'Miami, FL',
    status: 'hired',
    appliedDate: '2024-01-14',
    experience: '5 years',
    skills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Linux'],
    cvUrl: 'https://example.com/maria-garcia-cv.pdf',
    notes: 'Excellent infrastructure knowledge'
  },
  {
    id: 9,
    jobId: 7,
    candidateName: 'Amit Kumar',
    candidateEmail: 'amit.kumar@email.com',
    candidateLocation: 'Mumbai, India',
    status: 'interview',
    appliedDate: '2024-01-23',
    experience: '0 years',
    skills: ['Social Media', 'Content Writing', 'SEO', 'Google Analytics'],
    cvUrl: 'https://example.com/amit-kumar-cv.pdf',
    notes: 'Recent graduate with marketing degree'
  },
  {
    id: 10,
    jobId: 1,
    candidateName: 'Lisa Wang',
    candidateEmail: 'lisa.wang@email.com',
    candidateLocation: 'Toronto, Canada',
    status: 'review',
    appliedDate: '2024-01-24',
    experience: '2 years',
    skills: ['React', 'Next.js', 'GraphQL', 'TypeScript', 'Tailwind'],
    cvUrl: 'https://example.com/lisa-wang-cv.pdf',
    notes: 'Good modern tech stack knowledge'
  },
  {
    id: 11,
    jobId: 4,
    candidateName: 'Carlos Rodriguez',
    candidateEmail: 'carlos.rodriguez@email.com',
    candidateLocation: 'Mexico City, Mexico',
    status: 'rejected',
    appliedDate: '2024-01-17',
    experience: '1 year',
    skills: ['Python', 'Django', 'PostgreSQL', 'REST APIs'],
    cvUrl: 'https://example.com/carlos-rodriguez-cv.pdf',
    notes: 'Not enough experience for senior role'
  },
  {
    id: 12,
    jobId: 5,
    candidateName: 'Wei Zhang',
    candidateEmail: 'wei.zhang@email.com',
    candidateLocation: 'Singapore',
    status: 'interview',
    appliedDate: '2024-01-25',
    experience: '4 years',
    skills: ['R', 'Python', 'Tableau', 'Big Data', 'Statistical Modeling'],
    cvUrl: 'https://example.com/wei-zhang-cv.pdf',
    notes: 'Strong analytical background'
  },
  {
    id: 13,
    jobId: 2,
    candidateName: 'Sophie Martin',
    candidateEmail: 'sophie.martin@email.com',
    candidateLocation: 'Paris, France',
    status: 'review',
    appliedDate: '2024-01-26',
    experience: '5 years',
    skills: ['Product Management', 'User Research', 'A/B Testing', 'Data Analysis'],
    cvUrl: 'https://example.com/sophie-martin-cv.pdf',
    notes: 'MBA from INSEAD'
  },
  {
    id: 14,
    jobId: 7,
    candidateName: 'James Wilson',
    candidateEmail: 'james.wilson@email.com',
    candidateLocation: 'London, UK',
    status: 'rejected',
    appliedDate: '2024-01-27',
    experience: '1 year',
    skills: ['Digital Marketing', 'Social Media', 'Content Creation'],
    cvUrl: 'https://example.com/james-wilson-cv.pdf',
    notes: 'Looking for full-time role, not internship'
  },
  {
    id: 15,
    jobId: 3,
    candidateName: 'Anna Kowalski',
    candidateEmail: 'anna.kowalski@email.com',
    candidateLocation: 'Berlin, Germany',
    status: 'hired',
    appliedDate: '2024-01-28',
    experience: '3 years',
    skills: ['UI Design', 'User Research', 'Prototyping', 'Design Systems'],
    cvUrl: 'https://example.com/anna-kowalski-cv.pdf',
    notes: 'Excellent design portfolio'
  }
];

    setJobs(mockJobs);
    setApplications(mockApplications);
    setStats({
      totalJobs: mockJobs.length,
      activeJobs: mockJobs.filter(job => job.status === 'active').length,
      totalApplications: mockApplications.length,
      hiredCandidates: mockApplications.filter(app => app.status === 'hired').length
    });
  }, []);

  // Job Form Handlers
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
      description: ''
    });
    setShowAddForm(true);
  };

  const handleCancel = () => {
    setShowAddForm(false);  
  };

  const handleSaveJob = (e) => {
    e.preventDefault();
    const newJob = {
      ...jobForm,
      id: Date.now(),
      applications: 0,
      datePosted: new Date().toISOString().split('T')[0]
    };
    setJobs(prev => [...prev, newJob]);
    setShowAddForm(false);
  };

  // Job Handlers
  const handleAddJob = (newJob) => {
    const job = {
      ...newJob,
      id: Date.now(),
      applications: 0
    };
    setJobs(prev => [...prev, job]);
  };

  const handleEditJob = (jobId, updatedData) => {
    setJobs(prev => prev.map(job => 
      job.id === jobId ? { ...job, ...updatedData } : job
    ));
  };

  const handleDeleteJob = (jobId) => {
    setJobs(prev => prev.filter(job => job.id !== jobId));
  };

  const handleStatusChange = (jobId, newStatus) => {
    setJobs(prev => prev.map(job => 
      job.id === jobId ? { ...job, status: newStatus } : job
    ));
  };

  // Application Handlers
  const handleViewCV = (application) => {
    console.log('View CV for:', application.candidateName);
    if (application.cvUrl) {
      window.open(application.cvUrl, '_blank');
    }
  };

  const handleScheduleInterview = (applicationId, scheduleData) => {
    setApplications(prev => prev.map(app => 
      app.id === applicationId 
        ? { 
            ...app, 
            status: 'interview',
            interviewSchedule: scheduleData
          } 
        : app
    ));
  };

  const handleApplicationStatusChange = (applicationId, newStatus) => {
    setApplications(prev => prev.map(app => 
      app.id === applicationId ? { ...app, status: newStatus } : app
    ));
  };

  const handleContactCandidate = (application) => {
    console.log('Contact candidate:', application.candidateEmail);
    const subject = `Regarding your application`;
    const body = `Dear ${application.candidateName},\n\n`;
    window.open(`mailto:${application.candidateEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  };

  const handleAddNote = (applicationId, notes) => {
    setApplications(prev => prev.map(app => 
      app.id === applicationId ? { ...app, notes } : app
    ));
  };

  // Candidate Handlers
  const handleCandidateContact = (candidate) => {
    console.log('Contact candidate:', candidate.candidateEmail);
    const subject = 'Opportunity at Our Company';
    const body = `Dear ${candidate.candidateName},\n\nWe were impressed by your profile.`;
    window.open(`mailto:${candidate.candidateEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  };

  const handleCandidateViewResume = (candidate) => {
    console.log('View candidate resume:', candidate.candidateName);
    if (candidate.cvUrl) {
      window.open(candidate.cvUrl, '_blank');
    } else {
      alert('No resume available for this candidate');
    }
  };



// Add logout handler
const handleLogout = () => {
  console.log('Logging out...');
  // Add your logout logic here
  // For example: clear tokens, redirect to login, etc.
};

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setActiveStatCard(null);
  };

  const handleJobFilterChange = (value) => {
    setJobStatusFilter(value);
    setActiveStatCard(null);
  };

  const handleApplicationFilterChange = (value) => {
    setApplicationStatusFilter(value);
    setActiveStatCard(null);
  };

  const handleStatCardClick = (cardType) => {
    setActiveStatCard(cardType);
    switch (cardType) {
      case 'totalJobs':
        setActiveTab('jobs');
        setJobStatusFilter('all');
        break;
      case 'activeJobs':
        setActiveTab('jobs');
        setJobStatusFilter('active');
        break;
      case 'totalApplications':
        setActiveTab('applications');
        setApplicationStatusFilter('all');
        break;
      case 'hiredCandidates':
        setActiveTab('candidates');
        setCandidateStatusFilter('hired');
        break;
      default:
        break;
    }
  };

  const handleStatCardKeyPress = (event, cardType) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleStatCardClick(cardType);
    }
  };


  return (
    <div className="job-dashboard">
      {/* Side Navigation */}
      <div className="dashboard-sidebar">
        <div className="sidebar-header">
          <h2>Job Dashboard</h2>
          <p>Manage your hiring process</p>

        </div>

        <div className="employer-profile-card">
          <div className="compact-profile" onClick={openProfileEditor} role="button" tabIndex={0}>
            <div className="logo-ring">
              {employerProfile.logo ? (
                <img src={employerProfile.logo} alt="company logo" className="logo-img" />
              ) : (
                <div className="logo-fallback">{(employerProfile.name || 'Co').split(' ').map(s=>s[0]).slice(0,2).join('')}</div>
              )}
            </div>

            <div className="compact-info">
              <h4 className="company-name">{employerProfile.name || 'Your Company'}</h4>
              <p className="company-role">{employerProfile.industry || 'Industry'}</p>
              <p className="company-location">@ {employerProfile.location || 'Location'}</p>
              <p className="updated">Last updated 1m ago</p>
              <button type="button" className="btn-view" onClick={openProfileEditor}>View profile</button>
            </div>

            <input id="companyLogoInput" type="file" accept="image/png, image/jpeg" style={{ display: 'none' }} onChange={handleLogoChange} />
          </div>

          {/* editor opens in modal — see modal markup below */}
        </div>
        <nav className="sidebar-nav">
          <button 
            className={`nav-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => handleTabChange('overview')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" fill="currentColor"/>
            </svg>
            Overview
          </button>
          <button 
            className={`nav-btn ${activeTab === 'jobs' ? 'active' : ''}`}
            onClick={() => handleTabChange('jobs')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" stroke="currentColor" strokeWidth="2"/>
              <path d="M14 2v6h6" stroke="currentColor" strokeWidth="2"/>
            </svg>
            Job Postings
          </button>
          <button 
            className={`nav-btn ${activeTab === 'applications' ? 'active' : ''}`}
            onClick={() => handleTabChange('applications')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" fill="currentColor"/>
            </svg>
            Applications
          </button>
          <button 
            className={`nav-btn ${activeTab === 'candidates' ? 'active' : ''}`}
            onClick={() => handleTabChange('candidates')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="currentColor"/>
            </svg>
            Candidates
          </button>

          <button className="logout-btn" onClick={handleLogout}>
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" fill="currentColor"/>
    </svg>
    Logout
  </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="dashboard-main">
        {/* Header */}
        {/* <div className="dashboard-header">
          <div className="header-content">
            <h1>
              {activeTab === 'overview' && 'Dashboard Overview'}
              {activeTab === 'jobs' && 'Job Postings'}
              {activeTab === 'applications' && 'Applications'}
              {activeTab === 'candidates' && 'Candidates Pool'}
            </h1>
            <p>
              {activeTab === 'overview' && 'Manage your job postings and candidate applications'}
              {activeTab === 'jobs' && 'Create and manage job listings'}
              {activeTab === 'applications' && 'Review and process candidate applications'}
              {activeTab === 'candidates' && 'Browse and contact potential candidates'}
            </p>
          </div>
          
        </div> */}

        {/* Stats Overview - Only show on overview tab */}
        {activeTab === 'overview' && (
          <div className="stats-grid">
            <div
              className={`stat-card clickable ${activeStatCard === 'totalJobs' ? 'active' : ''}`}
              role="button"
              tabIndex={0}
              onClick={() => handleStatCardClick('totalJobs')}
              onKeyDown={(event) => handleStatCardKeyPress(event, 'totalJobs')}
            >
              <div className="stat-icon total-jobs">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" stroke="currentColor" strokeWidth="2"/>
                  <path d="M14 2v6h6" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <div className="stat-info">
                <h3>{stats.totalJobs}</h3>
                <p>Total Jobs</p>
              </div>
            </div>

            <div
              className={`stat-card clickable ${activeStatCard === 'activeJobs' ? 'active' : ''}`}
              role="button"
              tabIndex={0}
              onClick={() => handleStatCardClick('activeJobs')}
              onKeyDown={(event) => handleStatCardKeyPress(event, 'activeJobs')}
            >
              <div className="stat-icon active-jobs">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 5.5V7H9V5.5L3 7V9L9 10.5V12H15V10.5L21 9Z" fill="currentColor"/>
                </svg>
              </div>
              <div className="stat-info">
                <h3>{stats.activeJobs}</h3>
                <p>Active Jobs</p>
              </div>
            </div>

            <div
              className={`stat-card clickable ${activeStatCard === 'totalApplications' ? 'active' : ''}`}
              role="button"
              tabIndex={0}
              onClick={() => handleStatCardClick('totalApplications')}
              onKeyDown={(event) => handleStatCardKeyPress(event, 'totalApplications')}
            >
              <div className="stat-icon applications">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" fill="currentColor"/>
                </svg>
              </div>
              <div className="stat-info">
                <h3>{stats.totalApplications}</h3>
                <p>Total Applications</p>
              </div>
            </div>

            <div
              className={`stat-card clickable ${activeStatCard === 'hiredCandidates' ? 'active' : ''}`}
              role="button"
              tabIndex={0}
              onClick={() => handleStatCardClick('hiredCandidates')}
              onKeyDown={(event) => handleStatCardKeyPress(event, 'hiredCandidates')}
            >
              <div className="stat-icon hired">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="currentColor"/>
                </svg>
              </div>
              <div className="stat-info">
                <h3>{stats.hiredCandidates}</h3>
                <p>Hired Candidates</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'overview' && (
            <OverviewTab jobs={jobs} applications={applications} />
          )}

          {activeTab === 'jobs' && (
            <Jobs 
              jobs={jobs}
              statusFilter={jobStatusFilter}
              onStatusFilterChange={handleJobFilterChange}
              onAddJob={handleAddJob}
              onEditJob={handleEditJob}
              onDeleteJob={handleDeleteJob}
              onStatusChange={handleStatusChange} 
            />
          )}

          {activeTab === 'applications' && (
            <ApplicationsTab
              applications={applications}
              jobs={jobs}
              statusFilter={applicationStatusFilter}
              onStatusFilterChange={handleApplicationFilterChange}
              onViewCV={handleViewCV}
              onScheduleInterview={handleScheduleInterview}
              onStatusChange={handleApplicationStatusChange}
              onContactCandidate={handleContactCandidate}
              onAddNote={handleAddNote}
            />
          )}

          {activeTab === 'candidates' && (
            <Candidates 
              applications={applications}
              statusFilter={candidateStatusFilter}
              onContactCandidate={handleCandidateContact}
              onViewResume={handleCandidateViewResume}
            />
          )}
        </div>
      </div>

        {/* Profile Editor Modal */}
        {showProfileEditor && (
          <div className="modal-overlay" onClick={() => setShowProfileEditor(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Company Profile</h3>
                <div style={{display:'flex',gap:8,alignItems:'center'}}>
                  {!modalEditing ? (
                    <button className="btn-update" onClick={() => setModalEditing(true)}>Edit</button>
                  ) : (
                    <button className="btn-secondary" onClick={() => setModalEditing(false)}>Preview</button>
                  )}
                  <button className="btn-close" onClick={() => setShowProfileEditor(false)}>✕</button>
                </div>
              </div>
              <div className="modal-body">
                {!modalEditing ? (
                  <div className="profile-view">
                    <div className="profile-view-header">
                      <div className="logo-ring-large">
                        {employerProfile.logo ? <img src={employerProfile.logo} alt="logo" className="logo-img-large" /> : <div className="logo-fallback-large">{(employerProfile.name||'Co').split(' ').map(s=>s[0]).slice(0,2).join('')}</div>}
                      </div>
                      <div className="profile-view-meta">
                        <h2 className="company-name">{employerProfile.name || 'Your Company'}</h2>
                        <div className="company-role">{employerProfile.industry || 'Industry'} • {employerProfile.size || 'Size'}</div>
                        <div className="company-location">{employerProfile.location || 'Location'}</div>
                        <a className="company-website" href={employerProfile.website ? (employerProfile.website.startsWith('http')?employerProfile.website:`https://${employerProfile.website}`) : '#'} target="_blank" rel="noreferrer">{employerProfile.website ? employerProfile.website.replace(/^https?:\/\//,'') : 'No website'}</a>
                      </div>
                    </div>
                    <div className="profile-view-body">
                      <p className="company-description">{employerProfile.description || 'Add a short description about your company.'}</p>
                      <div className="company-contact">
                        <div><strong>Contact:</strong> {employerProfile.contactEmail || '—'}</div>
                        <div><strong>Phone:</strong> {employerProfile.contactPhone || '—'}</div>
                      </div>
                    </div>
                    <div style={{display:'flex',gap:8,justifyContent:'flex-end',marginTop:12}}>
                      <button className="btn-update" onClick={() => { updateProfile(); setShowProfileEditor(false); }}>Save</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div style={{display: 'flex', gap: '1rem', alignItems: 'center'}}>
                      <div style={{width:96,height:96,borderRadius:12,overflow:'hidden',background:'#fff',display:'grid',placeItems:'center'}}>
                        {employerProfile.logo ? <img src={employerProfile.logo} alt="logo" style={{width:96,height:96,objectFit:'cover'}} /> : <div style={{color:'#047857',fontWeight:700}}>{(employerProfile.name||'Co').split(' ').map(s=>s[0]).slice(0,2).join('')}</div>}
                      </div>
                      <div>
                        <input id="companyLogoInputModal" type="file" accept="image/png, image/jpeg" style={{display:'none'}} onChange={handleLogoChange} />
                        <button className="btn-update" onClick={() => document.getElementById('companyLogoInputModal')?.click()}>Upload logo</button>
                        <button className="btn-remove" onClick={removeLogo} style={{marginLeft:8}}>Remove</button>
                      </div>
                    </div>

                      <div className="section">
                        <h4 className="section-heading">1. Company Information</h4>
                        <div style={{marginTop:8}}>
                          <input className="company-input" placeholder="Company name" value={employerProfile.name} onChange={(e)=>setEmployerProfile(prev=>({...prev,name:e.target.value}))} />
                        </div>
                        <div className="form-grid" style={{marginTop:8}}>
                          <select className="company-input" value={employerProfile.industry} onChange={(e)=>setEmployerProfile(prev=>({...prev,industry:e.target.value}))}>
                            <option value="">Industry</option>
                            <option>IT</option>
                            <option>Healthcare</option>
                            <option>Finance</option>
                            <option>Education</option>
                            <option>Manufacturing</option>
                            <option>Other</option>
                          </select>
                          <input className="company-input" placeholder="Company Type (Startup, MNC, Agency)" value={employerProfile.companyType} onChange={(e)=>setEmployerProfile(prev=>({...prev,companyType:e.target.value}))} />
                        </div>
                        <div className="form-grid" style={{marginTop:8}}>
                          <select className="company-input" value={employerProfile.size} onChange={(e)=>setEmployerProfile(prev=>({...prev,size:e.target.value}))}>
                            <option value="">Company size</option>
                            <option>1-10</option>
                            <option>11-50</option>
                            <option>51-200</option>
                            <option>201-500</option>
                            <option>500+</option>
                          </select>
                          <input className="company-input" placeholder="Year of Establishment" value={employerProfile.yearEstablished} onChange={(e)=>setEmployerProfile(prev=>({...prev,yearEstablished:e.target.value}))} />
                        </div>
                        <div style={{marginTop:8}}>
                          <input className="company-input" placeholder="Company Registration Number (optional)" value={employerProfile.registrationNumber} onChange={(e)=>setEmployerProfile(prev=>({...prev,registrationNumber:e.target.value}))} />
                        </div>
                      </div>

                      <div className="section" style={{marginTop:12}}>
                        <h4 className="section-heading">2. Contact & Location</h4>
                        <div style={{marginTop:8}}>
                          <input className="company-input" placeholder="Head Office Location" value={employerProfile.headOfficeLocation} onChange={(e)=>setEmployerProfile(prev=>({...prev,headOfficeLocation:e.target.value}))} />
                        </div>
                        <div style={{marginTop:8}}>
                          <input className="company-input" placeholder="Branch Locations (comma separated)" value={employerProfile.branchLocations} onChange={(e)=>setEmployerProfile(prev=>({...prev,branchLocations:e.target.value}))} />
                        </div>
                        <div className="form-grid" style={{marginTop:8}}>
                          <input className="company-input" placeholder="Country" value={employerProfile.country} onChange={(e)=>setEmployerProfile(prev=>({...prev,country:e.target.value}))} />
                          <input className="company-input" placeholder="State" value={employerProfile.stateRegion} onChange={(e)=>setEmployerProfile(prev=>({...prev,stateRegion:e.target.value}))} />
                        </div>
                        <div className="form-grid" style={{marginTop:8}}>
                          <input className="company-input" placeholder="City" value={employerProfile.city} onChange={(e)=>setEmployerProfile(prev=>({...prev,city:e.target.value}))} />
                          <input className="company-input" placeholder="Pin Code" value={employerProfile.pinCode} onChange={(e)=>setEmployerProfile(prev=>({...prev,pinCode:e.target.value}))} />
                        </div>
                        <div style={{marginTop:8}}>
                          <input className="company-input" placeholder="Company Address" value={employerProfile.address} onChange={(e)=>setEmployerProfile(prev=>({...prev,address:e.target.value}))} />
                        </div>
                        <div style={{marginTop:8}}>
                          <input className="company-input" placeholder="Google Maps Location Link (optional)" value={employerProfile.googleMapsLink} onChange={(e)=>setEmployerProfile(prev=>({...prev,googleMapsLink:e.target.value}))} />
                        </div>
                      </div>

                      <div className="section" style={{marginTop:12}}>
                        <h4 className="section-heading">3. HR / Recruiter Details</h4>
                        <div className="form-grid" style={{marginTop:8}}>
                          <input className="company-input" placeholder="HR / Recruiter Name" value={employerProfile.hrName} onChange={(e)=>setEmployerProfile(prev=>({...prev,hrName:e.target.value}))} />
                          <input className="company-input" placeholder="Designation" value={employerProfile.designation} onChange={(e)=>setEmployerProfile(prev=>({...prev,designation:e.target.value}))} />
                        </div>
                        <div className="form-grid" style={{marginTop:8}}>
                          <input className="company-input" placeholder="Official Email ID" value={employerProfile.officialEmail} onChange={(e)=>setEmployerProfile(prev=>({...prev,officialEmail:e.target.value}))} />
                          <input className="company-input" placeholder="Alternate Email ID (optional)" value={employerProfile.altEmail} onChange={(e)=>setEmployerProfile(prev=>({...prev,altEmail:e.target.value}))} />
                        </div>
                        <div className="form-grid" style={{marginTop:8}}>
                          <input className="company-input" placeholder="Mobile Number" value={employerProfile.mobileNumber} onChange={(e)=>setEmployerProfile(prev=>({...prev,mobileNumber:e.target.value}))} />
                          <input className="company-input" placeholder="Alternate Phone (optional)" value={employerProfile.altPhone} onChange={(e)=>setEmployerProfile(prev=>({...prev,altPhone:e.target.value}))} />
                        </div>
                      </div>

                      <div className="section" style={{marginTop:12}}>
                        <h4 className="section-heading">4. Online Presence</h4>
                        <div className="form-grid" style={{marginTop:8}}>
                          <input className="company-input" placeholder="Company Website" value={employerProfile.website} onChange={(e)=>setEmployerProfile(prev=>({...prev,website:e.target.value}))} />
                          <input className="company-input" placeholder="LinkedIn Page" value={employerProfile.linkedin} onChange={(e)=>setEmployerProfile(prev=>({...prev,linkedin:e.target.value}))} />
                        </div>
                        <div className="form-grid" style={{marginTop:8}}>
                          <input className="company-input" placeholder="Facebook Page (optional)" value={employerProfile.facebook} onChange={(e)=>setEmployerProfile(prev=>({...prev,facebook:e.target.value}))} />
                          <input className="company-input" placeholder="Twitter / X Handle (optional)" value={employerProfile.twitter} onChange={(e)=>setEmployerProfile(prev=>({...prev,twitter:e.target.value}))} />
                        </div>
                        <div style={{marginTop:8}}>
                          <input className="company-input" placeholder="Instagram Page (optional)" value={employerProfile.instagram} onChange={(e)=>setEmployerProfile(prev=>({...prev,instagram:e.target.value}))} />
                        </div>
                      </div>

                      <div className="section" style={{marginTop:12}}>
                        <h4 className="section-heading">5. Company Description</h4>
                        <div style={{marginTop:8}}>
                          <input className="company-input" placeholder="Short Description (150-200 chars)" value={employerProfile.shortDescription} onChange={(e)=>setEmployerProfile(prev=>({...prev,shortDescription:e.target.value}))} />
                        </div>
                        <div style={{marginTop:8}}>
                          <textarea className="company-input" placeholder="Detailed Company Overview (About Us)" value={employerProfile.detailedOverview} onChange={(e)=>setEmployerProfile(prev=>({...prev,detailedOverview:e.target.value}))} rows={4} />
                        </div>
                        <div style={{marginTop:8}}>
                          <textarea className="company-input" placeholder="Mission & Vision (optional)" value={employerProfile.missionVision} onChange={(e)=>setEmployerProfile(prev=>({...prev,missionVision:e.target.value}))} rows={2} />
                        </div>
                        <div style={{marginTop:8}}>
                          <textarea className="company-input" placeholder="Services / Products Offered" value={employerProfile.servicesProducts} onChange={(e)=>setEmployerProfile(prev=>({...prev,servicesProducts:e.target.value}))} rows={2} />
                        </div>
                        <div style={{marginTop:8}}>
                          <textarea className="company-input" placeholder="Work Culture Notes (optional)" value={employerProfile.workCultureNotes} onChange={(e)=>setEmployerProfile(prev=>({...prev,workCultureNotes:e.target.value}))} rows={2} />
                        </div>
                      </div>

                      <div className="modal-actions" style={{display:'flex',gap:8,justifyContent:'flex-end',marginTop:12}}>
                        <button className="btn-secondary" onClick={() => setModalEditing(false)}>Cancel</button>
                        <button className="btn-update" onClick={() => { updateProfile(); setModalEditing(false); setShowProfileEditor(false); }}>Save</button>
                      </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Add Job Modal */}
      {showAddForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Add New Job</h3>
              <button className="btn-close" onClick={handleCancel}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="currentColor"/>
                </svg>
              </button>
            </div>
            <form onSubmit={handleSaveJob} className="job-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Job Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={jobForm.title}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., Senior Frontend Developer"
                  />
                </div>
                <div className="form-group">
                  <label>Department *</label>
                  <input
                    type="text"
                    name="department"
                    value={jobForm.department}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., Engineering"
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Location *</label>
                  <input
                    type="text"
                    name="location"
                    value={jobForm.location}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., Remote, New York, NY"
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
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Salary Range</label>
                  <input
                    type="text"
                    name="salary"
                    value={jobForm.salary}
                    onChange={handleInputChange}
                    placeholder="e.g., ₹90,000 - ₹120,000"
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

              <div className="form-row">
                <div className="form-group">
                  <label>Status *</label>
                  <select
                    name="status"
                    value={jobForm.status}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>

              <div className="form-group full-width">
                <label>Job Description</label>
                <textarea
                  name="description"
                  value={jobForm.description}
                  onChange={handleInputChange}
                  rows="4"
                  placeholder="Describe the job responsibilities, requirements, and benefits..."
                />
              </div>

              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={handleCancel}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Create Job
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <AssistantChat userType="recruiter" />
    </div>
  );
};

export default JobDashboard;    