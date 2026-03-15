export const demoCredentials = {
  student: {
    email: 'student@payoutjob.com',
    password: 'Payout@123'
  },
  employer: {
    email: 'employer@payoutjob.com',
    password: 'Payout@123'
  },
  admin: {
    email: 'admin@payoutjob.com',
    password: 'Payout@123'
  }
};

export const demoUsers = {
  student: {
    role: 'Student',
    fullName: 'Aarav Sharma',
    email: demoCredentials.student.email,
    phone: '+91 9876543210',
    university: 'Delhi Technological University',
    title: 'Frontend Developer',
    location: 'Bangalore, India',
    profile: {
      personalInfo: {
        name: 'Aarav Sharma',
        headline: 'Frontend Developer | React | UX-focused',
        location: 'Bangalore, India',
        email: demoCredentials.student.email,
        phone: '+91 9876543210',
        image: '',
        dob: '2000-08-12',
        gender: 'Male',
        maritalStatus: 'Single'
      },
      careerProfile: {
        summary: 'Frontend engineer focused on polished product experiences, accessible design systems, and practical performance improvements.',
        currentIndustry: 'Software Products',
        functionalArea: 'Engineering',
        role: 'Frontend Developer',
        jobType: 'Permanent',
        employmentType: 'Full Time',
        desiredSalary: '18,00,000',
        desiredLocation: 'Bangalore',
        noticePeriod: '30 days'
      },
      education: [
        {
          degree: 'Bachelor of Technology in Computer Science',
          university: 'Delhi Technological University',
          year: '2018 - 2022',
          completed: true,
          grade: '8.7 CGPA'
        }
      ],
      experience: [
        {
          title: 'Frontend Developer',
          company: 'BrightStack Labs',
          duration: '2022 - Present',
          description: 'Built React interfaces, improved Lighthouse scores, and partnered with design on reusable UI patterns.'
        }
      ],
      projects: [
        {
          title: 'Hiring Analytics Dashboard',
          description: 'Interactive dashboards for recruiters with React and chart visualizations.',
          technologies: ['React', 'Node.js', 'Charts']
        }
      ],
      skills: ['React', 'JavaScript', 'Node.js', 'HTML', 'CSS', 'SQL'],
      languages: [
        { name: 'English', proficiency: 'Fluent' },
        { name: 'Hindi', proficiency: 'Native' }
      ],
      socialLinks: {
        linkedin: 'https://linkedin.com/in/aarav-sharma',
        github: 'https://github.com/aaravsharma',
        twitter: '',
        portfolio: 'https://aarav.dev'
      },
      resume: null
    },
    profileCompletion: 86,
    profileCompleted: true
  },
  employer: {
    role: 'Employer',
    fullName: 'Neha Kapoor',
    email: demoCredentials.employer.email,
    phone: '+91 9988776655',
    companyName: 'Northstar Talent Labs',
    companySlug: 'northstar-talent-labs',
    externalApiKey: 'pst_live_northstar_2026',
    title: 'Talent Acquisition Lead',
    location: 'Bangalore, India',
    profile: {
      name: 'Northstar Talent Labs',
      industry: 'Human Capital Technology',
      size: '201-500 employees',
      website: 'https://northstarlabs.example.com',
      location: 'Bangalore, India',
      logo: '',
      description: 'Northstar Talent Labs helps fast-growing product companies scale engineering, design, and operations teams.',
      contactEmail: demoCredentials.employer.email,
      contactPhone: '+91 9988776655',
      companyType: 'Private',
      yearEstablished: '2018',
      registrationNumber: 'NSTL-2018-IND',
      headOfficeLocation: 'Bangalore',
      branchLocations: 'Pune, Hyderabad',
      country: 'India',
      stateRegion: 'Karnataka',
      city: 'Bangalore',
      pinCode: '560001',
      address: 'MG Road, Bangalore',
      googleMapsLink: '',
      hrName: 'Neha Kapoor',
      officialEmail: demoCredentials.employer.email,
      altEmail: 'careers@northstarlabs.example.com',
      mobileNumber: '+91 9988776655',
      altPhone: '+91 9988776611',
      designation: 'Talent Acquisition Lead',
      linkedin: 'https://linkedin.com/company/northstarlabs',
      facebook: '',
      twitter: '',
      instagram: '',
      shortDescription: 'Hiring product, design, and engineering talent across India.',
      detailedOverview: 'We partner with product-led organizations to build lean, high-performing teams with structured hiring operations.',
      missionVision: 'Mission: make hiring faster and fairer. Vision: become the most trusted talent operations partner for digital businesses.',
      servicesProducts: 'Recruitment operations, employer branding, talent intelligence',
      workCultureNotes: 'Remote-friendly, outcome-driven, and deeply collaborative.',
      dashboardPreferences: {
        theme: 'light',
        lastLogin: null
      }
    },
    profileCompletion: 92,
    profileCompleted: true
  },
  admin: {
    role: 'Admin',
    fullName: 'TSAR Platform Admin',
    email: demoCredentials.admin.email,
    phone: '+91 9491301258',
    title: 'Super Admin',
    location: 'Andhra Pradesh, India',
    profile: {
      personalInfo: {
        name: 'TSAR Platform Admin',
        headline: 'Global Platform Operations',
        location: 'Andhra Pradesh, India',
        email: demoCredentials.admin.email,
        phone: '+91 9491301258',
        image: ''
      },
      dashboardPreferences: {
        theme: 'light',
        lastLogin: null
      }
    },
    profileCompletion: 100,
    profileCompleted: true
  }
};

export const demoJobs = [
  {
    title: 'Senior Frontend Developer',
    department: 'Engineering',
    location: 'Bangalore, India',
    type: 'Full-time',
    status: 'active',
    salary: '₹18 LPA - ₹24 LPA',
    experience: '3-5 years',
    description: 'Build polished user interfaces for high-growth SaaS products and collaborate with product, design, and platform teams.',
    requirements: 'React, TypeScript, performance optimization, design systems'
  },
  {
    title: 'Product Designer',
    department: 'Design',
    location: 'Remote',
    type: 'Full-time',
    status: 'active',
    salary: '₹14 LPA - ₹20 LPA',
    experience: '2-4 years',
    description: 'Own product discovery, flows, and interface quality for web and mobile experiences.',
    requirements: 'Figma, UX research, prototyping, stakeholder communication'
  },
  {
    title: 'Operations Analyst',
    department: 'Operations',
    location: 'Pune, India',
    type: 'Full-time',
    status: 'draft',
    salary: '₹8 LPA - ₹12 LPA',
    experience: '1-3 years',
    description: 'Improve reporting, workflows, and hiring operations processes across teams.',
    requirements: 'SQL, spreadsheets, reporting, process improvement'
  },
  {
    title: 'Graduate Software Intern',
    department: 'Engineering',
    location: 'Hybrid',
    type: 'Internship',
    status: 'active',
    salary: '₹35,000 per month',
    experience: 'Fresher',
    description: 'Hands-on internship for final-year students interested in frontend and API development.',
    requirements: 'JavaScript, React basics, communication, eagerness to learn'
  }
];

export const demoApplications = [
  {
    jobIndex: 0,
    status: 'review',
    candidateNote: 'I have built recruiter-facing dashboards and reusable component libraries.',
    recruiterNote: 'Strong frontend depth and good product sense.'
  },
  {
    jobIndex: 1,
    status: 'interview',
    candidateNote: 'Interested in design systems and research-led product work.',
    recruiterNote: 'Schedule portfolio walkthrough this week.'
  }
];
