import React from 'react';
import { FaLinkedin, FaTwitter, FaFacebook, FaInstagram, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';
import { useLanguage } from '../../contexts/LanguageContext';
import './Footer.css';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Top Section */}
        <div className="footer-top">
          <div className="footer-brand">
            <h2 className="logo">Payout<span>Job</span></h2>
            <p className="tagline">{t('footer.tagline')}</p>
            <div className="social-links">
              <a href="https://linkedin.com" aria-label="LinkedIn"><FaLinkedin /></a>
              <a href="https://twitter.com" aria-label="Twitter"><FaTwitter /></a>
              <a href="https://facebook.com" aria-label="Facebook"><FaFacebook /></a>
              <a href="https://instagram.com" aria-label="Instagram"><FaInstagram /></a>
            </div>
          </div>

          <div className="footer-links">
            <div className="links-column">
              <h3>{t('footer.seekers')}</h3>
              <ul>
                <li><a href="/jobs">{t('footer.browseJobs')}</a></li>
                <li><a href="/companies">{t('footer.companies')}</a></li>
                <li><a href="/career-advice">{t('footer.careerAdvice')}</a></li>
                <li><a href="/resume-builder">{t('footer.resumeBuilder')}</a></li>
              </ul>
            </div>

            <div className="links-column">
              <h3>{t('footer.employers')}</h3>
              <ul>
              <li><a href="/browse-candidates">{t('footer.browseCandidates')}</a></li>
              <li><a href="/pricing">{t('footer.pricing')}</a></li>
              <li><a href="/recruiting-solutions">{t('footer.recruiting')}</a></li>
            </ul>
          </div>

          <div className="links-column">
            <h3>{t('footer.company')}</h3>
            <ul>
              <li><a href="/about">{t('footer.about')}</a></li>
              <li><a href="/contact">{t('footer.contact')}</a></li>
              <li><a href="/blog">{t('footer.blog')}</a></li>
              <li><a href="/careers">{t('footer.careers')}</a></li>
            </ul>
          </div>

          <div className="links-column">
            <h3>{t('footer.support')}</h3>
            <ul>
              <li><a href="/help-center">{t('footer.help')}</a></li>
              <li><a href="/faq">{t('footer.faq')}</a></li>
              <li><a href="/privacy-policy">{t('footer.privacy')}</a></li>
              <li><a href="/terms">{t('footer.terms')}</a></li>
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
        <p>&copy; {new Date().getFullYear()} PayoutJob. {t('footer.rights')}</p>
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