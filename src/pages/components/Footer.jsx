import React from 'react';
import { FaLinkedin, FaTwitter, FaFacebook, FaInstagram, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Top Section */}
        <div className="footer-top">
          <div className="footer-brand">
            <h2 className="logo">Payout<span>Job</span></h2>
            <p className="tagline">Connecting talent with opportunity</p>
            <div className="social-links">
              <a href="https://linkedin.com" aria-label="LinkedIn"><FaLinkedin /></a>
              <a href="https://twitter.com" aria-label="Twitter"><FaTwitter /></a>
              <a href="https://facebook.com" aria-label="Facebook"><FaFacebook /></a>
              <a href="https://instagram.com" aria-label="Instagram"><FaInstagram /></a>
            </div>
          </div>

          <div className="footer-links">
            <div className="links-column">
              <h3>For Job Seekers</h3>
              <ul>
                <li><a href="/jobs">Browse Jobs</a></li>
                <li><a href="/companies">Companies</a></li>
                <li><a href="/career-advice">Career Advice</a></li>
                <li><a href="/resume-builder">Resume Builder</a></li>
              </ul>
            </div>

            <div className="links-column">
              <h3>For Employers</h3>
              <ul>
              <li><a href="/browse-candidates">Browse Candidates</a></li>
              <li><a href="/pricing">Pricing Plans</a></li>
              <li><a href="/recruiting-solutions">Recruiting Solutions</a></li>
            </ul>
          </div>

          <div className="links-column">
            <h3>Company</h3>
            <ul>
              <li><a href="/about">About Us</a></li>
              <li><a href="/contact">Contact Us</a></li>
              <li><a href="/blog">Blog</a></li>
              <li><a href="/careers">Careers</a></li>
            </ul>
          </div>

          <div className="links-column">
            <h3>Support</h3>
            <ul>
              <li><a href="/help-center">Help Center</a></li>
              <li><a href="/faq">FAQs</a></li>
              <li><a href="/privacy-policy">Privacy Policy</a></li>
              <li><a href="/terms">Terms of Service</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="contact-info">
        <div className="contact-item">
          <FaMapMarkerAlt className="contact-icon" />
          <span>12-203/745, CHURCH STREET, NAKKABANDA, <br />
Punganur, Madanapalle, Chittoor- 517247, <br />
Andhra Pradesh, India</span>
        </div>
        <div className="contact-item">
          <FaPhone className="contact-icon" />
          <span>+91 94913 01258</span>
        </div>
        <div className="contact-item">
          <FaEnvelope className="contact-icon" />
          <span>tsarit@tsaritservices.com</span>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} PayoutJob. All rights reserved.</p>
        <div className="payment-methods">
          <span></span>
          <div className="payment-icons">
            
          </div>
        </div>
      </div>
    </div>
  </footer>
  );
};

export default Footer;