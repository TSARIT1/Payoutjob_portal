import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './style.css';
import Footer from '../../pages/components/Footer';
import Navbar from '../../pages/components/Navbar';
import { registerEmployer } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const EmpRegister = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    companyName: '',
    phone: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { applySession } = useAuth();
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (!formData.companyName) {
      newErrors.companyName = 'Company name is required';
    }

    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculatePasswordStrength = () => {
    if (!formData.password) return 0;
    
    let strength = 0;
    if (formData.password.length >= 8) strength += 1;
    if (/[A-Z]/.test(formData.password)) strength += 1;
    if (/[0-9]/.test(formData.password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(formData.password)) strength += 1;
    
    return (strength / 4) * 100;
  };

  const getPasswordStrengthColor = () => {
    const strength = calculatePasswordStrength();
    if (strength <= 25) return '#dc2626';
    if (strength <= 50) return '#ea580c';
    if (strength <= 75) return '#d97706';
    return '#059669';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      try {
        const data = await registerEmployer({
          fullName: formData.companyName,
          companyName: formData.companyName,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          location: 'Bangalore, India'
        });
        applySession(data);
        navigate('/dashboard');
      } catch (error) {
        setErrors((prev) => ({
          ...prev,
          general: error?.response?.data?.error || 'Employer registration failed.'
        }));
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleGoogleSuccess = (credentialResponse) => {
    console.log('Google registration success:', credentialResponse);
    navigate('/employer/login');
  };

  const handleGoogleError = () => {
    console.log('Google registration failed');
  };

  return (
    <>
      <Navbar />
      <div className="emp-auth-container">
        <div className="emp-hero-section">
          <div className="emp-hero-content">
            <div className="emp-hero-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 6V8H18V6H12ZM12 10V12H18V10H12ZM12 14V16H18V14H12ZM8 6V8H10V6H8ZM8 10V12H10V10H8ZM8 14V16H10V14H8ZM4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4ZM4 6V18H20V6H4Z" fill="currentColor"/>
              </svg>
            </div>
            <h1>Join Thousands of Employers</h1>
            <p>
              Create your employer account to access our full suite of recruitment
              tools and find the best talent for your organization.
            </p>
            <div className="emp-features">
              <div className="emp-feature">
                <div className="emp-feature-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 5.5V7H9V5.5L3 7V9L9 10.5V12H15V10.5L21 9ZM15 10.5H9V12H15V10.5ZM12 14C13.1 14 14 14.9 14 16C14 17.1 13.1 18 12 18C10.9 18 10 17.1 10 16C10 14.9 10.9 14 12 14ZM18 16C18 14.9 18.9 14 20 14C21.1 14 22 14.9 22 16C22 17.1 21.1 18 20 18C18.9 18 18 17.1 18 16ZM6 16C6 14.9 6.9 14 8 14C9.1 14 10 14.9 10 16C10 17.1 9.1 18 8 18C6.9 18 6 17.1 6 16ZM12 20C13.1 20 14 20.9 14 22C14 23.1 13.1 24 12 24C10.9 24 10 23.1 10 22C10 20.9 10.9 20 12 20Z" fill="currentColor"/>
                  </svg>
                </div>
                <p>Fast candidate matching</p>
              </div>
              <div className="emp-feature">
                <div className="emp-feature-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM9 17H7V10H9V17ZM13 17H11V7H13V17ZM17 17H15V13H17V17Z" fill="currentColor"/>
                  </svg>
                </div>
                <p>Powerful hiring tools</p>
              </div>
              <div className="emp-feature">
                <div className="emp-feature-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 6L18.29 8.29L13.41 13.17L9.41 9.17L2 16.59L3.41 18L9.41 12L13.41 16L19.71 9.71L22 12V6H16Z" fill="currentColor"/>
                  </svg>
                </div>
                <p>Performance analytics</p>
              </div>
            </div>
          </div>
        </div>

        <div className="emp-form-section">
          <div className="emp-form-wrapper">
            <h2>Create your employer account</h2>
            <p className="emp-form-subtitle">
              Already have an account?{' '}
              <Link to="/employer/login" className="emp-switch-link">
                Sign in
              </Link>
            </p>

            <div className="emp-social-auth">
              <button className="emp-google-btn" onClick={handleGoogleSuccess}>
                <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </button>
            </div>

            <div className="emp-divider">
              <span>OR</span>
            </div>

              <form className="emp-form" onSubmit={handleSubmit}>
                                {errors.general && (
                                  <div className="emp-error emp-error-general">
                                    {errors.general}
                                  </div>
                                )}

                <div className="emp-form-group">
                  <label htmlFor="companyName" className="emp-label">
                    Company Name
                  </label>
                  <div className="emp-input-wrapper">
                    <div className="emp-input-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 7V3H2V21H22V7H12ZM6 19H4V17H6V19ZM6 15H4V13H6V15ZM6 11H4V9H6V11ZM6 7H4V5H6V7ZM10 19H8V17H10V19ZM10 15H8V13H10V15ZM10 11H8V9H10V11ZM10 7H8V5H10V7ZM20 19H12V17H14V15H12V13H14V11H12V9H20V19ZM18 11H16V13H18V11ZM18 15H16V17H18V15Z" fill="currentColor"/>
                      </svg>
                    </div>
                    <input
                      type="text"
                      id="companyName"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      className={`emp-input ${errors.companyName ? 'emp-input-error' : ''}`}
                      placeholder="Your company name"
                    />
                  </div>
                  {errors.companyName && (
                    <span className="emp-error">{errors.companyName}</span>
                  )}
                </div>

                <div className="emp-form-group">
                  <label htmlFor="email" className="emp-label">
                    Work Email
                  </label>
                  <div className="emp-input-wrapper">
                    <div className="emp-input-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z" fill="currentColor"/>
                      </svg>
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`emp-input ${errors.email ? 'emp-input-error' : ''}`}
                      placeholder="your@company.com"
                    />
                  </div>
                  {
                  errors.email && 
                  (
                    <span className="emp-error">{errors.email}</span>
                  )
                  }
                </div>

                <div className="emp-form-group">
                  <label htmlFor="phone" className="emp-label">
                    Phone Number
                  </label>
                  <div className="emp-input-wrapper">
                    <div className="emp-input-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6.62 10.79C8.06 13.62 10.38 15.94 13.21 17.38L15.41 15.18C15.68 14.91 16.08 14.82 16.43 14.94C17.55 15.31 18.76 15.51 20 15.51C20.55 15.51 21 15.96 21 16.51V20C21 20.55 20.55 21 20 21C10.61 21 3 13.39 3 4C3 3.45 3.45 3 4 3H7.5C8.05 3 8.5 3.45 8.5 4C8.5 5.25 8.7 6.45 9.07 7.57C9.18 7.92 9.1 8.31 8.82 8.59L6.62 10.79Z" fill="currentColor"/>
                      </svg>
                    </div>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`emp-input ${errors.phone ? 'emp-input-error' : ''}`}
                      placeholder="+1 (123) 456-7890"
                    />
                  </div>
                  {errors.phone && (
                    <span className="emp-error">{errors.phone}</span>
                  )}
                </div>

                <div className="emp-form-group">
                  <label htmlFor="password" className="emp-label">
                    Password
                  </label>
                  <div className="emp-input-wrapper">
                    <div className="emp-input-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 8H17V6C17 3.24 14.76 1 12 1C9.24 1 7 3.24 7 6V8H6C4.9 8 4 8.9 4 10V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V10C20 8.9 19.1 8 18 8ZM12 17C10.9 17 10 16.1 10 15C10 13.9 10.9 13 12 13C13.1 13 14 13.9 14 15C14 16.1 13.1 17 12 17ZM15.1 8H8.9V6C8.9 4.29 10.29 2.9 12 2.9C13.71 2.9 15.1 4.29 15.1 6V8Z" fill="currentColor"/>
                      </svg>
                    </div>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`emp-input ${errors.password ? 'emp-input-error' : ''}`}
                      placeholder="••••••••"
                    />
                  </div>
                  {errors.password && (
                    <span className="emp-error">{errors.password}</span>
                  )}
                  <div className="emp-password-strength">
                    <div
                      className="emp-strength-meter"
                      style={{ 
                        width: `${calculatePasswordStrength()}%`,
                        backgroundColor: getPasswordStrengthColor()
                      }}
                    ></div>
                  </div>
                  <p className="emp-hint">
                    Use 8+ characters with a mix of letters, numbers & symbols
                  </p>
                </div>

                <div className="emp-form-group">
                  <label htmlFor="confirmPassword" className="emp-label">
                    Confirm Password
                  </label>
                  <div className="emp-input-wrapper">
                    <div className="emp-input-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" fill="currentColor"/>
                      </svg>
                    </div>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`emp-input ${errors.confirmPassword ? 'emp-input-error' : ''}`}
                      placeholder="••••••••"
                    />
                  </div>
                  {errors.confirmPassword && (
                    <span className="emp-error">{errors.confirmPassword}</span>
                  )}
                </div>

                <button type="submit" className="emp-primary-btn" disabled={isLoading}>
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </button>
              </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default EmpRegister;