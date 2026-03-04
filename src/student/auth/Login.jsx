import React, { useState, useEffect } from 'react';
import { FcGoogle } from 'react-icons/fc';
import './AuthStyles.css';
import Navbar from '../../pages/components/Navbar';
import OtpVerification from './OtpVerification';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../../pages/components/Footer';
import { useAuth } from '../../contexts/AuthContext';

const StudentLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [rememberMe, setRememberMe] = useState(false);
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
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
    if (validateForm()) {
      setIsLoading(true);
      try {
        const result = await login(formData.email, formData.password, 'Student');
        if (result.success) {
          // After successful login, go directly to the profile dashboard
          navigate('/profile');
        } else {
          setErrors({ general: result.error });
        }
      } catch (error) {
        setErrors({ general: 'Login failed. Please try again.' });
      } finally {
        setIsLoading(false);
      }
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
    <Navbar />
    <div className="stu-auth-container">
      <div className="stu-hero-section">
        <div className="stu-hero-content">
          <h1>Welcome Back Students!</h1>
          <p>
            Access your learning dashboard, track your progress, and discover new 
            opportunities to advance your career.
          </p>
          <div className="stu-features">
            <div className="stu-feature">
              <span>📚</span>
              <p>Access course materials</p>
            </div>
            <div className="stu-feature">
              <span>🎯</span>
              <p>Track your learning progress</p>
            </div>
            <div className="stu-feature">
              <span>💼</span>
              <p>Find internship opportunities</p>
            </div>
          </div>
        </div>
      </div>

      <div className="stu-form-section">
        <div className="stu-form-wrapper">
          <h2>Sign in to your account</h2>
          <p className="stu-form-subtitle">
            Don't have an account?{' '}
            <Link to="/register" className="stu-switch-link">
              Sign up
            </Link>
          </p>

          <div className="stu-social-auth">
            <button
              type="button"
              className="stu-google-btn"
              onClick={handleGoogleSuccess}
            >
              <FcGoogle size={20} />
              Continue with Google
            </button>
          </div>

          <div className="stu-divider">
            <span>OR</span>
          </div>

          {showOtpVerification ? (
            <OtpVerification 
              email={formData.email}
              onComplete={() => setShowOtpVerification(false)}
              cooldown={45}
            />
          ) : (
            <form className="stu-form" onSubmit={handleSubmit}>
              <div className="stu-form-group">
                <label htmlFor="email" className="stu-label">
                  Student Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`stu-input ${errors.email ? 'stu-input-error' : ''}`}
                  placeholder="your@university.edu"
                />
                {errors.email && (
                  <span className="stu-error">{errors.email}</span>
                )}
              </div>

              <div className="stu-form-group">
                <label htmlFor="password" className="stu-label">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`stu-input ${errors.password ? 'stu-input-error' : ''}`}
                  placeholder="••••••••"
                />
                {errors.password && (
                  <span className="stu-error">{errors.password}</span>
                )}
              </div>

              <div className="stu-options">
                <div className="stu-remember">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="stu-checkbox"
                  />
                  <label htmlFor="rememberMe" className="stu-remember-label">
                    Remember me
                  </label>
                </div>
                <button type="button" className="stu-forgot-btn">
                  Forgot password?
                </button>
              </div>

              {errors.general && (
                <div className="stu-error" style={{ textAlign: 'center', marginBottom: '15px' }}>
                  {errors.general}
                </div>
              )}

              <button type="submit" className="stu-primary-btn" disabled={isLoading}>
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

export default StudentLogin;