import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './style.css';
import Footer from '../../pages/components/Footer';
import Navbar from '../../pages/components/Navbar';

const EmpWelcome = () => {
  const [step, setStep] = useState(1);
  const [onboard, setOnboard] = useState({
    // Step 1 - recruiter details
    recruiterName: '',
    recruiterEmail: '',
    recruiterPhone: '',
    designation: '',
    // Step 2 - company info
    companyName: '',
    companyEmail: '',
    companyType: '',
    industry: '',
    establishYear: '',
    location: '',
    // Step 3 - documents and business info
    companyRegistration: null,
    gstCertificate: null,
    panCard: null,
    authorizationLetter: null,
    gstNumber: '',
    panNumber: '',
    companyCategory: '',
    employeeCount: ''
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOnboard((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setOnboard((prev) => ({ ...prev, [name]: files && files[0] ? files[0] : null }));
  };

  const validateStep = (s) => {
    const newErrors = {};
    if (s === 1) {
      if (!onboard.recruiterName) newErrors.recruiterName = 'Name is required';
      if (!onboard.recruiterEmail) newErrors.recruiterEmail = 'Email is required';
      if (!/\S+@\S+\.\S+/.test(onboard.recruiterEmail)) newErrors.recruiterEmail = 'Email is invalid';
      if (!onboard.recruiterPhone) newErrors.recruiterPhone = 'Phone is required';
    }
    if (s === 2) {
      if (!onboard.companyName) newErrors.companyName = 'Company name is required';
      if (!onboard.companyEmail) newErrors.companyEmail = 'Company email is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) setStep((p) => Math.min(3, p + 1));
  };

  const handleBack = () => setStep((p) => Math.max(1, p - 1));

  const handleSubmit = (e) => {
    e.preventDefault();
    // final validation (optional)
    // Here you would send `onboard` to your API
    console.log('Onboarding data:', onboard);
    navigate('/employer/login');
  };

  return (
    <React.Fragment>
      <Navbar />
      <div className="onboard-top-progress">
        <div className="onboard-top-bar">
          <div
            className="onboard-top-fill"
            style={{ width: step === 1 ? '33%' : step === 2 ? '66%' : '100%' }}
          />
        </div>
        {/* step markers removed - only top progress fill remains */}
      </div>
      <div className="emp-auth-container welcome-layout">
        <div className="emp-hero-section welcome-hero">
          <div className="emp-hero-content">
            <div className="emp-hero-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm1 14.5h-2V11h2v5.5zm0-7.5h-2V7h2v2z" fill="currentColor"/>
              </svg>
            </div>
            <h1 className="welcome-title">Welcome to PayOut</h1>
            <p className="welcome-subtitle">We're excited to have you on board. A few quick details will help us tailor your experience.</p>
            <div className="welcome-illustration" aria-hidden>
              <svg width="240" height="140" viewBox="0 0 240 140" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="0" y="0" width="240" height="140" rx="12" fill="rgba(255,255,255,0.08)" />
                <g transform="translate(16,16)">
                  <rect x="0" y="0" width="96" height="64" rx="8" fill="#fff" opacity="0.06" />
                  <rect x="112" y="0" width="96" height="64" rx="8" fill="#fff" opacity="0.06" />
                  <circle cx="48" cy="96" r="16" fill="#fff" opacity="0.06" />
                </g>
              </svg>
            </div>
          </div>
        </div>

        <div className="emp-form-section">
          <div className="emp-form-wrapper onboard-card">
            <div className="onboard-steps" aria-hidden>
              <div className={`step-circle ${step > 1 ? 'completed' : step === 1 ? 'active' : ''}`}>
                {step > 1 ? '✓' : '1'}
              </div>
              <div className={`step-connector ${step > 1 ? 'active' : ''}`} />
              <div className={`step-circle ${step === 2 ? 'active' : step > 2 ? 'completed' : ''}`}>2</div>
              <div className={`step-connector ${step > 2 ? 'active' : ''}`} />
              <div className={`step-circle ${step === 3 ? 'active' : ''}`}>3</div>
            </div>

            <h2 className="onboard-heading">{step === 1 ? 'Recruiter Details' : step === 2 ? 'Company Info' : 'Documents & Verification'}</h2>
            <p className="emp-form-subtitle">{step === 1 ? 'Tell us about the person posting jobs.' : step === 2 ? 'Tell us about your company.' : 'Upload verification documents and optional business info.'}</p>

            <form className="emp-form" onSubmit={handleSubmit}>
              {step === 1 && (
                <div className="step-card">
                  <div className="step-card-header">
                    <div className="header-icon">
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm1 14.5h-2V11h2v5.5zm0-7.5h-2V7h2v2z" fill="#4F46E5"/>
                      </svg>
                    </div>
                    
                    
                  </div>
                  <div className="emp-form-group">
                    <label className="emp-label">Full Name</label>
                    <input name="recruiterName" value={onboard.recruiterName} onChange={handleChange} className={`emp-input ${errors.recruiterName ? 'emp-input-error' : ''}`} />
                    {errors.recruiterName && <span className="emp-error">{errors.recruiterName}</span>}
                  </div>

                  <div className="emp-form-group">
                    <label className="emp-label">Email</label>
                    <input name="recruiterEmail" value={onboard.recruiterEmail} onChange={handleChange} className={`emp-input ${errors.recruiterEmail ? 'emp-input-error' : ''}`} />
                    {errors.recruiterEmail && <span className="emp-error">{errors.recruiterEmail}</span>}
                  </div>

                  <div className="emp-form-group">
                    <label className="emp-label">Phone</label>
                    <input name="recruiterPhone" value={onboard.recruiterPhone} onChange={handleChange} className={`emp-input ${errors.recruiterPhone ? 'emp-input-error' : ''}`} />
                    {errors.recruiterPhone && <span className="emp-error">{errors.recruiterPhone}</span>}
                  </div>

                  <div className="emp-form-group">
                    <label className="emp-label">Designation</label>
                    <select name="designation" value={onboard.designation} onChange={handleChange} className="emp-input">
                      <option value="">Select designation</option>
                      <option value="HR">HR</option>
                      <option value="CEO">CEO</option>
                      <option value="Manager">Manager</option>
                      <option value="Recruiter">Recruiter</option>
                    </select>
                  </div>

                  {/* content only; actions moved outside card */}
                </div>
              )}

              {step === 2 && (
                <div className="step-card">
                  <div className="step-card-header">
                    <div className="header-icon">
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 7V3H2V21H22V7H12ZM6 19H4V17H6V19ZM6 15H4V13H6V15ZM6 11H4V9H6V11ZM6 7H4V5H6V7ZM10 19H8V17H10V19ZM10 15H8V13H10V15ZM10 11H8V9H10V11ZM10 7H8V5H10V7ZM20 19H12V17H14V15H12V13H14V11H12V9H20V19Z" fill="#4F46E5"/>
                      </svg>
                    </div>
                    
                    
                  </div>
                  <div className="emp-form-group">
                    <label className="emp-label">Company Name</label>
                    <input name="companyName" value={onboard.companyName} onChange={handleChange} className={`emp-input ${errors.companyName ? 'emp-input-error' : ''}`} />
                    {errors.companyName && <span className="emp-error">{errors.companyName}</span>}
                  </div>

                  <div className="emp-form-group">
                    <label className="emp-label">Company Email</label>
                    <input name="companyEmail" value={onboard.companyEmail} onChange={handleChange} className={`emp-input ${errors.companyEmail ? 'emp-input-error' : ''}`} />
                    {errors.companyEmail && <span className="emp-error">{errors.companyEmail}</span>}
                  </div>

                  <div className="emp-form-group">
                    <label className="emp-label">Company Type</label>
                    <select name="companyType" value={onboard.companyType} onChange={handleChange} className="emp-input">
                      <option value="">Select type</option>
                      <option value="MNC">MNC</option>
                      <option value="startup">Startup</option>
                      <option value="MSME">MSME</option>
                      <option value="Product Based">Product Based</option>
                      <option value="Service Based">Service Based</option>
                      <option value="government">Government</option>
                    </select>
                  </div>

                  <div className="emp-form-group">
                    <label className="emp-label">Industry</label>
                    <select name="industry" value={onboard.industry} onChange={handleChange} className="emp-input">
                      <option value="">Select industry</option>
                      <option value="Banking">Banking</option>
                      <option value="IT">IT</option>
                      <option value="Finance">Finance</option>
                      <option value="Health care & Pharmaceuticals">Health care & Pharmaceuticals</option>
                      <option value="Education & EdTech">Education & EdTech</option>
                      <option value="Hospitality & Tourism">Hospitality & Tourism</option>
                      <option value="Transportation & Supply Chain">Transportation & Supply Chain</option>
                      <option value="Human Resource">Human Resource</option>
                    </select>
                  </div>

                  <div className="emp-form-group">
                    <label className="emp-label">Establish Year</label>
                    <input name="establishYear" value={onboard.establishYear} onChange={handleChange} className="emp-input" placeholder="e.g., 2010" />
                  </div>

                  <div className="emp-form-group">
                    <label className="emp-label">Location</label>
                    <input name="location" value={onboard.location} onChange={handleChange} className="emp-input" />
                  </div>

                  {/* content only; actions moved outside card */}
                </div>
              )}

              {step === 3 && (
                <div className="step-card onboard-docs">
                  <div className="step-card-header">
                    <div className="header-icon">
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="0" y="0" width="24" height="24" rx="6" fill="#F8FAFF" />
                        <path d="M12 16V8" stroke="#7C3AED" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M8 12L12 8L16 12" stroke="#7C3AED" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M5 20H19" stroke="#C7B3FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    
                    
                  </div>
                    <div className="doc-card">
                      <label className="emp-label">GST Certificate</label>
                      <div className="doc-row">
                        <button type="button" className="choose-btn" onClick={() => document.getElementById('gstFile').click()}>Choose File</button>
                        <span className="doc-filename">{onboard.gstCertificate ? onboard.gstCertificate.name : 'No file chosen'}</span>
                        <input id="gstFile" type="file" name="gstCertificate" onChange={handleFileChange} hidden />
                      </div>
                    </div>

                    <div className="doc-card">
                      <label className="emp-label">Shop Registration Certificate</label>
                      <div className="doc-row">
                        <button type="button" className="choose-btn" onClick={() => document.getElementById('regFile').click()}>Choose File</button>
                        <span className="doc-filename">{onboard.companyRegistration ? onboard.companyRegistration.name : 'No file chosen'}</span>
                        <input id="regFile" type="file" name="companyRegistration" onChange={handleFileChange} hidden />
                      </div>
                    </div>

                    <div className="doc-card">
                      <label className="emp-label">PAN Card</label>
                      <div className="doc-row">
                        <button type="button" className="choose-btn" onClick={() => document.getElementById('panFile').click()}>Choose File</button>
                        <span className="doc-filename">{onboard.panCard ? onboard.panCard.name : 'No file chosen'}</span>
                        <input id="panFile" type="file" name="panCard" onChange={handleFileChange} hidden />
                      </div>
                    </div>

                    <div className="doc-card">
                      <label className="emp-label">Aadhaar Card</label>
                      <div className="doc-row">
                        <button type="button" className="choose-btn" onClick={() => document.getElementById('authFile').click()}>Choose File</button>
                        <span className="doc-filename">{onboard.authorizationLetter ? onboard.authorizationLetter.name : 'No file chosen'}</span>
                        <input id="authFile" type="file" name="authorizationLetter" onChange={handleFileChange} hidden />
                      </div>
                    </div>

                    <div className="business-optional">
                      <h3>Business Information (Optional)</h3>
                      <div className="emp-form-group">
                        <label className="emp-label">GST Number</label>
                        <input name="gstNumber" value={onboard.gstNumber} onChange={handleChange} className="emp-input" />
                      </div>
                      <div className="emp-form-group">
                        <label className="emp-label">PAN Number</label>
                        <input name="panNumber" value={onboard.panNumber} onChange={handleChange} className="emp-input" />
                      </div>
                    </div>

                    {/* content only; actions moved outside card */}
                  </div>
              )}
            </form>

            <div className="onboard-actions">
              <div className="actions-left">
                <button
                  type="button"
                  className={`action-btn ghost ${step === 1 ? 'disabled' : ''}`}
                  onClick={handleBack}
                  disabled={step === 1}
                >
                  &lt; Back
                </button>
              </div>

              <div className="actions-center">
                <button type="button" className="action-btn skip" onClick={() => navigate('/dashboard')}>⏭ Skip for Now</button>
              </div>

              <div className="actions-right">
                {step < 3 ? (
                  <button type="button" className="action-btn primary" onClick={handleNext}>Next ›</button>
                ) : (
                  <button type="button" className="action-btn primary" onClick={(e) => handleSubmit(e)}>Finish</button>
                )}
              </div>
            </div>
            <div className="onboard-info">
              <div className="info-icon" aria-hidden>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" fill="#E6F4FF" />
                  <path d="M11 10h2v6h-2v-6zm0-3h2v2h-2V7z" fill="#0B66FF"/>
                </svg>
              </div>
              <div className="info-content">
                <div className="info-title">Why complete onboarding?</div>
                <div className="info-desc">This helps us provide you with a personalized experience and ensures compliance with business regulations. You can always update this information later in your profile settings.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </React.Fragment>
  );
};

export default EmpWelcome;
