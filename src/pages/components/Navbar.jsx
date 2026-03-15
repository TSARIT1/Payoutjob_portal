import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiLogIn, FiBell, FiUser, FiSettings, FiLogOut, FiBriefcase, FiMoon, FiSun, FiChevronRight } from 'react-icons/fi';
import { FaUser } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import './Navbar.css';

const Navbar = () => {
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
  const shouldShowEmployerLinks = !isAuthenticated || !isStudentUser;

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
          <a href="/">Payout<span>Job</span></a>
        </motion.div>

        <nav className="desktop-nav">
          <ul>
            <motion.li 
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.95 }}
            >
              <a href="/">{t('nav.home')}</a>
            </motion.li>

            <motion.li
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.95 }}
            >
              <a href="/ai-tools">{t('nav.aiTools')}</a>
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
                <a href="/job">{t('nav.jobs')}</a>
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
                <a href="/companies">{t('nav.companies')}</a>
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
            <label className="nav-selector">
              <span>{t('languageLabel')}</span>
              <select value={locale} onChange={(e) => setLocale(e.target.value)}>
                {languages.map((language) => (
                  <option key={language.code} value={language.code}>{language.label}</option>
                ))}
              </select>
            </label>
            <label className="nav-selector">
              <span>{t('nav.theme')}</span>
              <select value={accentTheme} onChange={(e) => setAccentTheme(e.target.value)}>
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
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
          {isAuthenticated ? (
            <>
              <a href="/notifications">
                <motion.button
                  className="notifications-btn cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title="Notifications"
                >
                  <FiBell />
                </motion.button>
              </a>
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
                  <p>{user?.email}</p>
                  <span className="profile-role">{user?.role}</span>
                </div>
              </div>
              <div className="profile-dropdown-menu">
                <Link to="/profile" onClick={() => setIsProfileDropdownOpen(false)}>
                  <FaUser /> View Profile
                </Link>
                <Link to="/applied-jobs" onClick={() => setIsProfileDropdownOpen(false)}>
                  <FiBriefcase /> Applied Jobs
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
            <ul>
              {mobileNavLinks.map((link) => (
                <motion.li
                  key={link.name}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <a href={link.path}>{link.name}</a>
                </motion.li>
              ))}
              <li>
                <div className="mobile-selectors">
                  <label className="mobile-selector-block">
                    <span>{t('languageLabel')}</span>
                    <select value={locale} onChange={(e) => setLocale(e.target.value)}>
                      {languages.map((language) => (
                        <option key={language.code} value={language.code}>{language.label}</option>
                      ))}
                    </select>
                  </label>
                  <label className="mobile-selector-block">
                    <span>{t('nav.theme')}</span>
                    <select value={accentTheme} onChange={(e) => setAccentTheme(e.target.value)}>
                      {accentThemes.map((theme) => (
                        <option key={theme.id} value={theme.id}>{theme.label}</option>
                      ))}
                    </select>
                  </label>
                </div>
              </li>
              <li>
                <button
                  className="mobile-theme-toggle"
                  onClick={() => { toggleTheme(); setIsMobileMenuOpen(false); }}
                >
                  {isDarkMode ? <FiSun /> : <FiMoon />} {isDarkMode ? t('nav.light') : t('nav.dark')}
                </button>
              </li>
              {shouldShowEmployerLinks && (
                <li className="mobile-employer-menu">
                  <div className="mobile-employer-heading">{t('nav.forEmployers')}</div>
                  <a href="/employer/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <FiLogIn /> {t('nav.login')}
                  </a>
                  <a href="/employer/register" onClick={() => setIsMobileMenuOpen(false)}>
                    <FiUser /> {t('nav.register')}
                  </a>
                </li>
              )}
              {isAuthenticated ? (
                <>
                  <li>
                    <a href="/notifications" onClick={() => setIsMobileMenuOpen(false)}>
                    <button className="mobile-notifications-btn" title="Notifications">
                      <FiBell />
                    </button>
                    </a>
                  </li>
                  <li>
                    <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)}>
                      <button className="mobile-profile-btn" title="Profile">
                        <img src={avatarUrl} alt="Profile" className="profile-avatar-nav" />
                      </button>
                    </Link>
                  </li>
                  <li>
                    <Link to="/applied-jobs" onClick={() => setIsMobileMenuOpen(false)}>
                      <FiBriefcase /> Applied Jobs
                    </Link>
                  </li>
                  <li>
                    <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className="mobile-logout-btn">
                      <FiLogOut /> Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <a href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                    <button className="mobile-register-btn">
                      <FiUser /> {t('nav.register')}
                    </button>
                    </a>
                  </li>
                  <li>
                    <a href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <button className="mobile-login-btn">
                      <FiLogIn /> {t('nav.login')}
                    </button>
                    </a>
                  </li>
                </>
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;