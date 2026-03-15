import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, MapPin, Briefcase, DollarSign, Heart, Share2, Square, Moon, X, ChevronDown, User, Save, Calendar, CheckCircle, ArrowLeft, Filter, ChevronUp
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import Navbar from './components/Navbar';
import AssistantPopup from '../components/AssistantPopup';
import { formatTimeAgo } from '../utils/timeAgo';
import { applyToJob, fetchJobs, fetchMyApplications } from '../services/api';
import './JobPortal.css';

const MULTI_SELECT_FIELDS = [
  'locations',
  'employmentType',
  'seniorityLevel',
  'salaryRange',
  'departments',
  'workModes',
  'experiences',
  'companyTypes',
  'roleCategories',
  'stipendRanges',
  'durations',
  'educationLevels',
  'industries'
];

const createInitialSearchQuery = () => ({
  keywords: '',
  experience: '',
  locations: [],
  freshness: '',
  employmentType: [],
  seniorityLevel: [],
  salaryRange: [],
  departments: [],
  workModes: [],
  experiences: [],
  companyTypes: [],
  roleCategories: [],
  stipendRanges: [],
  durations: [],
  educationLevels: [],
  industries: []
});

const JobPortal = () => {
  const { isDarkMode } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isDetailPage, setIsDetailPage] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showSearchPopup, setShowSearchPopup] = useState(false);
  const [savedJobs, setSavedJobs] = useState(new Set());
  const [appliedJobs, setAppliedJobs] = useState(new Set());
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [locationSearch, setLocationSearch] = useState('');
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [activeFilters, setActiveFilters] = useState({});
  const [apiJobs, setApiJobs] = useState([]);

  const [searchQuery, setSearchQuery] = useState(createInitialSearchQuery);
  const [appliedFilters, setAppliedFilters] = useState(createInitialSearchQuery);
  const [expModal, setExpModal] = useState({ open: false, title: '', message: '' });

  const [assistantOpen, setAssistantOpen] = useState(false);
  const [assistantJob, setAssistantJob] = useState(null);

  const [sortBy, setSortBy] = useState('newest');
  const [jobAlertForm, setJobAlertForm] = useState({ keyword: '', email: '', frequency: 'Daily' });
  const [jobAlertStatus, setJobAlertStatus] = useState({ message: '', type: '' });
  const [isSubmittingAlert, setIsSubmittingAlert] = useState(false);
  const alertFrequencies = ['Daily', 'Weekly', 'Monthly'];

  const wrapperRef = useRef(null);
  const sortRef = useRef(null);
  const locationSearchRef = useRef(null);

  useEffect(() => {
    const loadJobs = async () => {
      try {
        const data = await fetchJobs();
        setApiJobs(data.jobs || []);
      } catch (error) {
        console.error('Failed to load jobs:', error);
      }
    };

    loadJobs();
  }, []);

  useEffect(() => {
    const loadApplications = async () => {
      if (!user || user.role !== 'Student') {
        setAppliedJobs(new Set());
        return;
      }

      try {
        const data = await fetchMyApplications();
        setAppliedJobs(new Set((data.applications || []).map((application) => application.jobId)));
      } catch (error) {
        console.error('Failed to load applications:', error);
      }
    };

    loadApplications();
  }, [user]);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    
    const handleClickOutside = (event) => {
      if (sortRef.current && !sortRef.current.contains(event.target)) {
        setShowSortOptions(false);
      }
      if (locationSearchRef.current && !locationSearchRef.current.contains(event.target)) {
        setShowLocationSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Update active filters when appliedFilters changes
  useEffect(() => {
    const filters = {};

    MULTI_SELECT_FIELDS.forEach((field) => {
      if (appliedFilters[field]?.length) {
        filters[field] = appliedFilters[field];
      }
    });

    ['experience', 'freshness'].forEach((field) => {
      if (appliedFilters[field]) {
        filters[field] = appliedFilters[field];
      }
    });
    
    setActiveFilters(filters);
  }, [appliedFilters]);

  const handleJobCardClick = (job, event) => {
    const logo = event.currentTarget.querySelector(".job-card-logo");
    const bg = logo.style.backgroundColor;
    
    setSelectedJob({
      ...job,
      backgroundColor: bg,
      logo: logo.outerHTML
    });
    setIsDetailPage(true);
    if (wrapperRef.current) {
      wrapperRef.current.scrollTop = 0;
    }
  };

  const handleBackClick = () => {
    setIsDetailPage(false);
    setSelectedJob(null);
  };

  const handleLogoClick = () => {
    setIsDetailPage(false);
    setSelectedJob(null);
    if (wrapperRef.current) {
      wrapperRef.current.scrollTop = 0;
    }
  };

  const handleSearchClick = () => {
    setShowSearchPopup(true);
  };

  const handleSearchSubmit = () => {
    setShowSearchPopup(false);
    setAppliedFilters(searchQuery);
  };

  const toggleSaveJob = (jobId, event) => {
    event.stopPropagation();
    setSavedJobs(prev => {
      const newSaved = new Set(prev);
      if (newSaved.has(jobId)) {
        newSaved.delete(jobId);
      } else {
        newSaved.add(jobId);
      }
      return newSaved;
    });
  };

  const handleApplyJob = (jobId, event) => {
    event.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }
    // Find the job data
    const job = jobCards.find(j => j.id === jobId);
    // If job has an experience requirement and user exists, check eligibility
    if (job && job.experience) {
      const userYears = getUserTotalExperienceYears();
      const { min, max } = parseExperienceRange(job.experience);
      // If userYears cannot be determined, allow apply (or you can block)
      if (typeof userYears === 'number') {
        // If user's years not within required range, show popup and do not apply
        if (userYears < min || (max !== null && userYears > max) || userYears < 0) {
          setExpModal({
            open: true,
            title: 'Experience Not Matched',
            message: 'You are not eligible — Experience requirement not met'
          });
          return;
        }
      }
    }
    // Open assistant sidebar to collect additional application info
    setAssistantJob(job);
    setAssistantOpen(true);
  };

  const handleAssistantSubmit = async (jobId, responses, meta) => {
    // Only mark as applied and navigate if eligibility passed
    if (meta && meta.eligible === true) {
      try {
        await applyToJob(jobId, {
          candidateNote: responses.notes || '',
          responses
        });
        setAppliedJobs(prev => {
          const newApplied = new Set(prev);
          newApplied.add(jobId);
          return newApplied;
        });
        const job = jobCards.find(j => j.id === jobId);
        if (job) {
          setSelectedJob({ ...job });
          setIsDetailPage(true);
          if (wrapperRef.current) wrapperRef.current.scrollTop = 0;
        }
      } catch (error) {
        setExpModal({
          open: true,
          title: 'Application failed',
          message: error?.response?.data?.error || 'Unable to submit your application right now.'
        });
      }
    } else {
      // show rejection modal with reason
      setExpModal({ open: true, title: 'Not eligible', message: (meta && meta.reason) ? `You are not eligible — ${meta.reason}` : 'You are not eligible for this job' });
    }
    setAssistantOpen(false);
    setAssistantJob(null);
  };

  const handleAssistantClose = () => {
    setAssistantOpen(false);
    setAssistantJob(null);
  };

  // Helpers: parse job experience like "3-5 years" or "5 years"
  const parseExperienceRange = (expStr) => {
    if (!expStr) return { min: 0, max: null };
    const nums = expStr.match(/\d+/g);
    if (!nums || nums.length === 0) return { min: 0, max: null };
    const min = parseInt(nums[0], 10);
    const max = nums.length > 1 ? parseInt(nums[1], 10) : null;
    return { min, max };
  };

  // Compute user's total experience in years from AuthContext profile
  const getUserTotalExperienceYears = () => {
    if (!user || !user.experience || !Array.isArray(user.experience)) return null;
    const now = new Date();
    let total = 0;
    user.experience.forEach((exp) => {
      const dur = exp.duration || '';
      // Try to find full year ranges like "2020 - 2022" or "2022 - Present"
      const years = dur.match(/(\d{4})/g);
      if (years && years.length > 0) {
        const start = parseInt(years[0], 10);
        const end = years.length > 1 ? parseInt(years[1], 10) : now.getFullYear();
        if (!isNaN(start) && !isNaN(end)) {
          total += Math.max(0, end - start);
          return;
        }
      }
      // Fallback: match patterns like "3 years" or "3 yrs"
      const num = dur.match(/(\d+)\s*(?:years|year|yrs|yr)?/i);
      if (num && num[1]) {
        total += parseInt(num[1], 10);
        return;
      }
    });
    return Math.floor(total);
  };

  const closeExpModal = () => setExpModal({ open: false, title: '', message: '' });

  const handleSortSelect = (sortType) => {
    setSortBy(sortType);
    setShowSortOptions(false);
    // Implement sorting logic here
  };

  const handleLocationSelect = (location) => {
    if (!searchQuery.locations.includes(location)) {
      setSearchQuery(prev => ({
        ...prev,
        locations: [...prev.locations, location]
      }));
    }
    setLocationSearch('');
    setShowLocationSuggestions(false);
  };

  const removeLocation = (locationToRemove) => {
    setSearchQuery(prev => ({
      ...prev,
      locations: prev.locations.filter(loc => loc !== locationToRemove)
    }));
  };

  // Prefill filters from query params and apply immediately
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (![...params.keys()].length) return;

    const nextFilters = createInitialSearchQuery();

    const setArrayParam = (key) => {
      const value = params.get(key);
      if (value) {
        nextFilters[key] = value.split(',').map((v) => v.trim()).filter(Boolean);
      }
    };

    if (params.get('keywords')) nextFilters.keywords = params.get('keywords');
    if (params.get('experience')) nextFilters.experience = params.get('experience');
    setArrayParam('locations');
    setArrayParam('employmentType');

    setSearchQuery(nextFilters);
    setAppliedFilters(nextFilters);
    setShowSearchPopup(false);
    setIsDetailPage(false);
    setSelectedJob(null);
    if (wrapperRef.current) {
      wrapperRef.current.scrollTop = 0;
    }
  }, [location.search]);

  const handleJobAlertSubmit = (event) => {
    event.preventDefault();
    setJobAlertStatus({ message: '', type: '' });

    const keyword = jobAlertForm.keyword.trim();
    const email = jobAlertForm.email.trim();
    const emailOk = /[^\s@]+@[^\s@]+\.[^\s@]+/.test(email);

    if (!keyword || !emailOk) {
      setJobAlertStatus({ message: 'Add a role keyword and a valid email to create alerts.', type: 'error' });
      return;
    }

    setIsSubmittingAlert(true);
    setTimeout(() => {
      setIsSubmittingAlert(false);
      setJobAlertStatus({ message: `You will get ${jobAlertForm.frequency.toLowerCase()} alerts for ${keyword}.`, type: 'success' });
    }, 600);
  };

  const toggleMultiSelect = (field, value) => {
    setSearchQuery(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const toggleSingleSelect = (field, value) => {
    setSearchQuery(prev => ({
      ...prev,
      [field]: prev[field] === value ? '' : value
    }));
  };

  const handleEmploymentTypeToggle = (type) => toggleMultiSelect('employmentType', type);

  const handleSeniorityLevelToggle = (level) => toggleMultiSelect('seniorityLevel', level);

  const handleSalaryRangeToggle = (range) => toggleMultiSelect('salaryRange', range);

  const clearAllFilters = () => {
    const initial = createInitialSearchQuery();
    setSearchQuery(initial);
    setAppliedFilters(initial);
    setLocationSearch('');
  };

  const removeFilter = (filterType, value = null) => {
    const updateFilterSet = (prev) => {
      if (value !== null && MULTI_SELECT_FIELDS.includes(filterType)) {
        return {
          ...prev,
          [filterType]: prev[filterType].filter(item => item !== value)
        };
      }
      const resetValue = MULTI_SELECT_FIELDS.includes(filterType) ? [] : '';
      return {
        ...prev,
        [filterType]: resetValue
      };
    };

    setSearchQuery(prev => updateFilterSet(prev));
    setAppliedFilters(prev => updateFilterSet(prev));
  };

  const applyFilters = () => {
    setAppliedFilters(searchQuery);
    setShowSidebar(false);
  };

  const convertToINR = (usd) => {
    const exchangeRate = 83;
    return Math.round(usd * exchangeRate);
  };

  const experienceOptions = [
    'Fresher',
    '1-2 years',
    '3-5 years',
    '6-10 years',
    '11-15 years',
    '16-20 years',
    '21-25 years',
    '26-30 years',
    '31-35 years'
  ];

  const freshnessOptions = [
    'Any time',
    'Last 24 hours',
    'Last 3 days',
    'Last 7 days',
    'Last 15 days',
    'Last 30 days'
  ];

  const departmentOptions = [
    { id: 'engineering', label: 'Engineering', count: 142 },
    { id: 'product', label: 'Product', count: 96 },
    { id: 'design', label: 'Design', count: 58 },
    { id: 'marketing', label: 'Marketing', count: 73 },
    { id: 'operations', label: 'Operations', count: 65 }
  ];

  const workModeOptions = [
    { id: 'onsite', label: 'On-site', count: 120 },
    { id: 'hybrid', label: 'Hybrid', count: 64 },
    { id: 'remote', label: 'Remote', count: 48 }
  ];

  const experienceFilterOptions = [
    { id: '0-1', label: '0-1 Year', count: 32 },
    { id: '1-3', label: '1-3 Years', count: 54 },
    { id: '3-5', label: '3-5 Years', count: 41 },
    { id: '5-8', label: '5-8 Years', count: 28 },
    { id: '8-12', label: '8-12 Years', count: 15 },
    { id: '12+', label: '12+ Years', count: 9 }
  ];

  const employmentTypes = [
    { id: 'fulltime', label: 'Full Time Jobs', count: 56 },
    { id: 'parttime', label: 'Part Time Jobs', count: 43 },
    { id: 'remote', label: 'Remote Jobs', count: 24 },
    { id: 'internship', label: 'Internship Jobs', count: 27 }
  ];

  const seniorityLevels = [
    { id: 'student', label: 'Student Level', count: 98 },
    { id: 'entry', label: 'Entry Level', count: 44 },
    { id: 'mid', label: 'Mid Level', count: 35 },
    { id: 'senior', label: 'Senior Level', count: 29 }
  ];

  const salaryRanges = [
    { id: '50-80', label: '₹50K - ₹80K', count: 49 },
    { id: '80-100', label: '₹80K - ₹1L', count: 67 },
    { id: '100-150', label: '₹1L - ₹1.5L', count: 24 },
    { id: '150-200', label: '₹1.5L - ₹2L', count: 27 },
    { id: '200-300', label: '₹2L - ₹3L', count: 76 }
  ];

  const companyTypes = [
    { id: 'startup', label: 'Startup', count: 102 },
    { id: 'mnc', label: 'MNC', count: 88 },
    { id: 'government', label: 'Government', count: 18 },
    { id: 'agency', label: 'Agency / Consultancy', count: 34 },
    { id: 'nonprofit', label: 'Non-profit', count: 12 }
  ];

  const roleCategories = [
    { id: 'product', label: 'Product Management', count: 45 },
    { id: 'design', label: 'UI / UX & Design', count: 52 },
    { id: 'development', label: 'Software Development', count: 112 },
    { id: 'data', label: 'Data & Analytics', count: 38 },
    { id: 'sales', label: 'Sales & Business Development', count: 40 },
    { id: 'support', label: 'Customer Success', count: 26 }
  ];

  const stipendRanges = [
    { id: '0-5', label: '₹0 - ₹5K', count: 14 },
    { id: '5-10', label: '₹5K - ₹10K', count: 21 },
    { id: '10-20', label: '₹10K - ₹20K', count: 19 },
    { id: '20+', label: '₹20K+', count: 12 }
  ];

  const durationOptions = [
    { id: '0-3m', label: '0-3 Months', count: 18 },
    { id: '3-6m', label: '3-6 Months', count: 27 },
    { id: '6-12m', label: '6-12 Months', count: 22 },
    { id: '12m+', label: '12+ Months', count: 15 }
  ];

  const educationOptions = [
    { id: 'hsc', label: '12th Pass', count: 12 },
    { id: 'diploma', label: 'Diploma', count: 20 },
    { id: 'bachelors', label: "Bachelor's", count: 96 },
    { id: 'masters', label: "Master's", count: 54 },
    { id: 'phd', label: 'PhD', count: 11 }
  ];

  const industryOptions = [
    { id: 'it', label: 'IT & Services', count: 112 },
    { id: 'fintech', label: 'FinTech', count: 38 },
    { id: 'edtech', label: 'EdTech', count: 24 },
    { id: 'health', label: 'Healthcare', count: 31 },
    { id: 'ecomm', label: 'E-commerce', count: 46 },
    { id: 'manufacturing', label: 'Manufacturing', count: 29 }
  ];

  const indianLocations = [
    'Bangalore, Karnataka',
    'Hyderabad, Telangana',
    'Pune, Maharashtra',
    'Gurgaon, Haryana',
    'Chennai, Tamil Nadu',
    'Mumbai, Maharashtra',
    'Delhi, Delhi',
    'Noida, Uttar Pradesh',
    'Kolkata, West Bengal',
    'Ahmedabad, Gujarat',
    'Jaipur, Rajasthan',
    'Lucknow, Uttar Pradesh'
  ];

  const filteredLocations = indianLocations.filter(location =>
    location.toLowerCase().includes(locationSearch.toLowerCase())
  );

  const sortOptions = [
    { id: 'newest', label: 'Newest Post' },
    { id: 'oldest', label: 'Oldest Post' },
    { id: 'relevant', label: 'Most Relevant' },
    { id: 'salary_high', label: 'Salary: High to Low' },
    { id: 'salary_low', label: 'Salary: Low to High' },
    { id: 'title_az', label: 'Title: A to Z' },
    { id: 'title_za', label: 'Title: Z to A' }
  ];

  const filterChipConfig = [
    { key: 'departments', isArray: true },
    { key: 'workModes', isArray: true },
    { key: 'experiences', isArray: true },
    { key: 'locations', isArray: true, icon: <MapPin size={14} /> },
    { key: 'salaryRange', isArray: true },
    { key: 'companyTypes', isArray: true },
    { key: 'roleCategories', isArray: true },
    { key: 'stipendRanges', isArray: true },
    { key: 'durations', isArray: true },
    { key: 'educationLevels', isArray: true },
    { key: 'industries', isArray: true },
    { key: 'freshness', isArray: false, labelPrefix: 'Freshness: ' },
    { key: 'employmentType', isArray: true },
    { key: 'seniorityLevel', isArray: true },
    { key: 'experience', isArray: false, labelPrefix: 'Experience: ' }
  ];

  const getDaysAgo = (dateString) => {
    const posted = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(today - posted);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const fallbackJobCards = [
    {
      id: 1,
      title: "UI / UX Designer",
      subtitle: "The User Experience Designer position .",
      salary: convertToINR(3000),
      location: "Bangalore, Karnataka",
      postedDate: "2024-01-15",
      experience: "3-5 years",
      type: "Full Time"
    },
    {
      id: 2,
      title: "Sr. Product Designer",
      subtitle: "HITEC City, Hyderabad",
      salary: convertToINR(4000),
      location: "Hyderabad, Telangana",
      postedDate: "2024-01-14",
      experience: "5-8 years",
      type: "Full Time"
    },
    {
      id: 3,
      title: "Frontend Engineer (React)",
      subtitle: "Koramangala, Bangalore",
      salary: convertToINR(3600),
      location: "Bangalore, Karnataka",
      postedDate: "2024-01-12",
      experience: "2-4 years",
      type: "Hybrid"
    },
    {
      id: 4,
      title: "Backend Engineer (Node.js)",
      subtitle: "Baner, Pune",
      salary: convertToINR(4200),
      location: "Pune, Maharashtra",
      postedDate: "2024-01-10",
      experience: "3-6 years",
      type: "Remote"
    },
    {
      id: 5,
      title: "Data Analyst",
      subtitle: "Gachibowli, Hyderabad",
      salary: convertToINR(3100),
      location: "Hyderabad, Telangana",
      postedDate: "2024-01-09",
      experience: "1-3 years",
      type: "Full Time"
    },
    {
      id: 6,
      title: "Product Manager",
      subtitle: "Sector 18, Noida",
      salary: convertToINR(5200),
      location: "Noida, Uttar Pradesh",
      postedDate: "2024-01-08",
      experience: "6-9 years",
      type: "Hybrid"
    },
    {
      id: 7,
      title: "DevOps Engineer",
      subtitle: "Hinjewadi, Pune",
      salary: convertToINR(4500),
      location: "Pune, Maharashtra",
      postedDate: "2024-01-07",
      experience: "4-7 years",
      type: "Full Time"
    },
    {
      id: 8,
      title: "QA Automation Engineer",
      subtitle: "Velachery, Chennai",
      salary: convertToINR(3000),
      location: "Chennai, Tamil Nadu",
      postedDate: "2024-01-06",
      experience: "2-5 years",
      type: "On-site"
    },
    {
      id: 9,
      title: "Marketing Specialist",
      subtitle: "Andheri East, Mumbai",
      salary: convertToINR(2800),
      location: "Mumbai, Maharashtra",
      postedDate: "2024-01-05",
      experience: "2-4 years",
      type: "Hybrid"
    },
    {
      id: 10,
      title: "Customer Success Manager",
      subtitle: "Golf Course Road, Gurgaon",
      salary: convertToINR(3200),
      location: "Gurgaon, Haryana",
      postedDate: "2024-01-04",
      experience: "3-6 years",
      type: "Full Time"
    }
    ,
    {
      id: 11,
      title: "React Native Developer",
      subtitle: "Pan-India, Remote",
      salary: convertToINR(3800),
      location: "Remote",
      postedDate: "2024-01-03",
      experience: "3-6 years",
      type: "Remote"
    },
    {
      id: 12,
      title: "Technical Writer (SaaS)",
      subtitle: "Fully Remote",
      salary: convertToINR(2600),
      location: "Remote",
      postedDate: "2024-01-02",
      experience: "2-4 years",
      type: "Remote"
    },
    {
      id: 13,
      title: "Data Engineer",
      subtitle: "Cloud-first data platform",
      salary: convertToINR(5000),
      location: "Remote",
      postedDate: "2024-01-01",
      experience: "4-7 years",
      type: "Remote"
    }
    ,
    // Part Time jobs
    {
      id: 14,
      title: "Content Editor",
      subtitle: "Evening shift, flexible hours",
      salary: convertToINR(1800),
      location: "Delhi, Delhi",
      postedDate: "2024-01-03",
      experience: "1-3 years",
      type: "Part Time"
    },
    {
      id: 15,
      title: "Support Associate",
      subtitle: "Weekend coverage (Sat-Sun)",
      salary: convertToINR(1600),
      location: "Ahmedabad, Gujarat",
      postedDate: "2024-01-04",
      experience: "0-2 years",
      type: "Part Time"
    },
    // Fresher jobs
    {
      id: 16,
      title: "Junior QA Tester",
      subtitle: "Entry-level opportunity",
      salary: convertToINR(2200),
      location: "Noida, Uttar Pradesh",
      postedDate: "2024-01-05",
      experience: "Fresher",
      type: "Full Time"
    },
    {
      id: 17,
      title: "Graduate Trainee Engineer",
      subtitle: "Campus hire batch",
      salary: convertToINR(2400),
      location: "Chennai, Tamil Nadu",
      postedDate: "2024-01-06",
      experience: "Fresher",
      type: "Internship"
    },
    // Jobs for Women (keyword match)
    {
      id: 18,
      title: "Women Returnship - QA Analyst",
      subtitle: "Women-focused program",
      salary: convertToINR(2800),
      location: "Pune, Maharashtra",
      postedDate: "2024-01-07",
      experience: "1-3 years",
      type: "Full Time"
    },
    {
      id: 19,
      title: "Women Leadership Fellowship",
      subtitle: "Women mentorship initiative",
      salary: convertToINR(3000),
      location: "Bangalore, Karnataka",
      postedDate: "2024-01-08",
      experience: "3-5 years",
      type: "Full Time"
    },
    // Night Shift jobs (keyword match)
    {
      id: 20,
      title: "IT Helpdesk - Night Shift",
      subtitle: "Night Shift support role",
      salary: convertToINR(2600),
      location: "Hyderabad, Telangana",
      postedDate: "2024-01-09",
      experience: "1-3 years",
      type: "Full Time"
    },
    {
      id: 21,
      title: "Customer Support - Night Shift",
      subtitle: "Night Shift BPO",
      salary: convertToINR(2000),
      location: "Gurgaon, Haryana",
      postedDate: "2024-01-10",
      experience: "0-2 years",
      type: "Part Time"
    },
    // More Full Time jobs
    {
      id: 22,
      title: "Backend Developer (.NET)",
      subtitle: "Enterprise applications",
      salary: convertToINR(4200),
      location: "Mumbai, Maharashtra",
      postedDate: "2024-01-11",
      experience: "3-5 years",
      type: "Full Time"
    },
    {
      id: 23,
      title: "UI Engineer",
      subtitle: "Design system implementation",
      salary: convertToINR(3800),
      location: "Kolkata, West Bengal",
      postedDate: "2024-01-12",
      experience: "2-4 years",
      type: "Full Time"
    }
  ];

  const jobCards = apiJobs.length ? apiJobs : fallbackJobCards;

  const jobOverviewCards = jobCards.slice(0, 6);

  const freshnessDaysMap = {
    'Last 24 hours': 1,
    'Last 3 days': 3,
    'Last 7 days': 7,
    'Last 15 days': 15,
    'Last 30 days': 30,
    'Any time': null
  };

  const filteredJobs = jobCards.filter((job) => {
    const matchesKeywords = !appliedFilters.keywords ||
      job.title.toLowerCase().includes(appliedFilters.keywords.toLowerCase()) ||
      (job.subtitle || '').toLowerCase().includes(appliedFilters.keywords.toLowerCase());

    const matchesLocation = appliedFilters.locations.length === 0 ||
      appliedFilters.locations.some(loc => (job.location || '').toLowerCase().includes(loc.toLowerCase()));

    const matchesExperience = !appliedFilters.experience ||
      (job.experience || '').toLowerCase().includes(appliedFilters.experience.toLowerCase());

    const matchesEmployment = appliedFilters.employmentType.length === 0 ||
      appliedFilters.employmentType.some(type => (job.type || '').toLowerCase().includes(type.toLowerCase().replace(' jobs', '')));

    // Apply Work Mode filter: match selected modes to job.type (Remote/Hybrid/On-site)
    const matchesWorkMode = appliedFilters.workModes.length === 0 ||
      appliedFilters.workModes.some(mode => (job.type || '').toLowerCase() === mode.toLowerCase());

    const freshnessLimit = freshnessDaysMap[appliedFilters.freshness];
    const matchesFreshness = !freshnessLimit || getDaysAgo(job.postedDate) <= freshnessLimit;

    return matchesKeywords && matchesLocation && matchesExperience && matchesEmployment && matchesWorkMode && matchesFreshness;
  });

  // Compute simple relevance score for keyword/location matches
  const getRelevanceScore = useCallback((job) => {
    let score = 0;
    const keyword = (appliedFilters.keywords || '').trim().toLowerCase();
    if (keyword) {
      const title = (job.title || '').toLowerCase();
      const subtitle = (job.subtitle || '').toLowerCase();
      if (title.includes(keyword)) score += 3;
      if (subtitle.includes(keyword)) score += 2;
    }
    if (appliedFilters.locations?.length) {
      const jobLoc = (job.location || '').toLowerCase();
      if (appliedFilters.locations.some(loc => jobLoc.includes(loc.toLowerCase()))) {
        score += 1;
      }
    }
    return score;
  }, [appliedFilters.keywords, appliedFilters.locations]);

  // Sort jobs according to selected sort option
  
  const sortedJobs = React.useMemo(() => {
    const jobs = [...filteredJobs];
    switch (sortBy) {
      case 'newest':
        return jobs.sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate));
      case 'oldest':
        return jobs.sort((a, b) => new Date(a.postedDate) - new Date(b.postedDate));
      case 'salary_high':
        return jobs.sort((a, b) => (b.salaryValue || b.salary || 0) - (a.salaryValue || a.salary || 0));
      case 'salary_low':
        return jobs.sort((a, b) => (a.salaryValue || a.salary || 0) - (b.salaryValue || b.salary || 0));
      case 'relevant':
        return jobs.sort((a, b) => getRelevanceScore(b) - getRelevanceScore(a));
      case 'title_az':
        return jobs.sort((a, b) => (a.title || '').localeCompare((b.title || '')));
      case 'title_za':
        return jobs.sort((a, b) => (b.title || '').localeCompare((a.title || '')));
      default:
        return jobs;
    }
  }, [filteredJobs, sortBy, getRelevanceScore]);

  return (
    <>
      <Navbar />
      <div className={`container-j ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className={`wrapper ${isDetailPage ? 'detail-page' : ''}`} ref={wrapperRef}>
        {/* Mobile Back Button */}
        {isDetailPage && (
          <button className="mobile-back-button" onClick={handleBackClick}>
            <ArrowLeft size={18} />
            Back to Jobs
          </button>
        )}

        {/* Assistant apply sidebar */}
        {assistantOpen && assistantJob && (
          <AssistantPopup
            visible={assistantOpen}
            job={assistantJob}
            onClose={handleAssistantClose}
            onSubmit={handleAssistantSubmit}
          />
        )}

        {/* Sticky Filters Header */}
        {!isDetailPage && Object.keys(activeFilters).some(key => 
          Array.isArray(activeFilters[key]) ? activeFilters[key].length > 0 : activeFilters[key]
        ) && (
          <div className="sticky-filters-header">
            <div className="filters-container">
              {filterChipConfig.flatMap((config) => {
                const value = activeFilters[config.key];

                if (config.isArray) {
                  return (value || []).map(item => (
                    <div key={`${config.key}-${item}`} className="filter-chip">
                      {config.icon}
                      {item}
                      <button 
                        className="filter-chip-remove"
                        onClick={() => removeFilter(config.key, item)}
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ));
                }

                if (!value) return [];

                return (
                  <div key={config.key} className="filter-chip">
                    {config.icon}
                    {config.labelPrefix || ''}{value}
                    <button 
                      className="filter-chip-remove"
                      onClick={() => removeFilter(config.key)}
                    >
                      <X size={12} />
                    </button>
                  </div>
                );
              })}
              <button className="clear-filters" onClick={clearAllFilters}>
                Clear All
              </button>
            </div>
          </div>
        )}

        {/* Experience mismatch modal */}
        {expModal.open && (
          <div className="exp-modal-overlay" onClick={closeExpModal}>
            <div className="exp-modal" onClick={(e) => e.stopPropagation()}>
              <div className="exp-modal-header">
                <div className="exp-modal-title">
                  <svg className="exp-warning-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M1 21h22L12 2 1 21z" fill="currentColor" />
                    <path d="M13 16h-2v2h2v-2zm0-6h-2v5h2V10z" fill="#fff"/>
                  </svg>
                  <h3>{expModal.title}</h3>
                </div>
                <button className="exp-modal-close" onClick={closeExpModal} aria-label="Close">×</button>
              </div>
              <div className="exp-modal-body">
                <p>{expModal.message}</p>
              </div>
              <div className="exp-modal-actions">
                <button className="btn-primary" onClick={closeExpModal}>OK</button>
              </div>
            </div>
          </div>
        )}

        {/* Top Sort Bar */}
        {!isDetailPage && (
          <div className="top-sort-bar">
            <div className="sort-dropdown" ref={sortRef}>
              <button 
                className="sort-button"
                onClick={() => setShowSortOptions(!showSortOptions)}
              >
                Sort by: <span className="post-time">
                  {sortOptions.find(opt => opt.id === sortBy)?.label}
                </span>
                <ChevronDown size={14} />
              </button>
              {showSortOptions && (
                <div className="sort-options">
                  {sortOptions.map(option => (
                    <div
                      key={option.id}
                      className={`sort-option ${sortBy === option.id ? 'active' : ''}`}
                      onClick={() => handleSortSelect(option.id)}
                    >
                      {option.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Centered Search Bar */}
        {!isDetailPage && (
          <div className="search-center-container">
            <div className="search-center-bar" onClick={handleSearchClick}>
              <Search size={20} />
              <span>Search for jobs, skills, companies...</span>
            </div>
          </div>
        )}

        {/* Mobile Sidebar Toggle */}
        {!isDetailPage && (
          <button className="sidebar-toggle" onClick={() => setShowSidebar(true)}>
            <Filter size={18} />
            Show Filters
          </button>
        )}

        {/* Search Popup */}
        {showSearchPopup && (
          <div className="search-popup-overlay">
            <div className="search-popup">
              <div className="popup-header">
                <h3>Find Your Dream Job</h3>
                <button 
                  className="popup-close"
                  onClick={() => setShowSearchPopup(false)}
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="popup-content">
                <div className="search-field">
                  <label>Keywords / Designation</label>
                  <input 
                    type="text" 
                    placeholder="e.g. UI Designer, React Developer"
                    value={searchQuery.keywords}
                    onChange={(e) => setSearchQuery({...searchQuery, keywords: e.target.value})}
                  />
                </div>
                
                <div className="search-field">
                  <label>Experience</label>
                  <select 
                    value={searchQuery.experience}
                    onChange={(e) => setSearchQuery({...searchQuery, experience: e.target.value})}
                  >
                    <option value="">Select Experience</option>
                    {experienceOptions.map((exp, index) => (
                      <option key={index} value={exp}>{exp}</option>
                    ))}
                  </select>
                </div>

                <div className="search-field">
                  <label>Freshness</label>
                  <select 
                    value={searchQuery.freshness}
                    onChange={(e) => setSearchQuery({...searchQuery, freshness: e.target.value})}
                  >
                    <option value="">Select Freshness</option>
                    {freshnessOptions.map((option, index) => (
                      <option key={index} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
                
                <div className="search-field">
                  <label>Locations (Select multiple)</label>
                  <div className="locations-grid">
                    {indianLocations.map((location, index) => (
                      <div 
                        key={index}
                        className={`location-chip ${searchQuery.locations.includes(location) ? 'selected' : ''}`}
                        onClick={() => handleLocationSelect(location)}
                      >
                        {location}
                        {searchQuery.locations.includes(location) && <CheckCircle size={14} />}
                      </div>
                    ))}
                  </div>
                  {searchQuery.locations.length > 0 && (
                    <div className="selected-locations">
                      Selected: {searchQuery.locations.join(', ')}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="popup-footer">
                <button
                  className="find-button"
                  type="button"
                  onClick={handleSearchSubmit}
                >
                  Find
                </button>
                <button 
                  className="search-button popup-search-btn"
                  onClick={handleSearchSubmit}
                >
                  <Search size={16} />
                  Search Jobs
                </button>
              </div>
            </div>
          </div>
        )}
        
        <div className="main-container">
          {/* Filters Sidebar */}
          <div className={`search-type ${showSidebar ? 'mobile-open' : ''}`}>
            {showSidebar && (
              <button className="close-sidebar" onClick={() => setShowSidebar(false)}>
                <X size={24} />
              </button>
            )}
            
            <div className="alert">
              <div className="alert-title">Create Job Alert</div>
              <div className="alert-subtitle">Create a job alert now and never miss a job</div>
              <form className="alert-form" onSubmit={handleJobAlertSubmit}>
                <div className="alert-field">
                  <label>Role or skill</label>
                  <input
                    type="text"
                    placeholder="e.g. React Developer"
                    value={jobAlertForm.keyword}
                    onChange={(e) => setJobAlertForm((prev) => ({ ...prev, keyword: e.target.value }))}
                  />
                </div>
                <div className="alert-field">
                  <label>Email</label>
                  <input
                    type="email"
                    placeholder="name@email.com"
                    value={jobAlertForm.email}
                    onChange={(e) => setJobAlertForm((prev) => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div className="alert-inline">
                  <label>Frequency</label>
                  <select
                    value={jobAlertForm.frequency}
                    onChange={(e) => setJobAlertForm((prev) => ({ ...prev, frequency: e.target.value }))}
                  >
                    {alertFrequencies.map((freq) => (
                      <option key={freq} value={freq}>{freq}</option>
                    ))}
                  </select>
                </div>
                {jobAlertStatus.message && (
                  <div className={`alert-status ${jobAlertStatus.type}`}>
                    {jobAlertStatus.message}
                  </div>
                )}
                <button className="search-buttons" type="submit" disabled={isSubmittingAlert}>
                  {isSubmittingAlert ? 'Saving…' : 'Create Job Alerts'}
                </button>
              </form>
            </div>
            
            <div className="job-time">
              <div className="job-time-title">Department</div>
              <div className="job-wrapper">
                {departmentOptions.map((option) => (
                  <div key={option.id} className="type-container">
                    <input 
                      type="checkbox" 
                      id={`dept-${option.id}`} 
                      className="job-style" 
                      checked={searchQuery.departments.includes(option.label)}
                      onChange={() => toggleMultiSelect('departments', option.label)}
                    />
                    <label htmlFor={`dept-${option.id}`}>{option.label}</label>
                    <span className="job-number">{option.count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="job-time">
              <div className="job-time-title">Work Mode</div>
              <div className="job-wrapper">
                {workModeOptions.map((option) => (
                  <div key={option.id} className="type-container">
                    <input 
                      type="checkbox" 
                      id={`mode-${option.id}`} 
                      className="job-style" 
                      checked={searchQuery.workModes.includes(option.label)}
                      onChange={() => toggleMultiSelect('workModes', option.label)}
                    />
                    <label htmlFor={`mode-${option.id}`}>{option.label}</label>
                    <span className="job-number">{option.count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="job-time">
              <div className="job-time-title">Type of Employment</div>
              <div className="job-wrapper">
                {employmentTypes.map((type) => (
                  <div key={type.id} className="type-container">
                    <input 
                      type="checkbox" 
                      id={type.id} 
                      className="job-style" 
                      checked={searchQuery.employmentType.includes(type.label)}
                      onChange={() => handleEmploymentTypeToggle(type.label)}
                    />
                    <label htmlFor={type.id}>{type.label}</label>
                    <span className="job-number">{type.count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="job-time">
              <div className="job-time-title">Experiences</div>
              <div className="job-wrapper">
                {experienceFilterOptions.map((option) => (
                  <div key={option.id} className="type-container">
                    <input 
                      type="checkbox" 
                      id={`exp-${option.id}`} 
                      className="job-style" 
                      checked={searchQuery.experiences.includes(option.label)}
                      onChange={() => toggleMultiSelect('experiences', option.label)}
                    />
                    <label htmlFor={`exp-${option.id}`}>{option.label}</label>
                    <span className="job-number">{option.count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="job-time">
              <div className="job-time-title">Seniority Level</div>
              <div className="job-wrapper">
                {seniorityLevels.map((level) => (
                  <div key={level.id} className="type-container">
                    <input 
                      type="checkbox" 
                      id={level.id} 
                      className="job-style" 
                      checked={searchQuery.seniorityLevel.includes(level.label)}
                      onChange={() => handleSeniorityLevelToggle(level.label)}
                    />
                    <label htmlFor={level.id}>{level.label}</label>
                    <span className="job-number">{level.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Location Search */}
            <div className="job-time">
              <div className="job-time-title">Location</div>
              <div className="location-search-container" ref={locationSearchRef}>
                <input
                  type="text"
                  className="location-search-input"
                  placeholder="Search locations..."
                  value={locationSearch}
                  onChange={(e) => setLocationSearch(e.target.value)}
                  onFocus={() => setShowLocationSuggestions(true)}
                />
                {showLocationSuggestions && locationSearch && (
                  <div className="location-suggestions">
                    {filteredLocations.map((location, index) => (
                      <div
                        key={index}
                        className="location-suggestion"
                        onClick={() => handleLocationSelect(location)}
                      >
                        {location}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {searchQuery.locations.length > 0 && (
                <div className="selected-locations-container">
                  {searchQuery.locations.map((location, index) => (
                    <div key={index} className="selected-location-tag">
                      {location}
                      <button
                        className="selected-location-remove"
                        onClick={() => removeLocation(location)}
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="job-time">
              <div className="job-time-title">Salary Range (₹ per month)</div>
              <div className="job-wrapper">
                {salaryRanges.map((range) => (
                  <div key={range.id} className="type-container">
                    <input 
                      type="checkbox" 
                      id={range.id} 
                      className="job-style" 
                      checked={searchQuery.salaryRange.includes(range.label)}
                      onChange={() => handleSalaryRangeToggle(range.label)}
                    />
                    <label htmlFor={range.id}>{range.label}</label>
                    <span className="job-number">{range.count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="job-time">
              <div className="job-time-title">Company Type</div>
              <div className="job-wrapper">
                {companyTypes.map((company) => (
                  <div key={company.id} className="type-container">
                    <input 
                      type="checkbox" 
                      id={`company-${company.id}`} 
                      className="job-style" 
                      checked={searchQuery.companyTypes.includes(company.label)}
                      onChange={() => toggleMultiSelect('companyTypes', company.label)}
                    />
                    <label htmlFor={`company-${company.id}`}>{company.label}</label>
                    <span className="job-number">{company.count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="job-time">
              <div className="job-time-title">Role Categories</div>
              <div className="job-wrapper">
                {roleCategories.map((role) => (
                  <div key={role.id} className="type-container">
                    <input 
                      type="checkbox" 
                      id={`role-${role.id}`} 
                      className="job-style" 
                      checked={searchQuery.roleCategories.includes(role.label)}
                      onChange={() => toggleMultiSelect('roleCategories', role.label)}
                    />
                    <label htmlFor={`role-${role.id}`}>{role.label}</label>
                    <span className="job-number">{role.count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="job-time">
              <div className="job-time-title">Stipend</div>
              <div className="job-wrapper">
                {stipendRanges.map((stipend) => (
                  <div key={stipend.id} className="type-container">
                    <input 
                      type="checkbox" 
                      id={`stipend-${stipend.id}`} 
                      className="job-style" 
                      checked={searchQuery.stipendRanges.includes(stipend.label)}
                      onChange={() => toggleMultiSelect('stipendRanges', stipend.label)}
                    />
                    <label htmlFor={`stipend-${stipend.id}`}>{stipend.label}</label>
                    <span className="job-number">{stipend.count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="job-time">
              <div className="job-time-title">Duration</div>
              <div className="job-wrapper">
                {durationOptions.map((duration) => (
                  <div key={duration.id} className="type-container">
                    <input 
                      type="checkbox" 
                      id={`duration-${duration.id}`} 
                      className="job-style" 
                      checked={searchQuery.durations.includes(duration.label)}
                      onChange={() => toggleMultiSelect('durations', duration.label)}
                    />
                    <label htmlFor={`duration-${duration.id}`}>{duration.label}</label>
                    <span className="job-number">{duration.count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="job-time">
              <div className="job-time-title">Education</div>
              <div className="job-wrapper">
                {educationOptions.map((education) => (
                  <div key={education.id} className="type-container">
                    <input 
                      type="checkbox" 
                      id={`education-${education.id}`} 
                      className="job-style" 
                      checked={searchQuery.educationLevels.includes(education.label)}
                      onChange={() => toggleMultiSelect('educationLevels', education.label)}
                    />
                    <label htmlFor={`education-${education.id}`}>{education.label}</label>
                    <span className="job-number">{education.count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="job-time">
              <div className="job-time-title">Industry</div>
              <div className="job-wrapper">
                {industryOptions.map((industry) => (
                  <div key={industry.id} className="type-container">
                    <input 
                      type="checkbox" 
                      id={`industry-${industry.id}`} 
                      className="job-style" 
                      checked={searchQuery.industries.includes(industry.label)}
                      onChange={() => toggleMultiSelect('industries', industry.label)}
                    />
                    <label htmlFor={`industry-${industry.id}`}>{industry.label}</label>
                    <span className="job-number">{industry.count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="job-time">
              <div className="job-time-title">Freshness</div>
              <div className="job-wrapper">
                {freshnessOptions.map((option, index) => (
                  <div key={index} className="type-container">
                    <input 
                      type="checkbox" 
                      id={`freshness-${index}`} 
                      className="job-style" 
                      checked={searchQuery.freshness === option}
                      onChange={() => toggleSingleSelect('freshness', option)}
                    />
                    <label htmlFor={`freshness-${index}`}>{option}</label>
                  </div>
                ))}
              </div>
            </div>

            <button className="apply-filters-button" onClick={applyFilters}>
              Apply Filters
            </button>
          </div>
          
          <div className="searched-jobs">
            {!isDetailPage && (
              <div className="searched-bar">
                <div className="searched-show">Showing {filteredJobs.length} Jobs</div>
              </div>
            )}
            
            {!isDetailPage ? (
              <div className="job-cards">
                {sortedJobs.map(job => (
                  <div 
                    key={job.id} 
                    className="job-card"
                    onClick={(e) => handleJobCardClick(job, e)}
                  >
                    {/* Job card content remains the same */}
                    <div className="job-card-header">
                      <div 
                        className="job-card-logo"
                        style={{ 
                          backgroundColor: ['#2e2882', '#f76754', '#55acee', '#4CAF50', '#FF9800', '#9C27B0'][job.id % 6],
                          width: '40px',
                          height: '40px',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white'
                        }}
                      >
                        <Briefcase size={20} />
                      </div>
                      <div className="job-card-actions">
                        <button 
                          className={`save-btn ${savedJobs.has(job.id) ? 'saved' : ''}`}
                          onClick={(e) => toggleSaveJob(job.id, e)}
                        >
                          <Heart size={16} fill={savedJobs.has(job.id) ? 'currentColor' : 'none'} />
                        </button>
                        <div className="menu-dot"></div>
                      </div>
                    </div>
                    <div className="job-card-title">{job.title}</div>
                    <div className="job-card-subtitle">{job.subtitle}</div>
                    <div className="job-card-location">
                      <MapPin size={14} />
                      {job.location}
                    </div>
                    <div className="job-card-salary">
                      <DollarSign size={14} />
                      ₹{job.salary.toLocaleString()}/month
                    </div>
                    <div className="job-card-posted">
                      <Calendar size={14} />
                      Posted {formatTimeAgo(job.postedDate)}
                    </div>
                    <div className="job-detail-buttons">
                      <button className="detail-button">{job.type}</button>
                    </div>
                    <div className="job-card-buttons">
                      <button 
                        className={`search-buttons card-buttons ${appliedJobs.has(job.id) ? 'applied' : ''}`}
                        onClick={(e) => handleApplyJob(job.id, e)}
                        disabled={appliedJobs.has(job.id)}
                      >
                        {appliedJobs.has(job.id) ? (
                          <>
                            <CheckCircle size={16} />
                            Applied
                          </>
                        ) : (
                          'Apply Now'
                        )}
                      </button>
                      <button 
                        className={`search-buttons card-buttons-outline ${savedJobs.has(job.id) ? 'saved' : ''}`}
                        onClick={(e) => toggleSaveJob(job.id, e)}
                      >
                        <Save size={16} />
                        {savedJobs.has(job.id) ? 'Saved' : 'Save'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Job detail view remains the same
              <div className="job-overview">
                <div className="job-overview-cards">
                  {jobOverviewCards.map(job => (
                    <div key={job.id} className="job-overview-card">
                      <div className="job-card overview-card">
                        <div className="overview-wrapper">
                          <div 
                            className="job-card-logo"
                            style={{ 
                              backgroundColor: job.id === 1 ? '#2e2882' : '#f76754',
                              width: '40px',
                              height: '40px',
                              borderRadius: '8px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'white'
                            }}
                          >
                            <Briefcase size={20} />
                          </div>
                          <div className="overview-detail">
                            <div className="job-card-title">{job.title}</div>
                            <div className="job-card-subtitle">{job.subtitle}</div>
                            <div className="job-card-salary">
                              ₹{job.salary.toLocaleString()}/month
                            </div>
                          </div>
                          <button 
                            className={`save-btn ${savedJobs.has(job.id) ? 'saved' : ''}`}
                            onClick={(e) => toggleSaveJob(job.id, e)}
                          >
                            <Heart size={20} fill={savedJobs.has(job.id) ? 'currentColor' : 'none'} />
                          </button>
                        </div>
                        <div className="job-overview-buttons">
                          <div className="search-buttons time-button">{job.type}</div>
                          <div className="job-stat">New</div>
                          <div className="job-day">{getDaysAgo(job.postedDate)}d</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {isDetailPage && selectedJob && (
                <div className="job-explain">
                  <img 
                    className="job-bg" 
                    alt="" 
                    src={`https://unsplash.it/640/425?image=${Math.floor(Math.random() * 10)}`}
                    style={{ background: selectedJob.backgroundColor }}
                  />
                  <div className="job-logos" dangerouslySetInnerHTML={{ __html: selectedJob.logo }} />
                  <div className="job-explain-content">
                    <div className="job-title-wrapper">
                      <div className="job-card-title">{selectedJob.title}</div>
                      <div className="job-action">
                        <button 
                          className={`save-btn ${savedJobs.has(selectedJob.id) ? 'saved' : ''}`}
                          onClick={(e) => toggleSaveJob(selectedJob.id, e)}
                        >
                          <Heart size={20} fill={savedJobs.has(selectedJob.id) ? 'currentColor' : 'none'} />
                        </button>
                        <Share2 size={20} />
                      </div>
                    </div>
                    <div className="job-subtitle-wrapper">
                      <div className="company-name">TechCorp India <span className="comp-location">{selectedJob.location}</span></div>
                      <div className="posted">
                        Posted {formatTimeAgo(selectedJob.postedDate)}
                        <span className="app-number">98 Applications</span>
                      </div>
                    </div>
                    <div className="job-action-buttons">
                      <button 
                        className={`apply-btn large ${appliedJobs.has(selectedJob.id) ? 'applied' : ''}`}
                        onClick={(e) => handleApplyJob(selectedJob.id, e)}
                        disabled={appliedJobs.has(selectedJob.id)}
                      >
                        {appliedJobs.has(selectedJob.id) ? (
                          <>
                            <CheckCircle size={18} />
                            Applied Successfully
                          </>
                        ) : (
                          'Apply Now'
                        )}
                      </button>
                      <button 
                        className={`save-btn large ${savedJobs.has(selectedJob.id) ? 'saved' : ''}`}
                        onClick={(e) => toggleSaveJob(selectedJob.id, e)}
                      >
                        <Save size={18} />
                        {savedJobs.has(selectedJob.id) ? 'Saved' : 'Save Job'}
                      </button>
                    </div>
                    <div className="explain-bar">
                      <div className="explain-contents">
                        <div className="explain-title">Experience</div>
                        <div className="explain-subtitle">{selectedJob.experience}</div>
                      </div>
                      <div className="explain-contents">
                        <div className="explain-title">Work Level</div>
                        <div className="explain-subtitle">Senior level</div>
                      </div>
                      <div className="explain-contents">
                        <div className="explain-title">Employee Type</div>
                        <div className="explain-subtitle">{selectedJob.type}</div>
                      </div>
                      <div className="explain-contents">
                        <div className="explain-title">Offer Salary</div>
                        <div className="explain-subtitle">₹{selectedJob.salary.toLocaleString()} / Month</div>
                      </div>
                    </div>
                    <div className="overview-text">
                      <div className="overview-text-header">Overview</div>
                      <div className="overview-text-subheader">
                        We believe that design (and you) will be critical to the company's success. You will work with our founders and our early customers to help define and build our product functionality, while maintaining the quality bar that customers have come to expect from modern SaaS applications. You have a strong background in product design with a quantitavely anf qualitatively analytical mindset. You will also have the opportunity to craft our overall product and visual identity and should be comfortable to flex into working.
                      </div>
                    </div>
                    <div className="overview-text">
                      <div className="overview-text-header">Job Description</div>
                      <div className="overview-text-item">3+ years working as a product designer.</div>
                      <div className="overview-text-item">A portfolio that highlights your approach to problem solving, as well as you skills in UI.</div>
                      <div className="overview-text-item">Experience conducting research and building out smooth flows.</div>
                      <div className="overview-text-item">Excellent communication skills with a well-defined design process.</div>
                      <div className="overview-text-item">Familiarity with design tools like Sketch and Figma</div>
                      <div className="overview-text-item">Up-level our overall design and bring consistency to end-user facing properties</div>
                    </div>
                  </div>
                </div>
              )}
              </div>
            )}
          </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default JobPortal;