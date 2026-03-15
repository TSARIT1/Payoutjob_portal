import { useEffect, useMemo, useState } from "react";
import { IoIosSearch } from "react-icons/io";
import { IoLocationOutline } from "react-icons/io5";
import { MdWorkOutline } from "react-icons/md";
import { motion } from 'framer-motion';
import {
  FaUniversity,
  FaHome,
  FaUsers,
  FaChartLine,
  FaFileInvoiceDollar,
  FaHeadset,
  FaCalendarAlt,
  FaLaptopCode,
  FaDatabase,
  FaPaintBrush,
  FaBullhorn,
  FaGooglePlay,
  FaApple,
  FaAndroid,
  FaGlobe,
  FaBriefcaseMedical,
  FaIndustry,
  FaTruck,
  FaStore
} from 'react-icons/fa';
import './home.css'
import ImageCarousel from "./components/CompanySlider";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { FiCheckCircle, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const Index = () => {

  const [activeIndex, setActiveIndex] = useState(null);
  const [searchForm, setSearchForm] = useState({ skills: '', location: '', experience: '' });
  const { t } = useLanguage();
  const navigate = useNavigate();

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const handleSearch = () => {
    const skills = searchForm.skills.trim();
    const location = searchForm.location.trim();
    const experience = searchForm.experience.trim();

    let queryParams = [];
    if (skills) queryParams.push(`skills=${encodeURIComponent(skills)}`);
    if (location) queryParams.push(`location=${encodeURIComponent(location)}`);
    if (experience) queryParams.push(`experience=${encodeURIComponent(experience)}`);

    const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
    navigate(`/job${queryString}`);
  };

  const faqs = [
    {
      question: "How do I create an account on PayoutJob?",
      answer: "Creating an account is simple. Click Register, complete your details, and verify your email to start applying as a job seeker in minutes."
    },
    {
      question: "Is PayoutJob free for job seekers?",
      answer: "Yes. PayoutJob is free for job seekers, and employers can start with free job posting tools to begin hiring quickly."
    },
    {
      question: "How can employers post jobs on PayoutJob?",
      answer: "Employers can post jobs by creating an employer account. After verification, you can publish openings from your dashboard and manage applicants in one workflow."
    },
    {
      question: "How do I reset my password?",
      answer: "Click on 'Forgot Password' on the login page. Enter your registered email address and we'll send you a link to reset your password. Make sure to check your spam folder if you don't see our email."
    },
    {
      question: "What types of jobs are available on PayoutJob?",
      answer: "We support opportunities across technology, healthcare, finance, retail, logistics, manufacturing, hospitality, education, operations, creative, and many other sectors. You can filter jobs by category, location, salary range, and job type to find the right match."
    }
  ];



  const data = {
    Skills: [
      'Project Management', 'Operations', 'Accounting', 'Nursing', 'Sales',
      'Supply Chain', 'Digital Marketing', 'Customer Support', 'Teaching', 'Human Resources',
      'Excel', 'Data Analysis', 'Java', 'Python', 'AWS', 'Communication'
    ],
    Location: ['Remote', 'Bangalore', 'Dubai', 'Singapore', 'London'],
    Industry: ['Healthcare', 'Finance', 'Retail', 'Manufacturing', 'Education'],
    Functions: ['Operations', 'Sales', 'Marketing', 'HR', 'Support'],
    Roles: ['Nurse', 'Accountant', 'Store Manager', 'Operations Executive', 'Customer Success Manager'],
    Company: ['Unilever', 'Amazon', 'HSBC', 'Accenture', 'Tata Group'],
  };


const [activeCategory, setActiveCategory] = useState('Skills');

  const servicesCompanyLogos = useMemo(() => ([
    { name: 'Microsoft', short: 'MS', theme: 'blue',   label: 'Global cloud and enterprise hiring',    logo: 'https://logo.clearbit.com/microsoft.com',   openRoles: 1240 },
    { name: 'Google',    short: 'G',   theme: 'amber',  label: 'Product, data, and AI roles',            logo: 'https://logo.clearbit.com/google.com',      openRoles: 860  },
    { name: 'Amazon',    short: 'AM',  theme: 'orange', label: 'Operations and engineering teams',        logo: 'https://logo.clearbit.com/amazon.com',      openRoles: 2100 },
    { name: 'Meta',      short: 'ME',  theme: 'sky',    label: 'Platform and growth opportunities',      logo: 'https://logo.clearbit.com/meta.com',        openRoles: 470  },
    { name: 'Oracle',    short: 'OR',  theme: 'red',    label: 'Enterprise technology positions',         logo: 'https://logo.clearbit.com/oracle.com',      openRoles: 390  },
    { name: 'IBM',       short: 'IBM', theme: 'indigo', label: 'Consulting and infrastructure hiring',    logo: 'https://logo.clearbit.com/ibm.com',         openRoles: 620  },
    { name: 'Accenture', short: 'AC',  theme: 'violet', label: 'Consulting and transformation roles',    logo: 'https://logo.clearbit.com/accenture.com',   openRoles: 1850 },
    { name: 'Infosys',   short: 'IN',  theme: 'cyan',   label: 'Delivery and digital engineering',       logo: 'https://logo.clearbit.com/infosys.com',     openRoles: 940  },
    { name: 'TCS',       short: 'TCS', theme: 'teal',   label: 'Large-scale enterprise projects',         logo: 'https://logo.clearbit.com/tcs.com',         openRoles: 1520 },
    { name: 'Wipro',     short: 'WI',  theme: 'pink',   label: 'Technology and support openings',         logo: 'https://logo.clearbit.com/wipro.com',       openRoles: 680  },
    { name: 'Salesforce',short: 'SF',  theme: 'blue',   label: 'CRM and cloud platform careers',         logo: 'https://logo.clearbit.com/salesforce.com',  openRoles: 430  },
    { name: 'Adobe',     short: 'AD',  theme: 'rose',   label: 'Creative and product innovation',         logo: 'https://logo.clearbit.com/adobe.com',       openRoles: 290  }
  ]), []);


const popular = [
  { name: 'Banking', icon: <FaUniversity /> },
  { name: 'Work From Home', icon: <FaHome /> },
  { name: 'HR', icon: <FaUsers /> },
  { name: 'Sales', icon: <FaChartLine /> },
  { name: 'Accounting', icon: <FaFileInvoiceDollar /> },
  { name: 'Customer Support', icon: <FaHeadset /> },
  { name: 'Event Management', icon: <FaCalendarAlt /> },
  { name: 'Healthcare', icon: <FaBriefcaseMedical /> },
  { name: 'Manufacturing', icon: <FaIndustry /> },
  { name: 'Logistics', icon: <FaTruck /> },
  { name: 'Graphic Design', icon: <FaPaintBrush /> },
  { name: 'Digital Marketing', icon: <FaBullhorn /> },
  { name: 'Retail', icon: <FaStore /> },
]

  const sectorSpotlights = [
    { title: 'Healthcare & Life Sciences',        text: 'Clinical, pharmacy, diagnostics, wellness, and hospital operations roles.',                      icon: <FaBriefcaseMedical /> },
    { title: 'Finance, Banking & Insurance',       text: 'Banking operations, audit, finance, compliance, risk, and insurance careers.',                   icon: <FaFileInvoiceDollar /> },
    { title: 'Retail, E-commerce & FMCG',          text: 'Store operations, merchandising, supply chain, sales, and customer growth jobs.',                 icon: <FaStore /> },
    { title: 'Manufacturing & Logistics',           text: 'Plant operations, procurement, warehouse, transportation, and distribution roles.',               icon: <FaIndustry /> },
    { title: 'Education, Public Sector & Services', text: 'Teaching, administration, skilling, outreach, support, and governance jobs.',                     icon: <FaUniversity /> },
    { title: 'Technology & Digital',               text: 'Engineering, product, data, design, digital marketing, and analytics opportunities.',            icon: <FaLaptopCode /> }
  ];

  const globalReach = [
    'Built for India, Middle East, Southeast Asia, Europe, and remote-first hiring markets',
    'Supports onsite, hybrid, remote, freelance, contract, part-time, and full-time jobs',
    'Works for MNCs, startups, MSMEs, public sector teams, agencies, and enterprises',
    'Suitable for entry-level, experienced, leadership, skilled-trade, and specialist hiring'
  ];

  const testimonials = [
    {
      name: 'Priya Sharma',
      role: 'Software Engineer',
      company: 'TCS',
      avatar: 'https://ui-avatars.com/api/?name=Priya+Sharma&background=1d4ed8&color=fff&size=80&bold=true&rounded=true',
      quote: 'PayoutJob helped me land my dream role in just 3 weeks. The AI-powered CV enhancer made my resume stand out, and the employer communication tools are exceptional.'
    },
    {
      name: 'Rahul Mehta',
      role: 'HR Manager',
      company: 'Accenture',
      avatar: 'https://ui-avatars.com/api/?name=Rahul+Mehta&background=059669&color=fff&size=80&bold=true&rounded=true',
      quote: 'As an employer, finding qualified candidates has never been easier. We posted a listing and received 50+ relevant applications within 48 hours. Absolutely recommend!'
    },
    {
      name: 'Anita Reddy',
      role: 'Registered Nurse',
      company: 'Apollo Hospitals',
      avatar: 'https://ui-avatars.com/api/?name=Anita+Reddy&background=7c3aed&color=fff&size=80&bold=true&rounded=true',
      quote: 'Unlike other portals, PayoutJob is not just for IT. I found multiple healthcare opportunities near me — and the entire process was completely free for job seekers!'
    }
  ];

  const appSupportCards = [
    {
      title: 'Play Store Experience',
      icon: <FaGooglePlay />,
      text: 'Android users can search jobs, track applications, and get AI career insights from a responsive mobile-first flow.'
    },
    {
      title: 'iOS Optimized Flow',
      icon: <FaApple />,
      text: 'Designed for iPhone and iPad with smooth layouts, lightweight interactions, and clear recruiter communication paths.'
    },
    {
      title: 'Android Support',
      icon: <FaAndroid />,
      text: 'Fast loading cards and optimized assets ensure consistent performance across Android devices and network conditions.'
    }
  ];

  const workflowSteps = [
    { title: 'Create Free Profile', detail: 'Set up your job seeker or employer profile in minutes and unlock dashboard workflows.' },
    { title: 'Discover MNC Jobs', detail: 'Search by skills, city, role, and category to discover relevant opportunities quickly.' },
    { title: 'Apply with AI Tools', detail: 'Use autofill, CV enhancement, and tailored recommendations for better application quality.' },
    { title: 'Track and Grow', detail: 'Monitor status updates, recruiter messages, and referral actions from one central portal.' }
  ];

  useEffect(() => {
    document.title = 'PayoutJob - Global Job Portal For All Sectors | Job Seekers & Employers';

    const ensureMeta = (name, content, attr = 'name') => {
      let tag = document.head.querySelector(`meta[${attr}="${name}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(attr, name);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    ensureMeta(
      'description',
      'PayoutJob is a global job portal for all sectors with free employer onboarding, multi-industry hiring, AI tools, and opportunities across healthcare, finance, retail, logistics, technology, education, manufacturing, and more.'
    );
    ensureMeta(
      'keywords',
      'global job portal, all sector jobs, healthcare jobs, finance jobs, retail jobs, logistics jobs, manufacturing jobs, education jobs, remote jobs, free employer job posting'
    );
    ensureMeta('robots', 'index, follow, max-image-preview:large');
    ensureMeta('og:title', 'PayoutJob - Global Job Portal For All Sectors', 'property');
    ensureMeta(
      'og:description',
      'Discover jobs across all sectors worldwide, promote openings, and use AI-powered hiring tools on PayoutJob.',
      'property'
    );
    ensureMeta('og:type', 'website', 'property');
    ensureMeta('og:url', window.location.href, 'property');
    ensureMeta('twitter:card', 'summary_large_image');
    ensureMeta('twitter:title', 'PayoutJob - Global Job Portal For All Sectors');
    ensureMeta(
      'twitter:description',
      'Global job portal for all sectors with AI workflows for job seekers and employers.'
    );

    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', window.location.href);

    const schema = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'PayoutJob',
      url: window.location.origin,
      description: 'Global job portal for all sectors with AI-powered hiring workflow and free employer onboarding.',
      potentialAction: {
        '@type': 'SearchAction',
        target: `${window.location.origin}/job?skills={search_term_string}`,
        'query-input': 'required name=search_term_string'
      }
    };

    let script = document.getElementById('payoutjob-seo-schema');
    if (!script) {
      script = document.createElement('script');
      script.id = 'payoutjob-seo-schema';
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(schema);
  }, []);

  return (
    <>
    <Navbar />
    <div className="home-page">
      <section className="hero-section">
        <div className="container hero-grid">
          <motion.div className="hero-content" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
            <p className="hero-kicker">{t('home.heroKicker')}</p>
            <h1>{t('home.heroTitle')} <span>PayoutJob</span></h1>
            <p>
              {t('home.heroBody')}
            </p>
            <div className="hero-cta">
              <Link className="hero-btn primary" to="/job">{t('home.browseJobs')}</Link>
              <Link className="hero-btn secondary" to="/ai-tools">{t('home.exploreAi')}</Link>
            </div>
          </motion.div>
          <motion.div className="hero-visual-panel" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.08 }}>
            <div className="hero-img-frame">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=580&q=80&auto=format&fit=crop&crop=center"
                alt="Diverse professionals collaborating using PayoutJob global hiring portal"
                className="hero-img"
                loading="eager"
              />
              <div className="hero-img-overlay">
                <span className="hero-badge-pill"><FiCheckCircle /> 100K+ active job seekers</span>
              </div>
            </div>
            <div className="hero-stat-row">
              <div><strong>100K+</strong><span>Active job seekers</span></div>
              <div><strong>5K+</strong><span>Open roles</span></div>
              <div><strong>2K+</strong><span>Hiring companies</span></div>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="container-main">
        <div className="search-containe">
          <div className="box-inputs">
            <label htmlFor="skills" className="group">
              <IoIosSearch className="icon text-zinc-700" />
              <input
                id="skills"
                type="text"
                name="skills"
                value={searchForm.skills}
                onChange={(e) => setSearchForm((prev) => ({ ...prev, skills: e.target.value }))}
                className="sr-input"
                placeholder={t('home.searchSkills')}
              />
            </label>
            <label htmlFor="location" className="group">
              <IoLocationOutline className="icon text-zinc-700" />
              <input
                id="location"
                type="text"
                name="location"
                value={searchForm.location}
                onChange={(e) => setSearchForm((prev) => ({ ...prev, location: e.target.value }))}
                className="sr-input"
                placeholder={t('home.searchLocation')}
              />
            </label>
            <label htmlFor="experience" className="group">
              <MdWorkOutline className="icon text-zinc-700" />
              <input
                id="experience"
                type="text"
                name="experience"
                value={searchForm.experience}
                onChange={(e) => setSearchForm((prev) => ({ ...prev, experience: e.target.value }))}
                className="sr-input"
                placeholder={t('home.searchExperience')}
              />
            </label>
            <div className="box-btns">
              <button className="buttton-search bg-blue-600 hover:bg-blue-500 cursor-pointer text-amber-50 p-3" onClick={handleSearch}>{t('home.searchButton')}</button>
            </div>
          </div>
        </div>
      </div>

      <section className="top-benefits container">
        <article className="benefit-card">
          <FiCheckCircle />
          <h3>{t('home.benefit1Title')}</h3>
          <p>{t('home.benefit1Text')}</p>
        </article>
        <article className="benefit-card">
          <FiCheckCircle />
          <h3>{t('home.benefit2Title')}</h3>
          <p>{t('home.benefit2Text')}</p>
        </article>
        <article className="benefit-card">
          <FiCheckCircle />
          <h3>{t('home.benefit3Title')}</h3>
          <p>{t('home.benefit3Text')}</p>
        </article>
      </section>

      <section className="sector-showcase container">
        <div className="section-copy">
          <p className="section-eyebrow">All Sectors Supported</p>
          <h2>Not only IT. Built for every major industry.</h2>
          <p>PayoutJob supports hiring and job discovery across healthcare, finance, retail, education, logistics, manufacturing, hospitality, public services, operations, and digital roles worldwide.</p>
        </div>
        <div className="sector-grid">
          {sectorSpotlights.map((sector) => (
            <article className="sector-card" key={sector.title}>
              <span className="sector-card-icon">{sector.icon}</span>
              <h3>{sector.title}</h3>
              <p>{sector.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="global-reach container">
        <div className="section-copy">
          <p className="section-eyebrow">Global Ready</p>
          <h2>Built for global hiring requirements</h2>
          <p>From local hiring in India to international and remote recruitment, the platform is positioned for worldwide job promotion, sector diversity, and scalable employer adoption.</p>
        </div>
        <div className="global-reach-card">
          <div className="global-reach-icon"><FaGlobe /></div>
          <ul>
            {globalReach.map((item) => (
              <li key={item}><FiCheckCircle /> {item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="company-showcase container">
        <div className="section-copy company-copy">
          <p className="section-eyebrow">{t('home.companyEyebrow')}</p>
          <h2>{t('home.companyTitle')}</h2>
          <p>
            {t('home.companyBody')}
          </p>
        </div>
        <div className="company-section-card">
          <ImageCarousel images={servicesCompanyLogos} />
        </div>
        <div className="company-notes">
          <span>{t('home.companyNote1')}</span>
          <span>{t('home.companyNote2')}</span>
          <span>{t('home.companyNote3')}</span>
        </div>
      </section>
    </div>

      <section className="p-category category-shell">
        <div className="section-copy">
          <p className="section-eyebrow">{t('home.categoriesEyebrow')}</p>
          <h2 className="text-center text-2xl font-medium heading">{t('home.categoriesTitle')}</h2>
          <p>{t('home.categoriesBody')}</p>
        </div>
        <div className="pc-main">
      {
        popular.map((pop,index) => (
          <Link to={`/job?category=${encodeURIComponent(pop.name)}`} key={index} className="catefory-link">
            <div className="catefory">
              <span className="items-ct cursor-pointer">
                <i className="bg-blue-200 text-blue-700 icons-cat ">{pop.icon}</i> {pop.name}
              </span>
            </div>
          </Link>
        ))
      }
        </div>
      </section>

      <section className="workflow container">
        <div className="workflow-head">
          <h2>{t('home.workflowTitle')}</h2>
          <p>{t('home.workflowBody')}</p>
        </div>
        <div className="workflow-grid">
          {workflowSteps.map((step, index) => (
            <article className="workflow-card" key={step.title}>
              <span className="workflow-index">0{index + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="app-support container">
        <div className="app-support-head">
          <h2>{t('home.appTitle')}</h2>
          <p>{t('home.appBody')}</p>
        </div>
        <div className="app-support-grid">
          {appSupportCards.map((card) => (
            <article className="app-card" key={card.title}>
              <span className="app-icon">{card.icon}</span>
              <h3>{card.title}</h3>
              <p>{card.text}</p>
            </article>
          ))}
        </div>
      </section>



     <div className="fvc-container">
      <h1 className="fvc-heading">{t('home.categoryFinderTitle')}</h1>

      <div className="fvc-tabs">
        {Object.keys(data).map(category => (
          <button
            key={category}
            className={`fvc-tab ${activeCategory === category ? 'active' : ''}`}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="fvc-category-content">
        <h2 className="fvc-subheading">{activeCategory}</h2>
        <div className="fvc-tags">
          {data[activeCategory].map(item => (
            <Link
              to={`/job?${activeCategory.toLowerCase()}=${encodeURIComponent(item)}`}
              key={item}
              className={`fvc-tag fvc-${activeCategory.toLowerCase()}`}
            >
              {item}
            </Link>
          ))}
        </div>
      </div>
    </div>


      <section className="faq-section">
      <div className="faq-shell">
        <div className="section-copy faq-copy">
          <p className="section-eyebrow">{t('home.faqEyebrow')}</p>
          <h2 className="faq-section-title">{t('home.faqTitle')}</h2>
          <p>{t('home.faqBody')}</p>
        </div>
      <div className="faq-container">
        <div className="faq-container">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`faq-item ${activeIndex === index ? 'active' : ''}`}
              onClick={() => toggleFAQ(index)}
            >
              <div className="faq-question">
                <h3>{faq.question}</h3>
                {activeIndex === index ? <FiChevronUp /> : <FiChevronDown />}
              </div>
              <div className="faq-answer">
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      </div>
    </section>

      <section className="testimonials-section container">
        <div className="section-copy">
          <p className="section-eyebrow">Real Stories</p>
          <h2>Trusted by job seekers and employers worldwide</h2>
          <p>Thousands of professionals across every sector and country use PayoutJob to find the right opportunity or the right hire — for free.</p>
        </div>
        <div className="testimonials-grid">
          {testimonials.map((tm) => (
            <article className="testimonial-card" key={tm.name}>
              <p className="testimonial-quote">&ldquo;{tm.quote}&rdquo;</p>
              <div className="testimonial-author">
                <img src={tm.avatar} alt={tm.name} className="testimonial-avatar" loading="lazy" width="46" height="46" />
                <div>
                  <strong>{tm.name}</strong>
                  <span>{tm.role} &middot; {tm.company}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Index;
