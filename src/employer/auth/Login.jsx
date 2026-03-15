import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import OtpVerification from './OtpVerification';
import './style.css';
import Navbar from '../../pages/components/Navbar';
import Footer from '../../pages/components/Footer';
import { useAuth } from '../../contexts/AuthContext';

const EmpLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [rememberMe, setRememberMe] = useState(false);
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { loginAsEmployer } = useAuth();
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
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const result = await loginAsEmployer(formData.email, formData.password);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setErrors((prev) => ({ ...prev, general: result.error || 'Login failed' }));
      }
    } catch (error) {
      setErrors((prev) => ({ ...prev, general: 'Login failed. Please try again.' }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = (credentialResponse) => {
    console.log('Google login success:', credentialResponse);
    // Handle Google auth with your backend
  };

  const handleGoogleError = () => {
    console.log('Google login failed');
  };

  return (
    <>
      <Navbar mode="employer-auth" />
      <div className="emp-auth-container">
        <div className="emp-hero-section">
          <div className="emp-hero-content">
            <div className="emp-hero-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="currentColor"/>
              </svg>
            </div>
            <h1>Welcome Back Employers!</h1>
            <p>
              Streamline your hiring process with our powerful recruitment tools.
              Access your dashboard to manage candidates, post jobs, and track
              applications.
            </p>
            <div className="emp-features">
              <div className="emp-feature">
                <div className="emp-feature-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 2H6C4.9 2 4.01 2.9 4.01 4L4 20C4 21.1 4.89 22 5.99 22H18C19.1 22 20 21.1 20 20V8L14 2ZM18 20H6V4H13V9H18V20Z" fill="currentColor"/>
                  </svg>
                </div>
                <p>Post unlimited job listings</p>
              </div>
              <div className="emp-feature">
                <div className="emp-feature-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z" fill="currentColor"/>
                  </svg>
                </div>
                <p>Access top talent pool</p>
              </div>
              <div className="emp-feature">
                <div className="emp-feature-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM9 17H7V10H9V17ZM13 17H11V7H13V17ZM17 17H15V13H17V17Z" fill="currentColor"/>
                  </svg>
                </div>
                <p>Advanced analytics dashboard</p>
              </div>
            </div>
          </div>
        </div>

        <div className="emp-form-section">
          <div className="emp-form-wrapper">
            <h2>Sign in to your account</h2>
            <p className="emp-form-subtitle">
              Don't have an account?{' '}
              <Link to="/employer/register" className="emp-switch-link">
                Sign up
              </Link>
            </p>

            <div className="emp-error emp-error-general" style={{ background: '#f8fafc', color: '#1e293b', border: '1px solid #dbeafe' }}>
              Demo login: employer@payoutjob.com / Payout@123
            </div>

            <div className="emp-social-auth">
              <button className="emp-google-btn">
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

            {showOtpVerification ? (
              <OtpVerification 
                email={formData.email}
                onComplete={() => setShowOtpVerification(false)}
                cooldown={45}
              />
            ) : (
              <form className="emp-form" onSubmit={handleSubmit}>
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
                  {errors.email && (
                    <span className="emp-error">{errors.email}</span>
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
                </div>

                <div className="emp-options">
                  <div className="emp-remember">
                    <input
                      type="checkbox"
                      id="rememberMe"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="emp-checkbox"
                    />
                    <label htmlFor="rememberMe" className="emp-remember-label">
                      Remember me
                    </label>
                  </div>
                  <button type="button" className="emp-forgot-btn">
                    Forgot password?
                  </button>
                </div>

                {errors.general && (
                  <div className="emp-error emp-error-general">
                    {errors.general}
                  </div>
                )}

                <button type="submit" className="emp-primary-btn" disabled={isLoading}>
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default EmpLogin;