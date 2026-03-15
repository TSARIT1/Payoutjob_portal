import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const translations = {
  en: {
    languageLabel: 'Language',
    nav: {
      home: 'Home',
      aiTools: 'AI Tools',
      jobs: 'Jobs',
      companies: 'Companies',
      forEmployers: 'For Employers',
      login: 'Login',
      register: 'Register',
      theme: 'Theme',
      light: 'Light mode',
      dark: 'Dark mode',
    },
    home: {
      heroKicker: 'Free For Job Seekers And Employers',
      heroTitle: 'Build a smarter hiring workflow with',
      heroBody: 'Beautiful and professional job discovery with AI-assisted tools, recruiter dashboards, and smooth mobile-ready workflows.',
      browseJobs: 'Browse Jobs',
      exploreAi: 'Explore AI Tools',
      statsTitle: 'Professional + Smooth',
      statCandidates: 'Active candidates',
      statRoles: 'Open roles',
      statCompanies: 'Hiring companies',
      statsBody: 'Designed for both job seekers and employers with polished UI cards, free onboarding, clear actions, and reliable performance.',
      searchSkills: 'Skills or company',
      searchLocation: 'Location',
      searchExperience: 'Experience',
      searchButton: 'Search Jobs',
      benefit1Title: 'Free for Job Seekers',
      benefit1Text: 'Register and apply without subscription costs as a job seeker.',
      benefit2Title: 'Free for Employers to Start',
      benefit2Text: 'Employers can start posting jobs for free, then manage applicants and communication from one dashboard.',
      benefit3Title: 'AI Enhanced Workflow',
      benefit3Text: 'Tailored resume support, CV checks, and referral insights built-in.',
      companyEyebrow: 'Trusted Hiring Network',
      companyTitle: 'Top MNC companies and fast-growing brands',
      companyBody: 'Explore opportunities from recognized employers with a cleaner logo wall, stronger visibility, and a hiring experience that feels credible from the first screen.',
      companyNote1: 'Free employer onboarding',
      companyNote2: 'Professional job seeker experience',
      companyNote3: 'Reliable AI-assisted workflow',
      categoriesEyebrow: 'Popular Paths',
      categoriesTitle: 'Popular Categories',
      categoriesBody: 'Browse high-intent categories that help job seekers and employers move faster.',
      workflowTitle: 'Smooth Job Workflow',
      workflowBody: 'Move from search to hiring with a clean, guided, and professional process.',
      appTitle: 'Play Store, Android, and iOS Support',
      appBody: 'Cross-platform ready UI experience for mobile users and recruiters on the go.',
      categoryFinderTitle: 'Find Jobs by Category',
      faqEyebrow: 'Need Answers Fast',
      faqTitle: 'Frequently Asked Questions',
      faqBody: 'Clear guidance for job seekers and employers using the portal for free.'
    },
    footer: {
      tagline: 'Connecting talent with opportunity',
      seekers: 'For Job Seekers',
      employers: 'For Employers',
      company: 'Company',
      support: 'Support',
      browseJobs: 'Browse Jobs',
      companies: 'Companies',
      careerAdvice: 'Career Advice',
      resumeBuilder: 'Resume Builder',
      browseCandidates: 'Browse Candidates',
      pricing: 'Pricing Plans',
      recruiting: 'Recruiting Solutions',
      about: 'About Us',
      contact: 'Contact Us',
      blog: 'Blog',
      careers: 'Careers',
      help: 'Help Center',
      faq: 'FAQs',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      rights: 'All rights reserved.'
    }
  },
  hi: {
    languageLabel: 'भाषा',
    nav: {
      home: 'होम', aiTools: 'एआई टूल्स', jobs: 'नौकरियां', companies: 'कंपनियां', forEmployers: 'नियोक्ताओं के लिए', login: 'लॉगिन', register: 'रजिस्टर', theme: 'थीम', light: 'लाइट मोड', dark: 'डार्क मोड'
    },
    home: {
      heroKicker: 'जॉब सीकर और नियोक्ताओं के लिए मुफ्त', heroTitle: 'PayoutJob के साथ बेहतर हायरिंग वर्कफ़्लो बनाएं', heroBody: 'एआई टूल्स, रिक्रूटर डैशबोर्ड और मोबाइल-रेडी अनुभव के साथ प्रोफेशनल जॉब डिस्कवरी।', browseJobs: 'नौकरियां देखें', exploreAi: 'एआई टूल्स देखें', statsTitle: 'प्रोफेशनल + स्मूद', statCandidates: 'सक्रिय उम्मीदवार', statRoles: 'खुली भूमिकाएं', statCompanies: 'हायरिंग कंपनियां', statsBody: 'जॉब सीकर और नियोक्ताओं दोनों के लिए स्पष्ट और विश्वसनीय अनुभव।', searchSkills: 'स्किल या कंपनी', searchLocation: 'लोकेशन', searchExperience: 'अनुभव', searchButton: 'नौकरियां खोजें', benefit1Title: 'जॉब सीकर के लिए मुफ्त', benefit1Text: 'जॉब सीकर के रूप में बिना शुल्क रजिस्टर करें और आवेदन करें।', benefit2Title: 'नियोक्ताओं के लिए शुरुआत मुफ्त', benefit2Text: 'नियोक्ता मुफ्त में जॉब पोस्ट करना शुरू कर सकते हैं और एक डैशबोर्ड से आवेदक मैनेज कर सकते हैं।', benefit3Title: 'एआई वर्कफ़्लो', benefit3Text: 'रिज्यूमे, सीवी जांच और रेफरल इनसाइट्स उपलब्ध।', companyEyebrow: 'विश्वसनीय हायरिंग नेटवर्क', companyTitle: 'शीर्ष एमएनसी और तेज़ी से बढ़ते ब्रांड', companyBody: 'विश्वसनीय नियोक्ताओं के अवसरों को साफ और मजबूत ब्रांड सेक्शन में देखें।', companyNote1: 'मुफ्त नियोक्ता ऑनबोर्डिंग', companyNote2: 'प्रोफेशनल जॉब सीकर अनुभव', companyNote3: 'विश्वसनीय एआई वर्कफ़्लो', categoriesEyebrow: 'लोकप्रिय रास्ते', categoriesTitle: 'लोकप्रिय श्रेणियां', categoriesBody: 'उच्च-इंटेंट कैटेगरी से जल्दी अवसर खोजें।', workflowTitle: 'स्मूद जॉब वर्कफ़्लो', workflowBody: 'खोज से हायरिंग तक एक साफ और गाइडेड प्रक्रिया।', appTitle: 'प्ले स्टोर, एंड्रॉइड और iOS सपोर्ट', appBody: 'मोबाइल उपयोगकर्ताओं और रिक्रूटर्स के लिए क्रॉस-प्लेटफॉर्म अनुभव।', categoryFinderTitle: 'श्रेणी के अनुसार नौकरियां', faqEyebrow: 'तेज़ उत्तर', faqTitle: 'अक्सर पूछे जाने वाले प्रश्न', faqBody: 'पोर्टल का उपयोग करने वाले जॉब सीकर और नियोक्ताओं के लिए स्पष्ट मार्गदर्शन।'
    },
    footer: {
      tagline: 'टैलेंट को अवसर से जोड़ना', seekers: 'जॉब सीकर के लिए', employers: 'नियोक्ताओं के लिए', company: 'कंपनी', support: 'सहायता', browseJobs: 'नौकरियां देखें', companies: 'कंपनियां', careerAdvice: 'करियर सलाह', resumeBuilder: 'रिज्यूमे बिल्डर', browseCandidates: 'उम्मीदवार देखें', pricing: 'प्राइसिंग प्लान', recruiting: 'रिक्रूटिंग सॉल्यूशंस', about: 'हमारे बारे में', contact: 'संपर्क करें', blog: 'ब्लॉग', careers: 'करियर', help: 'हेल्प सेंटर', faq: 'एफएक्यू', privacy: 'प्राइवेसी पॉलिसी', terms: 'सेवा की शर्तें', rights: 'सभी अधिकार सुरक्षित।'
    }
  },
  te: {
    languageLabel: 'భాష',
    nav: { home: 'హోమ్', aiTools: 'ఏఐ టూల్స్', jobs: 'ఉద్యోగాలు', companies: 'కంపెనీలు', forEmployers: 'నియామకదారుల కోసం', login: 'లాగిన్', register: 'రిజిస్టర్', theme: 'థీమ్', light: 'లైట్ మోడ్', dark: 'డార్క్ మోడ్' },
    home: { heroKicker: 'ఉద్యోగార్థులు మరియు నియామకదారులకు ఉచితం', heroTitle: 'PayoutJob తో మెరుగైన నియామక వర్క్‌ఫ్లో నిర్మించండి', heroBody: 'ఏఐ టూల్స్, రిక్రూటర్ డ్యాష్‌బోర్డ్, మొబైల్-రెడీ అనుభవంతో ప్రొఫెషనల్ జాబ్ డిస్కవరీ.', browseJobs: 'ఉద్యోగాలు చూడండి', exploreAi: 'ఏఐ టూల్స్ చూడండి', statsTitle: 'ప్రొఫెషనల్ + స్మూత్', statCandidates: 'సక్రియ అభ్యర్థులు', statRoles: 'ఖాళీ ఉద్యోగాలు', statCompanies: 'హైరింగ్ కంపెనీలు', statsBody: 'ఉద్యోగార్థులు మరియు నియామకదారులకు విశ్వసనీయ అనుభవం.', searchSkills: 'స్కిల్స్ లేదా కంపెనీ', searchLocation: 'ప్రాంతం', searchExperience: 'అనుభవం', searchButton: 'ఉద్యోగాలు వెతకండి', benefit1Title: 'ఉద్యోగార్థులకు ఉచితం', benefit1Text: 'ఉద్యోగార్థిగా ఉచితంగా నమోదు చేసుకుని దరఖాస్తు చేయండి.', benefit2Title: 'నియామకదారులకు ప్రారంభం ఉచితం', benefit2Text: 'నియామకదారులు ఉచితంగా ఉద్యోగాలు పోస్టు చేయడం ప్రారంభించవచ్చు.', benefit3Title: 'ఏఐ వర్క్‌ఫ్లో', benefit3Text: 'రిజ్యూమే మరియు సీవీ సహాయం అందుబాటులో ఉంది.', companyEyebrow: 'విశ్వసనీయ హైరింగ్ నెట్‌వర్క్', companyTitle: 'టాప్ ఎంఎన్‌సీలు మరియు వేగంగా ఎదుగుతున్న బ్రాండ్లు', companyBody: 'గుర్తింపు పొందిన సంస్థల అవకాశాలను స్పష్టంగా చూడండి.', companyNote1: 'ఉచిత ఎంప్లాయర్ ఆన్‌బోర్డింగ్', companyNote2: 'ప్రొఫెషనల్ ఉద్యోగార్థి అనుభవం', companyNote3: 'నమ్మదగిన ఏఐ వర్క్‌ఫ్లో', categoriesEyebrow: 'ప్రాచుర్య మార్గాలు', categoriesTitle: 'ప్రాచుర్య కేటగిరీలు', categoriesBody: 'సరైన అవకాశాలను వేగంగా కనుగొనండి.', workflowTitle: 'స్మూత్ జాబ్ వర్క్‌ఫ్లో', workflowBody: 'సెర్చ్ నుంచి హైరింగ్ వరకు మార్గనిర్దేశిత ప్రక్రియ.', appTitle: 'ప్లే స్టోర్, ఆండ్రాయిడ్ మరియు iOS సపోర్ట్', appBody: 'మొబైల్ వినియోగదారుల కోసం సిద్ధమైన అనుభవం.', categoryFinderTitle: 'కేటగిరీ ద్వారా ఉద్యోగాలు', faqEyebrow: 'తక్షణ సమాధానాలు', faqTitle: 'తరచుగా అడిగే ప్రశ్నలు', faqBody: 'పోర్టల్ ఉపయోగించే వారికి స్పష్టమైన మార్గదర్శకం.' },
    footer: { tagline: 'ప్రతిభను అవకాశాలతో కలుపుతుంది', seekers: 'ఉద్యోగార్థుల కోసం', employers: 'నియామకదారుల కోసం', company: 'కంపనీ', support: 'సహాయం', browseJobs: 'ఉద్యోగాలు చూడండి', companies: 'కంపెనీలు', careerAdvice: 'కెరీర్ సలహా', resumeBuilder: 'రిజ్యూమే బిల్డర్', browseCandidates: 'అభ్యర్థులను చూడండి', pricing: 'ధరల ప్లాన్లు', recruiting: 'రిక్రూటింగ్ పరిష్కారాలు', about: 'మా గురించి', contact: 'మమ్మల్ని సంప్రదించండి', blog: 'బ్లాగ్', careers: 'కెరీర్లు', help: 'హెల్ప్ సెంటర్', faq: 'ఎఫ్‌ఏక్యూ', privacy: 'ప్రైవసీ పాలసీ', terms: 'సేవా నిబంధనలు', rights: 'అన్ని హక్కులు రిజర్వ్.' }
  },
  ta: { languageLabel: 'மொழி', nav: { home: 'முகப்பு', aiTools: 'ஏஐ கருவிகள்', jobs: 'வேலைகள்', companies: 'நிறுவனங்கள்', forEmployers: 'நியமிப்பாளர்களுக்கு', login: 'உள்நுழை', register: 'பதிவு', theme: 'தீம்', light: 'ஒளி முறை', dark: 'இருள் முறை' } },
  kn: { languageLabel: 'ಭಾಷೆ', nav: { home: 'ಮುಖಪುಟ', aiTools: 'ಎಐ ಉಪಕರಣಗಳು', jobs: 'ಉದ್ಯೋಗಗಳು', companies: 'ಕಂಪನಿಗಳು', forEmployers: 'ನಿಯೋಜಕರಿಗಾಗಿ', login: 'ಲಾಗಿನ್', register: 'ನೋಂದಣಿ', theme: 'ಥೀಮ್', light: 'ಲೈಟ್ ಮೋಡ್', dark: 'ಡಾರ್ಕ್ ಮೋಡ್' } },
  es: { languageLabel: 'Idioma', nav: { home: 'Inicio', aiTools: 'Herramientas IA', jobs: 'Empleos', companies: 'Empresas', forEmployers: 'Para empleadores', login: 'Ingresar', register: 'Registrarse', theme: 'Tema', light: 'Modo claro', dark: 'Modo oscuro' } },
  fr: { languageLabel: 'Langue', nav: { home: 'Accueil', aiTools: 'Outils IA', jobs: 'Emplois', companies: 'Entreprises', forEmployers: 'Pour les employeurs', login: 'Connexion', register: 'Inscription', theme: 'Thème', light: 'Mode clair', dark: 'Mode sombre' } },
  ar: { languageLabel: 'اللغة', nav: { home: 'الرئيسية', aiTools: 'أدوات الذكاء', jobs: 'وظائف', companies: 'شركات', forEmployers: 'لأصحاب العمل', login: 'تسجيل الدخول', register: 'إنشاء حساب', theme: 'السمة', light: 'وضع فاتح', dark: 'وضع داكن' } }
};

const fallbackLocale = 'en';

const LanguageContext = createContext({
  locale: fallbackLocale,
  setLocale: () => {},
  t: (key) => key,
  languages: []
});

const languages = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'Hindi' },
  { code: 'te', label: 'Telugu' },
  { code: 'ta', label: 'Tamil' },
  { code: 'kn', label: 'Kannada' },
  { code: 'es', label: 'Spanish' },
  { code: 'fr', label: 'French' },
  { code: 'ar', label: 'Arabic' }
];

function getValue(locale, key) {
  const source = translations[locale] || translations[fallbackLocale];
  const fallback = translations[fallbackLocale];
  const parts = key.split('.');

  const read = (obj) => parts.reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : undefined), obj);
  return read(source) ?? read(fallback) ?? key;
}

export function LanguageProvider({ children }) {
  const [locale, setLocale] = useState(() => {
    if (typeof window === 'undefined') return fallbackLocale;
    return localStorage.getItem('payout-language') || fallbackLocale;
  });

  useEffect(() => {
    localStorage.setItem('payout-language', locale);
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
  }, [locale]);

  const value = useMemo(() => ({
    locale,
    setLocale,
    languages,
    t: (key) => getValue(locale, key)
  }), [locale]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export const useLanguage = () => useContext(LanguageContext);