import React, { useMemo, useState } from 'react';
import {
  FiTrendingUp,
  FiClock,
  FiArrowRight,
  FiDownload,
  FiUser,
  FiMail,
  FiCheckCircle,
  FiChevronDown,
} from 'react-icons/fi';
import Navbar from '../../pages/components/Navbar';
import Footer from '../../pages/components/Footer';
import './SearchAppearances.css';

const recruiterActionsTabs = ['All Actions', 'Resume downloaded', 'Invite sent', 'Profile bookmarked'];

const recruiterActions = [
  {
    name: 'Amrita',
    role: 'Jaya Singh',
    location: 'ALLAHABAD',
    type: 'Invite sent',
    time: '47 minutes ago',
  },
  {
    name: 'Shivani Soni',
    role: 'Technical Recruiter at Applycup',
    location: 'Pune',
    type: 'Invite sent',
    time: '2 days ago',
  },
  {
    name: 'Noman',
    role: 'Director at Unisys Technologies',
    location: 'PUNE',
    type: 'Resume downloaded',
    time: '3 days ago',
  },
  {
    name: 'Ritika Khanna',
    role: 'Senior Recruiter at Infosys',
    location: 'Bangalore',
    type: 'Resume downloaded',
    time: '4 days ago',
  },
  {
    name: 'Aditya Rao',
    role: 'Talent Partner at Razorpay',
    location: 'Remote',
    type: 'Profile bookmarked',
    time: '5 days ago',
  },
  {
    name: 'Megha Verma',
    role: 'Recruiter at TCS',
    location: 'Delhi NCR',
    type: 'Invite sent',
    time: '6 days ago',
  },
  {
    name: 'Gaurav Singh',
    role: 'Hiring Manager at Swiggy',
    location: 'Hyderabad',
    type: 'Profile bookmarked',
    time: '1 week ago',
  },
  {
    name: 'Priya Nair',
    role: 'Recruiter at Accenture',
    location: 'Chennai',
    type: 'Resume downloaded',
    time: '1 week ago',
  },
  {
    name: 'Rahul Deshmukh',
    role: 'HR at Zomato',
    location: 'Mumbai',
    type: 'Invite sent',
    time: '2 weeks ago',
  },
  {
    name: 'Sneha Kulkarni',
    role: 'Talent Scout at Freshworks',
    location: 'Pune',
    type: 'Profile bookmarked',
    time: '2 weeks ago',
  },
  {
    name: 'Karan Mehta',
    role: 'Lead Recruiter at Microsoft',
    location: 'Hyderabad',
    type: 'Resume downloaded',
    time: '3 weeks ago',
  },
  {
    name: 'Ananya Iyer',
    role: 'Recruiter at Atlassian',
    location: 'Bangalore',
    type: 'Invite sent',
    time: '3 weeks ago',
  },
];

const SearchAppearances = () => {
  const [activeTab, setActiveTab] = useState('All Actions');

  const normalize = (text) => text.toLowerCase().trim();

  const tabCounts = useMemo(() => {
    return recruiterActionsTabs.reduce((acc, tab) => {
      if (tab === 'All Actions') {
        acc[tab] = recruiterActions.length;
        return acc;
      }

      const matchKey = normalize(tab);
      acc[tab] = recruiterActions.filter((item) => normalize(item.type) === matchKey).length;
      return acc;
    }, {});
  }, []);

  const filteredActions = useMemo(() => {
    if (activeTab === 'All Actions') return recruiterActions;
    const matchKey = normalize(activeTab);
    return recruiterActions.filter((item) => normalize(item.type) === matchKey);
  }, [activeTab]);

  return (
    <>
      <Navbar />
      <div className="search-page">
        <div className="search-header">
          <div className="search-title">
            <h2>Profile performance</h2>
            <p>Summary of how your profile performed in searches by the recruiter</p>
          </div>
          <div className="search-summary">Summary of last 90 days</div>
        </div>

        <div className="search-metrics">
          <div className="metric-card">
            <div className="metric-value">4</div>
            <div className="metric-label">Search appearances</div>
          </div>
          <div className="metric-card">
            <div className="metric-value">12</div>
            <div className="metric-label">Recruiter actions</div>
          </div>
          <div className="metric-boost">
            <div className="boost-icon"><FiTrendingUp /></div>
            <div className="boost-text">
              <div>3X more chances of callback.</div>
              <a href="#">Click here</a>
            </div>
            <span className="boost-tag">Paid Services</span>
          </div>
        </div>

        <div className="search-content">
          <div className="search-main">
            <div className="search-card">
              <div className="search-card-header">
                <div>
                  <div className="search-card-title">3 Search appearances in last</div>
                  <div className="search-card-filter">7 Days <FiChevronDown /></div>
                </div>
                <div className="search-card-change">+ 100% since last week</div>
              </div>
              <div className="search-card-body">
                <div className="trend-bar">
                  <div className="trend-fill" style={{ width: '60%' }} />
                </div>
                <div className="trend-legend">More search appearances get you noticed by recruiters.</div>
              </div>
            </div>

            <div className="search-card">
              <div className="tab-row">
                {recruiterActionsTabs.map((tab) => (
                  <button
                    key={tab}
                    className={`pill ${activeTab === tab ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab} ({tabCounts[tab] ?? 0})
                  </button>
                ))}
              </div>

              <div className="recruiter-grid">
                {filteredActions.map((item, idx) => (
                  <div key={`${item.name}-${idx}`} className="recruiter-card">
                    <div className="recruiter-avatar">{item.name.charAt(0)}</div>
                    <div className="recruiter-info">
                      <div className="recruiter-name">{item.name}</div>
                      <div className="recruiter-role">{item.role}</div>
                      <div className="recruiter-location">{item.location}</div>
                      <div className="recruiter-type">{item.type}</div>
                    </div>
                    <div className="recruiter-time">{item.time}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside className="search-sidebar">
            <div className="activity-card">
              <div className="activity-title">Activity level</div>
              <div className="gauge">
                <div className="gauge-arc">
                  <div className="gauge-fill" />
                </div>
                <div className="gauge-label">MEDIUM</div>
              </div>
              <p className="activity-note">High activity level gets you more attention from recruiters</p>
              <div className="tips">
                <div className="tip"><FiCheckCircle /> Regularly log into your account</div>
                <div className="tip"><FiCheckCircle /> Respond to recruiter mails & messages</div>
                <div className="tip"><FiCheckCircle /> Update your profile frequently</div>
              </div>
            </div>

            <div className="completeness-card">
              <div className="completeness-title">Profile completeness 100%</div>
              <div className="completeness-bar">
                <div className="completeness-fill" />
              </div>
              <p>You have a great possibility of getting noticed by recruiters.</p>
            </div>
          </aside>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SearchAppearances;
