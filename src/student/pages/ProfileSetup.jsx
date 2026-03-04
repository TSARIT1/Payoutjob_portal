import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './ProfileSetup.css';
import './ProfileSetup.css';

const ProfileSetup = () => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    headline: user?.headline || 'Software Developer',
    location: user?.location || 'Bangalore, India',
    skills: user?.skills?.join(', ') || 'React, JavaScript, Node.js',
    experience: user?.experience?.[0]?.title || 'Frontend Developer',
    education: user?.education?.[0]?.degree || 'Bachelor of Computer Applications',
    university: user?.education?.[0]?.university || 'Delhi University',
    graduationYear: user?.education?.[0]?.year?.split(' - ')[1] || '2021'
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      try {
        // Transform form data to match user profile structure
        const profileData = {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          headline: formData.headline,
          location: formData.location,
          skills: formData.skills.split(',').map(skill => skill.trim()),
          experience: [{
            title: formData.experience,
            company: 'Current Company',
            duration: 'Present',
            description: 'Professional experience'
          }],
          education: [{
            degree: formData.education,
            university: formData.university,
            year: `2018 - ${formData.graduationYear}`,
            grade: 'First Class'
          }],
          profileCompleted: true,
          profileCompletion: 85
        };

        updateProfile(profileData);
        navigate('/');
      } catch (error) {
        console.error('Profile setup failed:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="profile-setup-container">
      <div className="profile-setup-card">
        <div className="profile-setup-header">
          <h1>Complete Your Profile</h1>
          <p>Please fill in your details to complete your profile setup</p>
        </div>

        <form onSubmit={handleSubmit} className="profile-setup-form">
          <div className="form-section">
            <h3>Personal Information</h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={errors.name ? 'error' : ''}
                  placeholder="Enter your full name"
                />
                {errors.name && <span className="error-text">{errors.name}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? 'error' : ''}
                  placeholder="Enter your email"
                />
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="phone">Phone Number *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={errors.phone ? 'error' : ''}
                  placeholder="Enter your phone number"
                />
                {errors.phone && <span className="error-text">{errors.phone}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="headline">Professional Headline</label>
                <input
                  type="text"
                  id="headline"
                  name="headline"
                  value={formData.headline}
                  onChange={handleChange}
                  placeholder="e.g., Software Developer"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="location">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Enter your location"
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Professional Information</h3>
            <div className="form-group">
              <label htmlFor="skills">Skills (comma-separated)</label>
              <input
                type="text"
                id="skills"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="e.g., React, JavaScript, Node.js"
              />
            </div>

            <div className="form-group">
              <label htmlFor="experience">Current/Last Position</label>
              <input
                type="text"
                id="experience"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                placeholder="e.g., Frontend Developer"
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Education</h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="education">Degree</label>
                <input
                  type="text"
                  id="education"
                  name="education"
                  value={formData.education}
                  onChange={handleChange}
                  placeholder="e.g., Bachelor of Computer Applications"
                />
              </div>

              <div className="form-group">
                <label htmlFor="university">University</label>
                <input
                  type="text"
                  id="university"
                  name="university"
                  value={formData.university}
                  onChange={handleChange}
                  placeholder="Enter university name"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="graduationYear">Graduation Year</label>
              <input
                type="number"
                id="graduationYear"
                name="graduationYear"
                value={formData.graduationYear}
                onChange={handleChange}
                placeholder="e.g., 2021"
                min="1950"
                max="2030"
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={() => navigate('/')} className="skip-btn">
              Skip for now
            </button>
            <button type="submit" disabled={isLoading} className="submit-btn">
              {isLoading ? 'Saving...' : 'Complete Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileSetup;