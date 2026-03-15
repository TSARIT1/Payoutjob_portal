import React, { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import './AuthStyles.css';
import Navbar from '../../pages/components/Navbar';
import OtpVerification from './OtpVerification';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../../pages/components/Footer';
import { registerStudent } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';


const StudentRegister = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    phone: '',
    university: '',
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
    
    if (!formData.fullName) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    }
    
    if (!formData.university) {
      newErrors.university = 'University is required';
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

  // 🔹 Updated submit to connect backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setIsLoading(true);

      try {
        const data = await registerStudent({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          university: formData.university
        });
        applySession(data);
        navigate('/profile/setup');

      } catch (error) {
        setErrors({
          general: error?.response?.data?.error || 'Registration failed. Try again.'
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleGoogleSuccess = (credentialResponse) => {
    console.log('Google registration success:', credentialResponse);
    navigate('/');
  };

  const handleGoogleError = () => {
    console.log('Google registration failed');
  };

  return (
    <>
    <Navbar />
    <div className="stu-auth-container">
      <div className="stu-hero-section">
        <div className="stu-hero-content">
          <h1>Start Your Career Journey</h1>
          <p>
            Join thousands of job seekers who are advancing their careers through our 
            platform. Create your account to access opportunities, resources, and career 
            opportunities.
          </p>
          <div className="stu-features">
            <div className="stu-feature">
              <span>🎓</span>
              <p>Build your professional profile</p>
            </div>
            <div className="stu-feature">
              <span>📈</span>
              <p>Track your application progress</p>
            </div>
            <div className="stu-feature">
              <span>🤝</span>
              <p>Connect with recruiters</p>
            </div>
          </div>
        </div>
      </div>

      <div className="stu-form-section">
        <div className="stu-form-wrapper">
          <h2>Create your job seeker account</h2>
          <p className="stu-form-subtitle">
            Already have an account?{' '}
            <Link to="/login" className="stu-switch-link">
              Sign in
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

          <form className="stu-form" onSubmit={handleSubmit}>
              <div className="stu-form-group">
                <label htmlFor="fullName" className="stu-label">
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`stu-input ${errors.fullName ? 'stu-input-error' : ''}`}
                  placeholder="Your full name"
                />
                {errors.fullName && (
                  <span className="stu-error">{errors.fullName}</span>
                )}
              </div>

              <div className="stu-form-group">
                <label htmlFor="email" className="stu-label">
                  Job Seeker Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`stu-input ${errors.email ? 'stu-input-error' : ''}`}
                  placeholder="your@email.com"
                />
                {errors.email && (
                  <span className="stu-error">{errors.email}</span>
                )}
              </div>

              <div className="stu-form-group">
                <label htmlFor="university" className="stu-label">
                  University or Organization
                </label>
                <input
                  type="text"
                  id="university"
                  name="university"
                  value={formData.university}
                  onChange={handleChange}
                  className={`stu-input ${errors.university ? 'stu-input-error' : ''}`}
                  placeholder="Your university or organization"
                />
                {errors.university && (
                  <span className="stu-error">{errors.university}</span>
                )}
              </div>

              <div className="stu-form-group">
                <label htmlFor="phone" className="stu-label">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`stu-input ${errors.phone ? 'stu-input-error' : ''}`}
                  placeholder="+1 (123) 456-7890"
                />
                {errors.phone && (
                  <span className="stu-error">{errors.phone}</span>
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
                <div className="stu-password-strength">
                  <div
                    className="stu-strength-meter"
                    style={{ width: `${calculatePasswordStrength()}%` }}
                  ></div>
                </div>
                <p className="stu-hint">
                  Use 8+ characters with a mix of letters, numbers & symbols
                </p>
              </div>

              <div className="stu-form-group">
                <label htmlFor="confirmPassword" className="stu-label">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`stu-input ${errors.confirmPassword ? 'stu-input-error' : ''}`}
                  placeholder="••••••••"
                />
                {errors.confirmPassword && (
                  <span className="stu-error">{errors.confirmPassword}</span>
                )}
              </div>

              {errors.general && (
                <div className="stu-error" style={{ textAlign: 'center', marginBottom: '15px' }}>
                  {errors.general}
                </div>
              )}

              <button type="submit" className="stu-primary-btn">
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>
        </div>
      </div>
    </div>
    <br />
    <Footer />
    </>
  );
};

export default StudentRegister;