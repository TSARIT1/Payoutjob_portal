import React from 'react';
import { FaLinkedin, FaTwitter, FaFacebook, FaInstagram, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';
import { useLanguage } from '../../contexts/LanguageContext';
import './Footer.css';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-brand">
            <h2 className="logo">Payout<span>Job</span></h2>
            <p className="tagline">{t('footer.tagline')}</p>
            <div className="social-links">
              <a href="https://www.linkedin.com/company/tsarit-services" aria-label="LinkedIn" target="_blank" rel="noreferrer"><FaLinkedin /></a>
              <a href="https://twitter.com" aria-label="Twitter" target="_blank" rel="noreferrer"><FaTwitter /></a>
              <a href="https://facebook.com" aria-label="Facebook" target="_blank" rel="noreferrer"><FaFacebook /></a>
              <a href="https://instagram.com" aria-label="Instagram" target="_blank" rel="noreferrer"><FaInstagram /></a>
            </div>
          </div>

          <div className="footer-links">
            <div className="links-column">
              <h3>{t('footer.seekers')}</h3>
              <ul>
                <li><a href="/jobs">{t('footer.browseJobs')}</a></li>
                <li><a href="/companies">{t('footer.companies')}</a></li>
                <li><a href="/blogs">{t('footer.careerAdvice')}</a></li>
                <li><a href="/ai-tools">{t('footer.resumeBuilder')}</a></li>
              </ul>
            </div>

            <div className="links-column">
              <h3>{t('footer.employers')}</h3>
              <ul>
                <li><a href="/dashboard">{t('footer.browseCandidates')}</a></li>
                <li><a href="/employer/register">{t('footer.pricing')}</a></li>
                <li><a href="/tracker/employer">{t('footer.recruiting')}</a></li>
              </ul>
            </div>

            <div className="links-column">
              <h3>{t('footer.company')}</h3>
              <ul>
                <li><a href="/">{t('footer.about')}</a></li>
                <li><a href="/contact">{t('footer.contact')}</a></li>
                <li><a href="/blogs">{t('footer.blog')}</a></li>
                <li><a href="/admin/login">Super Admin</a></li>
              </ul>
            </div>

            <div className="links-column">
              <h3>{t('footer.support')}</h3>
              <ul>
                <li><a href="/contact">{t('footer.help')}</a></li>
                <li><a href="/">{t('footer.faq')}</a></li>
                <li><a href="/">{t('footer.privacy')}</a></li>
                <li><a href="/">{t('footer.terms')}</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="contact-info">
          <div className="contact-item">
            <FaMapMarkerAlt className="contact-icon" />
            <span>
              12-203/745, Church Street, Nakkabanda,
              <br />
              Punganur, Madanapalle, Chittoor - 517247,
              <br />
              Andhra Pradesh, India
            </span>
          </div>
          <div className="contact-item">
            <FaPhone className="contact-icon" />
            <span>+91 94913 01258</span>
          </div>
          <div className="contact-item">
            <FaEnvelope className="contact-icon" />
            <span>info@tsaritservices.com</span>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            &copy; {new Date().getFullYear()} PayoutJob. Designed, manufactured and operated by TSAR IT SERVICES.
            All rights reserved. https://www.tsaritservices.com
          </p>
          <div className="payment-methods">
            <span>{t('footer.rights')}</span>
            <div className="payment-icons">
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;