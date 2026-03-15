import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiLogIn, FiBell, FiUser, FiLogOut, FiBriefcase, FiMoon, FiSun, FiChevronRight, FiShield, FiBarChart2, FiMail, FiGlobe, FiSliders } from 'react-icons/fi';
import { FaUser } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import './Navbar.css';

const Navbar = ({ mode = 'default' }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isJobsMenuOpen, setIsJobsMenuOpen] = useState(false);
  const [isCompaniesMenuOpen, setIsCompaniesMenuOpen] = useState(false);
  const [isEmployerMenuOpen, setIsEmployerMenuOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const { isDarkMode, toggleTheme, accentTheme, setAccentTheme, accentThemes } = useTheme();
  const { locale, setLocale, t, languages } = useLanguage();
  const navigate = useNavigate();

  const avatarUrl = user?.avatar || 'https://static.vecteezy.com/system/resources/previews/036/594/092/non_2x/man-empty-avatar-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-free-vector.jpg';
  const isStudentUser = user?.role?.toLowerCase() === 'student';
  const isEmployerUser = user?.role?.toLowerCase() === 'employer';
  const isAdminUser = user?.role?.toLowerCase() === 'admin';
  const isAuthMode = mode === 'student-auth' || mode === 'employer-auth' || mode === 'admin-auth';
  const shouldShowEmployerLinks = !isAuthenticated && !isAuthMode;

  const authModeLinks = {
    'student-auth': [
      { label: 'Employer Login', path: '/employer/login' },
      { label: 'Admin Login', path: '/admin/login' }
    ],
    'employer-auth': [
      { label: 'Job Seeker Login', path: '/login' },
      { label: 'Employer Register', path: '/employer/register' },
      { label: 'Admin Login', path: '/admin/login' }
    ],
    'admin-auth': [
      { label: 'Job Seeker Login', path: '/login' },
      { label: 'Employer Login', path: '/employer/login' }
    ]
  };

  const contextLinks = authModeLinks[mode] || [];
  const dashboardShortcutPath = isAdminUser ? '/admin/dashboard' : isEmployerUser ? '/dashboard' : '/profile';
  const dashboardShortcutLabel = isAdminUser ? 'Admin Dashboard' : isEmployerUser ? 'Employer Dashboard' : 'My Profile';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const clickedProfileArea = event.target.closest('.profile-dropdown') || event.target.closest('.profile-btn');
      if (isProfileDropdownOpen && !clickedProfileArea) {
        setIsProfileDropdownOpen(false);
      }

      if (isEmployerMenuOpen && !event.target.closest('.employer-menu')) {
        setIsEmployerMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isProfileDropdownOpen, isEmployerMenuOpen]);

  useEffect(() => {
    if (!shouldShowEmployerLinks && isEmployerMenuOpen) {
      setIsEmployerMenuOpen(false);
    }
  }, [shouldShowEmployerLinks, isEmployerMenuOpen]);

  const handleLogout = () => {
    logout();
    setIsProfileDropdownOpen(false);
    // After logout, go back to the main home page
    navigate('/');
  };

  const buildJobUrl = (params) => `/job?${new URLSearchParams(params).toString()}`;

  const jobQuickLinks = [
    { label: 'Work From Home Jobs', href: buildJobUrl({ employmentType: 'Remote' }) },
    { label: 'Part Time Jobs', href: buildJobUrl({ employmentType: 'Part Time' }) },
    { label: 'Freshers Jobs', href: buildJobUrl({ experience: 'Fresher' }) },
    { label: 'Jobs for Women', href: buildJobUrl({ keywords: 'women' }) },
    { label: 'Full Time Jobs', href: buildJobUrl({ employmentType: 'Full Time' }) },
    { label: 'Night Shift Jobs', href: buildJobUrl({ keywords: 'Night Shift' }) },
  ];

  // Removed category links section as requested

  const companiesCategories = [
    'MNC',
    'Startup',
    'Product based',
    'Internet'
  ];

  const companiesCollections = [
    'Top companies',
    'IT companies',
    'Fintech companies',
    'Sponsored companies',
    'Featured companies'
  ];

  const buildCompaniesUrl = (params) => `/companies?${new URLSearchParams(params).toString()}`;

  const companiesResearch = [
    'Interview questions',
    'Company salaries',
    'Company reviews',
    'Salary Calculator'
  ];

  const mobileNavLinks = [
    { name: t('nav.home'), path: '/' },
    { name: t('nav.jobs'), path: '/job' },
    { name: t('nav.companies'), path: '/companies' },
    { name: t('nav.aiTools'), path: '/ai-tools' },
  ];

  const mobileMenuVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  const mobileListVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.045,
        delayChildren: 0.03,
      },
    },
  };

  const mobileItemVariants = {
    hidden: { opacity: 0, y: -8 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
  };

  return (
    <motion.header 
      className={`navbar ${scrolled ? 'scrolled' : ''}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100 }}
    >
      <div className="container">
        <motion.div 
          className="logo"
          whileHover={{ scale: 1.04 }}
        >
          <Link to="/">Payout<span>Job</span></Link>
        </motion.div>

        <nav className="desktop-nav">
          <ul>
            <motion.li 
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to="/">{t('nav.home')}</Link>
            </motion.li>

            <motion.li
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to="/ai-tools">{t('nav.aiTools')}</Link>
            </motion.li>

            <motion.li
              className={`has-megamenu ${isJobsMenuOpen ? 'open' : ''}`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onMouseEnter={() => setIsJobsMenuOpen(true)}
              onMouseLeave={() => setIsJobsMenuOpen(false)}
              onFocus={() => setIsJobsMenuOpen(true)}
              onBlur={() => setIsJobsMenuOpen(false)}
            >
              <div className="jobs-link">
                <Link to="/job">{t('nav.jobs')}</Link>
                <span className="badge-new">New</span>
              </div>
              <AnimatePresence>
                {isJobsMenuOpen && (
                  <motion.div
                    className="mega-menu"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.18 }}
                  >
                    <div className="mega-column">
                      {jobQuickLinks.map((item) => (
                        <a key={item.label} href={item.href} className="mega-link">
                          <span>{item.label}</span>
                          <FiChevronRight />
                        </a>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.li>

            <motion.li
              className={`has-megamenu ${isCompaniesMenuOpen ? 'open' : ''}`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onMouseEnter={() => setIsCompaniesMenuOpen(true)}
              onMouseLeave={() => setIsCompaniesMenuOpen(false)}
              onFocus={() => setIsCompaniesMenuOpen(true)}
              onBlur={() => setIsCompaniesMenuOpen(false)}
            >
              <div className="companies-link">
                <Link to="/companies">{t('nav.companies')}</Link>
              </div>
              <AnimatePresence>
                {isCompaniesMenuOpen && (
                  <motion.div
                    className="mega-menu companies-menu"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.18 }}
                  >
                    <div className="mega-column">
                      <div className="mega-heading">Explore categories</div>
                      {companiesCategories.map((item) => (
                        <a key={item} href={buildCompaniesUrl({ category: item })} className="mega-link">
                          <span>{item}</span>
                          <FiChevronRight />
                        </a>
                      ))}
                    </div>
                    <div className="mega-column">
                      <div className="mega-heading">Explore collections</div>
                      {companiesCollections.map((item) => (
                        <a key={item} href={buildCompaniesUrl({ collection: item })} className="mega-link">
                          <span>{item}</span>
                          <FiChevronRight />
                        </a>
                      ))}
                    </div>
                    <div className="mega-column">
                      <div className="mega-heading">Research companies</div>
                      {companiesResearch.map((item) => (
                        <a key={item} href="/companies" className="mega-link">
                          <span>{item}</span>
                          <FiChevronRight />
                        </a>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.li>
          </ul>
        </nav>

        <div className="auth-buttons">
          <div className="nav-selectors">
            <label className="nav-selector" title={t('languageLabel')}>
              <span className="nav-selector-icon" aria-hidden="true"><FiGlobe /></span>
              <select aria-label={t('languageLabel')} value={locale} onChange={(e) => setLocale(e.target.value)}>
                {languages.map((language) => (
                  <option key={language.code} value={language.code}>{language.label}</option>
                ))}
              </select>
            </label>
            <label className="nav-selector" title={t('nav.theme')}>
              <span className="nav-selector-icon" aria-hidden="true"><FiSliders /></span>
              <select aria-label={t('nav.theme')} value={accentTheme} onChange={(e) => setAccentTheme(e.target.value)}>
                {accentThemes.map((theme) => (
                  <option key={theme.id} value={theme.id}>{theme.label}</option>
                ))}
              </select>
            </label>
          </div>
          <motion.button
            className="theme-toggle-btn cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            title={isDarkMode ? t('nav.light') : t('nav.dark')}
            aria-label="Toggle theme"
          >
            {isDarkMode ? <FiSun /> : <FiMoon />}
          </motion.button>
          {shouldShowEmployerLinks && (
            <div className="employer-menu">
              <motion.button
                className={`employer-btn cursor-pointer ${isEmployerMenuOpen ? 'open' : ''}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsEmployerMenuOpen((prev) => !prev)}
              >
                {t('nav.forEmployers')}
                <FiChevronRight className={`employer-chevron ${isEmployerMenuOpen ? 'open' : ''}`} />
              </motion.button>
              <AnimatePresence>
                {isEmployerMenuOpen && (
                  <motion.div
                    className="employer-dropdown"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.18 }}
                  >
                    <Link to="/employer/login" onClick={() => setIsEmployerMenuOpen(false)}>
                      <FiLogIn /> {t('nav.login')}
                    </Link>
                    <Link to="/employer/register" onClick={() => setIsEmployerMenuOpen(false)}>
                      <FiUser /> {t('nav.register')}
                    </Link>
                    <Link to="/admin/login" onClick={() => setIsEmployerMenuOpen(false)}>
                      <FiShield /> Super Admin
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
          {isAuthenticated ? (
            <>
              {!isStudentUser && (
                <Link to={dashboardShortcutPath} className="dashboard-quick-link" title={dashboardShortcutLabel}>
                  <FiBriefcase /> {dashboardShortcutLabel}
                </Link>
              )}
              {isStudentUser && (
                <Link to="/notifications">
                  <motion.button
                    className="notifications-btn cursor-pointer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    title="Notifications"
                  >
                    <FiBell />
                  </motion.button>
                </Link>
              )}
              <motion.button
                className="profile-btn cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="Profile"
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                style={{ position: 'relative' }}
              >
                <img
                  src={avatarUrl}
                  alt="Profile"
                  className="profile-avatar-nav"
                />
              </motion.button>
            </>
          ) : (
            <>
              {isAuthMode ? (
                <div className="auth-context-links" aria-label="Quick login routes">
                  {contextLinks.map((entry) => (
                    <Link key={entry.path} to={entry.path} className="auth-context-link">
                      {entry.label}
                    </Link>
                  ))}
                </div>
              ) : (
                <>
                  <Link to="/login">
                    <motion.button 
                      className="login-btn cursor-pointer"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FiLogIn /> {t('nav.login')}
                    </motion.button>
                  </Link>
                  <Link to="/register">
                    <motion.button 
                      className="register-btn cursor-pointer"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FiUser /> {t('nav.register')}
                    </motion.button>
                  </Link>
                </>
              )}
            </>
          )}
        </div>
         

        <AnimatePresence>
          {isAuthenticated && isProfileDropdownOpen && (
            <motion.div
              className="profile-dropdown"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="profile-dropdown-header">
                <div className="profile-avatar">
                  <img src={avatarUrl} alt="Profile" />
                </div>
                <div className="profile-info">
                  <h4>{user?.name}</h4>
                  <p className="profile-email" title={user?.email || ''}>{user?.email}</p>
                  <span className="profile-role">{user?.role}</span>
                </div>
              </div>
              <div className="profile-dropdown-menu">
                {isStudentUser && (
                  <>
                    <Link to="/profile" onClick={() => setIsProfileDropdownOpen(false)}>
                      <FaUser /> View Profile
                    </Link>
                    <Link to="/applied-jobs" onClick={() => setIsProfileDropdownOpen(false)}>
                      <FiBriefcase /> Applied Jobs
                    </Link>
                    <Link to="/tracker/student" onClick={() => setIsProfileDropdownOpen(false)}>
                      <FiBarChart2 /> Job Seeker Tracker
                    </Link>
                  </>
                )}
                {isEmployerUser && (
                  <>
                    <Link to="/dashboard" onClick={() => setIsProfileDropdownOpen(false)}>
                      <FiBriefcase /> Employer Dashboard
                    </Link>
                    <Link to="/tracker/employer" onClick={() => setIsProfileDropdownOpen(false)}>
                      <FiBarChart2 /> Employer Tracker
                    </Link>
                    {user?.companySlug && (
                      <Link to={`/company/${user.companySlug}`} onClick={() => setIsProfileDropdownOpen(false)}>
                        <FiShield /> Company Workspace
                      </Link>
                    )}
                  </>
                )}
                {isAdminUser && (
                  <Link to="/admin/dashboard" onClick={() => setIsProfileDropdownOpen(false)}>
                    <FiShield /> Super Admin Dashboard
                  </Link>
                )}
                <Link to="/contact" onClick={() => setIsProfileDropdownOpen(false)}>
                  <FiMail /> Contact Us
                </Link>
                <button onClick={handleLogout} className="logout-btn">
                  <FiLogOut /> Logout
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
            

        <button 
          className="mobile-menu-btn"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>

      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            className="mobile-menu"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={mobileMenuVariants}
            transition={{ duration: 0.3 }}
          >
            <motion.ul variants={mobileListVariants}>
              {mobileNavLinks.map((link) => (
                <motion.li
                  key={link.name}
                  variants={mobileItemVariants}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Link to={link.path} className="mobile-nav-link">{link.name}</Link>
                </motion.li>
              ))}
              <motion.li variants={mobileItemVariants}>
                <div className="mobile-selectors">
                  <label className="mobile-selector-block">
                    <span className="mobile-selector-title"><FiGlobe /> {t('languageLabel')}</span>
                    <select value={locale} onChange={(e) => setLocale(e.target.value)}>
                      {languages.map((language) => (
                        <option key={language.code} value={language.code}>{language.label}</option>
                      ))}
                    </select>
                  </label>
                  <label className="mobile-selector-block">
                    <span className="mobile-selector-title"><FiSliders /> {t('nav.theme')}</span>
                    <select value={accentTheme} onChange={(e) => setAccentTheme(e.target.value)}>
                      {accentThemes.map((theme) => (
                        <option key={theme.id} value={theme.id}>{theme.label}</option>
                      ))}
                    </select>
                  </label>
                </div>
              </motion.li>
              <motion.li variants={mobileItemVariants}>
                <button
                  className="mobile-theme-toggle"
                  onClick={() => { toggleTheme(); setIsMobileMenuOpen(false); }}
                >
                  {isDarkMode ? <FiSun /> : <FiMoon />} {isDarkMode ? t('nav.light') : t('nav.dark')}
                </button>
              </motion.li>
              {shouldShowEmployerLinks && (
                <motion.li className="mobile-employer-menu" variants={mobileItemVariants}>
                  <div className="mobile-employer-heading">{t('nav.forEmployers')}</div>
                  <a href="/employer/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <FiLogIn /> {t('nav.login')}
                  </a>
                  <a href="/employer/register" onClick={() => setIsMobileMenuOpen(false)}>
                    <FiUser /> {t('nav.register')}
                  </a>
                  <a href="/admin/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <FiShield /> Super Admin
                  </a>
                </motion.li>
              )}
              {isAuthenticated ? (
                <>
                  {isStudentUser && (
                    <motion.li variants={mobileItemVariants}>
                      <Link to="/notifications" className="mobile-icon-btn" onClick={() => setIsMobileMenuOpen(false)}>
                        <FiBell />
                      </Link>
                    </motion.li>
                  )}
                  <motion.li variants={mobileItemVariants}>
                    <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)}>
                      <button className="mobile-profile-btn" title="Profile">
                        <img src={avatarUrl} alt="Profile" className="profile-avatar-nav" />
                      </button>
                    </Link>
                  </motion.li>
                  {isStudentUser && (
                    <>
                      <motion.li variants={mobileItemVariants}>
                        <Link to="/applied-jobs" onClick={() => setIsMobileMenuOpen(false)}>
                          <FiBriefcase /> Applied Jobs
                        </Link>
                      </motion.li>
                      <motion.li variants={mobileItemVariants}>
                        <Link to="/tracker/student" onClick={() => setIsMobileMenuOpen(false)}>
                          <FiBarChart2 /> Job Seeker Tracker
                        </Link>
                      </motion.li>
                    </>
                  )}
                  {isEmployerUser && (
                    <>
                      <motion.li variants={mobileItemVariants}>
                        <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                          <FiBriefcase /> Employer Dashboard
                        </Link>
                      </motion.li>
                      <motion.li variants={mobileItemVariants}>
                        <Link to="/tracker/employer" onClick={() => setIsMobileMenuOpen(false)}>
                          <FiBarChart2 /> Employer Tracker
                        </Link>
                      </motion.li>
                    </>
                  )}
                  {isAdminUser && (
                    <motion.li variants={mobileItemVariants}>
                      <Link to="/admin/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                        <FiShield /> Super Admin Dashboard
                      </Link>
                    </motion.li>
                  )}
                  <motion.li variants={mobileItemVariants}>
                    <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)}>
                      <FiMail /> Contact Us
                    </Link>
                  </motion.li>
                  <motion.li variants={mobileItemVariants}>
                    <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className="mobile-logout-btn">
                      <FiLogOut /> Logout
                    </button>
                  </motion.li>
                </>
              ) : (
                <>
                  {isAuthMode ? (
                    contextLinks.map((entry) => (
                      <motion.li key={entry.path} variants={mobileItemVariants}>
                        <Link to={entry.path} className="mobile-auth-context-link" onClick={() => setIsMobileMenuOpen(false)}>
                          {entry.label}
                        </Link>
                      </motion.li>
                    ))
                  ) : (
                    <>
                      <motion.li variants={mobileItemVariants}>
                        <Link to="/register" className="mobile-register-btn" onClick={() => setIsMobileMenuOpen(false)}>
                          <FiUser /> {t('nav.register')}
                        </Link>
                      </motion.li>
                      <motion.li variants={mobileItemVariants}>
                        <Link to="/login" className="mobile-login-btn" onClick={() => setIsMobileMenuOpen(false)}>
                          <FiLogIn /> {t('nav.login')}
                        </Link>
                      </motion.li>
                    </>
                  )}
                </>
              )}
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;