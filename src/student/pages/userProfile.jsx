import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './userProfile.css';
import UserProfileSidebar from './UserProfileSidebar';
import PersonalInfo from './UserProfileComponents/PersonalInfo';
import CareerProfile from './UserProfileComponents/CareerProfile';
import Education from './UserProfileComponents/Education';
import Experience from './UserProfileComponents/Experience';
import Projects from './UserProfileComponents/Projects';
import Skills from './UserProfileComponents/Skills';
import Languages from './UserProfileComponents/Languages';
import SocialLinks from './UserProfileComponents/SocialLinks';
import ProfileHeader from './UserProfileComponents/ProfileHeader';
import Navbar from '../../pages/components/Navbar';
import Footer from '../../pages/components/Footer';
import { FiDownload, FiUpload } from 'react-icons/fi';

const UserProfile = () => {
  const { user, updateProfile } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const fileInputRef = useRef(null);
  const defaultAvatar = 'https://static.vecteezy.com/system/resources/previews/036/594/092/non_2x/man-empty-avatar-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-free-vector.jpg';
  const [completionPercentage, setCompletionPercentage] = useState(0);

  const computeCompletion = (profile) => {
    if (!profile) return 0;

    let percentage = 0;

    if (profile.personalInfo?.name) percentage += 10;
    if (profile.personalInfo?.headline) percentage += 5;
    if (profile.personalInfo?.email) percentage += 3;
    if (profile.personalInfo?.phone) percentage += 2;

    if (profile.careerProfile?.summary) percentage += 15;
    if (profile.education?.length) percentage += 15;
    if (profile.experience?.length) percentage += 20;
    if (profile.projects?.length) percentage += 10;
    if (profile.skills?.length) percentage += 10;
    if (profile.languages?.length) percentage += 5;

    return Math.min(100, percentage);
  };

  useEffect(() => {
    if (user) {
      const personalInfo = user.personalInfo || {
        name: user.name || 'John Doe',
        headline: user.headline || 'Software Developer',
        location: user.location || 'Bangalore, India',
        email: user.email || '',
        phone: user.phone || '',
        image: user.avatar || defaultAvatar,
        dob: user.dob || '1990-05-15',
        gender: user.gender || 'Male',
        maritalStatus: user.maritalStatus || 'Single'
      };

      const careerProfile = user.careerProfile || {
        summary: user.summary || 'Experienced software developer with skills in web development.',
        currentIndustry: user.industry || 'Information Technology',
        functionalArea: user.functionalArea || 'Software Development',
        role: user.role || 'Frontend Developer',
        jobType: user.jobType || 'Permanent',
        employmentType: user.employmentType || 'Full Time',
        desiredSalary: user.desiredSalary || '15,00,000',
        desiredLocation: user.desiredLocation || 'Bangalore',
        noticePeriod: user.noticePeriod || '30 days'
      };

      const profile = {
        personalInfo,
        careerProfile,
        education: user.education || [
          {
            degree: 'Bachelor of Computer Applications',
            university: 'Delhi University',
            year: '2018 - 2021',
            completed: true
          }
        ],
        experience: user.experience || [
          {
            title: 'Frontend Developer',
            company: 'Tech Solutions Inc.',
            duration: '2022 - Present',
            description: 'Developing web applications using React and Node.js'
          }
        ],
        projects: user.projects || [],
        skills: user.skills || ['React', 'JavaScript', 'Node.js'],
        languages: user.languages || [
          { name: 'English', proficiency: 'Fluent' },
          { name: 'Hindi', proficiency: 'Native' }
        ],
        socialLinks: user.socialLinks || {
          linkedin: '',
          github: '',
          twitter: '',
          portfolio: ''
        },
        resume: user.resume || null
      };

      setProfileData(profile);
      setCompletionPercentage(computeCompletion(profile));
    }
  }, [user]);

  useEffect(() => {
    if (profileData) {
      setCompletionPercentage(computeCompletion(profileData));
    }
  }, [profileData]);

  const persistProfile = (nextProfile) => {
    const completion = computeCompletion(nextProfile);
    const baseUser = user || {};

    setProfileData(nextProfile);
    setCompletionPercentage(completion);

    updateProfile({
      ...baseUser,
      personalInfo: nextProfile.personalInfo,
      careerProfile: nextProfile.careerProfile,
      education: nextProfile.education,
      experience: nextProfile.experience,
      projects: nextProfile.projects,
      skills: nextProfile.skills,
      languages: nextProfile.languages,
      socialLinks: nextProfile.socialLinks,
      resume: nextProfile.resume,
      avatar: nextProfile.personalInfo?.image || user?.avatar,
      headline: nextProfile.personalInfo?.headline || user?.headline,
      location: nextProfile.personalInfo?.location || user?.location,
      name: nextProfile.personalInfo?.name || user?.name,
      email: nextProfile.personalInfo?.email || user?.email,
      phone: nextProfile.personalInfo?.phone || user?.phone,
      profileCompletion: completion,
      profileCompleted: completion > 0
    });
  };

  const handleSave = (section, data) => {
    const nextProfile = {
      ...profileData,
      [section]: data
    };

    persistProfile(nextProfile);
  };

  const handleResumeUpload = (event) => {
    if (!profileData) return;
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const resumeData = {
        name: file.name,
        type: file.type,
        dataUrl: reader.result
      };

      const nextProfile = {
        ...profileData,
        resume: resumeData
      };

      persistProfile(nextProfile);
    };
    reader.readAsDataURL(file);
  };

  const handleResumeDownload = () => {
    if (!profileData?.resume?.dataUrl) {
      console.warn('No resume available to download');
      return;
    }

    const link = document.createElement('a');
    link.href = profileData.resume.dataUrl;
    link.download = profileData.resume.name || 'resume';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleResumeSave = () => {
    // In a real app, persist resume metadata or trigger save action
    console.log('Saving resume');
  };

  const handleSaveAll = () => {
    if (!profileData) return;
    persistProfile(profileData);
    console.log('Profile saved');
  };

  const handleProfileImageEdit = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (event) => {
    if (!profileData) return;
    const file = event.target.files?.[0];
    if (!file) return;
    const imageUrl = URL.createObjectURL(file);
    const nextProfile = {
      ...profileData,
      personalInfo: {
        ...profileData.personalInfo,
        image: imageUrl
      }
    };

    persistProfile(nextProfile);
  };

  if (!profileData) {
    return <div className="loading">Loading profile...</div>;
  }

  return (
    <>
      <Navbar />
      <div className="user-profile-container">
        <div className="profile-layout">
          {/* Left side: reusable user profile sidebar / menu */}
          <UserProfileSidebar
            personalInfo={profileData.personalInfo}
            socialLinks={profileData.socialLinks}
            completionPercentage={completionPercentage}
          />

          {/* Right side main content */}
          <main className="profile-main">
            <ProfileHeader
              data={profileData.personalInfo}
              socialLinks={profileData.socialLinks}
              onEdit={handleProfileImageEdit}
            />
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleAvatarChange}
            />
            <div className="profile-main-header">
              <div>
                <h2>Recommended jobs for you</h2>
                <p className="profile-main-subtitle">
                  Based on your profile and preferences
                </p>
              </div>
              <div className="profile-main-header-actions">
                <div className="profile-main-tabs">
                  <button className="profile-tab active">Applies</button>
                  <button className="profile-tab">Profile</button>
                  <button className="profile-tab">Top candidate</button>
                  <button className="profile-tab">Preferences</button>
                </div>
              </div>
            </div>

            <div className="profile-sections">
              <PersonalInfo
                data={profileData.personalInfo}
                onSave={(data) => handleSave('personalInfo', data)}
              />

              <CareerProfile
                data={profileData.careerProfile}
                onSave={(data) => handleSave('careerProfile', data)}
              />

              <Education
                data={profileData.education}
                onSave={(data) => handleSave('education', data)}
              />

              <Experience
                data={profileData.experience}
                onSave={(data) => handleSave('experience', data)}
              />

              <Projects
                data={profileData.projects}
                onSave={(data) => handleSave('projects', data)}
              />

              <Skills
                data={profileData.skills}
                onSave={(data) => handleSave('skills', data)}
              />

              <Languages
                data={profileData.languages}
                onSave={(data) => handleSave('languages', data)}
              />

              <SocialLinks
                data={profileData.socialLinks}
                onSave={(data) => handleSave('socialLinks', data)}
              />

              {/* Resume Section */}
              <div className="profile-section">
                <h3>Resume</h3>
                <div className="resume-actions">
                  <div className="resume-upload">
                    <label htmlFor="resume-upload" className="resume-upload-btn">
                      <FiUpload /> Upload Resume
                    </label>
                    <input
                      id="resume-upload"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleResumeUpload}
                      style={{ display: 'none' }}
                    />
                  </div>
                  <button
                    onClick={handleResumeDownload}
                    className="resume-download-btn"
                  >
                    <FiDownload /> Download Resume
                  </button>
                  <button
                    onClick={handleResumeSave}
                    className="resume-save-btn"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default UserProfile;