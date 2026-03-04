import { useState } from "react";
import { IoIosSearch } from "react-icons/io";
import { IoLocationOutline } from "react-icons/io5";
import { MdWorkOutline } from "react-icons/md";
import { motion } from 'framer-motion';
import { FaUniversity, FaHome, FaUsers, FaChartLine, FaFileInvoiceDollar, FaHeadset, FaCalendarAlt, FaLaptopCode, FaDatabase,  FaPaintBrush, FaBullhorn } from 'react-icons/fa';
import { GrOracle } from "react-icons/gr";
import './home.css'
import ImageCarousel from "./components/CompanySlider";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';

const Index = () => {

  const [activeIndex, setActiveIndex] = useState(null);
  const navigate = useNavigate();

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const handleSearch = () => {
    const skillsInput = document.querySelector('input[name="skills"]');
    const locationInput = document.querySelector('input[name="location"]');
    const experienceInput = document.querySelector('input[name="experience"]');

    const skills = skillsInput?.value || '';
    const location = locationInput?.value || '';
    const experience = experienceInput?.value || '';

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
      answer: "Creating an account is simple! Click on the 'Register' button in the top right corner, fill in your details, and verify your email address. You'll be ready to start your job search in minutes."
    },
    {
      question: "Is PayoutJob free for job seekers?",
      answer: "Yes, PayoutJob is completely free for job seekers. You can browse jobs, create a profile, and apply to positions without any charges."
    },
    {
      question: "How can employers post jobs on PayoutJob?",
      answer: "Employers can post jobs by signing up for an employer account. After verification, you can post job listings through your dashboard. We offer various posting packages to suit your hiring needs."
    },
    {
      question: "How do I reset my password?",
      answer: "Click on 'Forgot Password' on the login page. Enter your registered email address and we'll send you a link to reset your password. Make sure to check your spam folder if you don't see our email."
    },
    {
      question: "What types of jobs are available on PayoutJob?",
      answer: "We list opportunities across various industries including technology, finance, healthcare, marketing, and more. You can filter jobs by category, location, salary range, and job type to find the perfect match."
    }
  ];



  const data = {
  Skills: [
    'Python', 'Sql', 'Java', 'AWS', 'Javascript', 'Git', 'Excel', 'Azure',
    'Docker', 'Kubernetes', 'Sales', 'Data Analysis', 'Ms Office',
    'CSS', 'HTML', 'Jenkins', 'Project Management', 'Gcp', 'Linux', 'React'
  ],
  Location: ['Remote', 'Bangalore', 'Hyderabad', 'Mumbai', 'Chennai'],
  Industry: ['IT', 'Healthcare', 'Finance', 'Education', 'E-commerce'],
  Functions: ['Engineering', 'Sales', 'Marketing', 'HR', 'Support'],
  Roles: ['Frontend Developer', 'Backend Developer', 'Project Manager', 'DevOps Engineer'],
  Company: ['Google', 'Amazon', 'Infosys', 'TCS', 'Accenture'],
};


const [activeCategory, setActiveCategory] = useState('Skills');


   const servicesCompanyLogos = [
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSupyFRhX2LJ5AwZkx8Q1BJx62R6BnpOG4F4w&s",  //microsoft
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWoGbcL2aKMrpLeMrSbDOXs4sGXDZQm3osOA&s",
  "https://www.3ds.com/fileadmin/depositary/alliances/CRM_SITELOGO/20201200/100000000003019_1wipro-logo-digital-rgb.png",
  "https://w7.pngwing.com/pngs/898/916/png-transparent-oracle-corporation-logo-computer-software-business-company-logo-miscellaneous-angle-company.png",
  "https://img.favpng.com/15/5/15/ibm-logo-png-favpng-phEGANqnq0caSRVx94UXGLgqU.jpg",
 "https://img.favpng.com/17/9/8/laptop-lenovo-logo-inteconnex-computer-software-png-favpng-J926mJSX94aTKr0Bv3Qr5wi3H.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Infosys_BPM_Logo.svg/430px-Infosys_BPM_Logo.svg.png",
  "https://w7.pngwing.com/pngs/176/854/png-transparent-dell-laptop-logo-brand-printer-software-branding-blue-angle-text-thumbnail.png",
  "https://img.favpng.com/24/1/24/tibco-software-spotfire-computer-software-business-intelligence-png-favpng-WF5w6X0WusMXypw6uAtSrAXu4.jpg",

  "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
  "https://w7.pngwing.com/pngs/772/151/png-transparent-blender-logo-tech-companies-thumbnail.png",
  "https://www.freepnglogos.com/uploads/google-logo-png/google-logo-png-google-sva-scholarship-20.png",
  "https://e7.pngegg.com/pngimages/769/65/png-clipart-salesforce-com-organization-customer-relationship-management-logo-siebel-systems-business-love-blue.png",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfMOnJ1LiORppUWyiROwTOHL2vhbNdQQA55A&sg",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxZSMo7cDUX38y07l0DctP1IehaAmF5qETxA&s",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Meta-Logo.png/2560px-Meta-Logo.png",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQiJ2AlJYe7dz3rxlLOeAi71ZneEQA81P2jng&s",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Omega_Logo.svg/1280px-Omega_Logo.svg.png",
    
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTPAWYqoR1E-YMPwd869I0X2WuToOjTrPXgQ&s",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Accenture.svg/2560px-Accenture.svg.png"
   ]


const popular = [
  { name: 'Banking', icon: <FaUniversity /> },
  { name: 'Work From Home', icon: <FaHome /> },
  { name: 'HR', icon: <FaUsers /> },
  { name: 'Sales', icon: <FaChartLine /> },
  { name: 'Accounting', icon: <FaFileInvoiceDollar /> },
  { name: 'Customer Support', icon: <FaHeadset /> },
  { name: 'Event Management', icon: <FaCalendarAlt /> },
  { name: 'IT', icon: <FaLaptopCode /> },
  { name: 'SQL', icon: <FaDatabase /> },
  { name: 'Oracle', icon: <GrOracle /> },
  { name: 'Graphic Design', icon: <FaPaintBrush /> },
  { name: 'Digital Marketing', icon: <FaBullhorn /> },
]

  return (
    <>
    <Navbar />
    <div className="home-page">

        <section className="hero-section">
          <div className="container">
            <motion.div  className="hero-content">
              <h1>Find Your <span>Dream Job</span> Today</h1>
              <p>Thousands of jobs in the computer, engineering and technology sectors are waiting for you.</p>
            </motion.div>
          </div>
        </section>
      
    </div>

      <div className="container-main">
        <div className="search-containe">
          <div className="box-inputs">
            <label htmlFor="" className="group ">
             <IoIosSearch className="icon text-zinc-700"/>  <input type="text" name="skills" className="sr-input w-sm" placeholder="Search By Skills or Any Company..." />
            </label>
          <label htmlFor="" className="group">
           <IoLocationOutline className="icon text-zinc-700"/> <input type="text" name="location" className="sr-input" placeholder="Search by location"/>
          </label>
            <label htmlFor="" className="group">
            <MdWorkOutline className="icon text-zinc-700"/>  <input type="text" name="experience" className="sr-input" placeholder="Expirience"/>
            </label>
          <div className="box-btns">
            <button className="buttton-search bg-blue-600 hover:bg-blue-500 cursor-pointer text-amber-50 p-3" onClick={handleSearch}>Search</button>
          </div>
          </div>
        </div>
      </div>
      <div className="st-companies">
        <h1 className="text-center text-2xl font-medium heading">Featured Companies</h1>
        <div className="">
   
      <ImageCarousel images={servicesCompanyLogos} />

     
    </div>
    
      </div>
      <div className="p-category">
        <h1 className="text-center text-2xl font-medium heading">Popular Categories</h1>
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
      </div>



     <div className="fvc-container">
      <h1 className="fvc-heading">Find Jobs by Category</h1>

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
      <div className="faq-container">
        <h2 className="faq-section-title">Frequently Asked Questions</h2>
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
    </section>
      <Footer />
    </>
  );
};

export default Index;
