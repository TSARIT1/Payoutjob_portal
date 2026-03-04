import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const STUDENT_TEMPLATE = {
  id: 1,
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+91 9876543210',
  avatar: null,
  role: 'Student',
  skills: ['React', 'JavaScript', 'Node.js', 'HTML/CSS'],
  experience: [
    {
      id: 1,
      title: 'Frontend Developer',
      company: 'Tech Solutions Inc.',
      duration: '2022 - Present',
      description: 'Developing web applications using React and Node.js'
    }
  ],
  education: [
    {
      id: 1,
      degree: 'Bachelor of Computer Applications',
      university: 'Delhi University',
      year: '2018 - 2021',
      grade: 'First Class'
    }
  ],
  profileCompleted: false,
  profileCompletion: 0
};

const EMPLOYER_TEMPLATE = {
  id: 201,
  name: 'Recruiter Admin',
  email: 'talent@payoutjob.com',
  phone: '+91 9000000000',
  avatar: null,
  role: 'Employer',
  companyName: 'PayoutJob Hiring',
  title: 'Talent Acquisition Lead',
  dashboardPreferences: {
    theme: 'light',
    lastLogin: null
  }
};

const createProfile = (role, overrides = {}) => {
  const base = role === 'Employer' ? EMPLOYER_TEMPLATE : STUDENT_TEMPLATE;
  return {
    ...base,
    ...overrides,
    role
  };
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in (from localStorage or API)
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const storedProfile = localStorage.getItem('userProfile');
        const storedRole = localStorage.getItem('authRole') || 'Student';

        if (token) {
          // In a real app, validate token with API
          if (storedProfile) {
            try {
              const parsedUser = JSON.parse(storedProfile);
              setUser(parsedUser);
            } catch (error) {
              console.error('Failed to parse stored profile, resetting to template:', error);
              const fallbackProfile = createProfile(storedRole);
              setUser(fallbackProfile);
              localStorage.setItem('userProfile', JSON.stringify(fallbackProfile));
            }
          } else {
            const bootstrapProfile = createProfile(storedRole);
            setUser(bootstrapProfile);
            localStorage.setItem('userProfile', JSON.stringify(bootstrapProfile));
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (email, password, role = 'Student') => {
    try {
      setIsLoading(true);
      // In a real app, make API call
      // For demo, simulate login
      if (email && password) {
        const profileOverrides = {
          email,
          phone: role === 'Employer' ? EMPLOYER_TEMPLATE.phone : STUDENT_TEMPLATE.phone,
          dashboardPreferences: role === 'Employer'
            ? { ...EMPLOYER_TEMPLATE.dashboardPreferences, lastLogin: new Date().toISOString() }
            : undefined
        };
        const profile = createProfile(role, profileOverrides);
        localStorage.setItem('authToken', 'sample-token');
        localStorage.setItem('authRole', role);
        setUser(profile);
        localStorage.setItem('userProfile', JSON.stringify(profile));
        return { success: true };
      }
      return { success: false, error: 'Invalid credentials' };
    } catch (error) {
      return { success: false, error: 'Login failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const loginAsEmployer = (email, password) => login(email, password, 'Employer');

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userProfile');
    localStorage.removeItem('authRole');
    setUser(null);
  };

  const updateProfile = (updatedData) => {
    setUser(prev => {
      const safePrev = prev || {};
      const merged = { ...safePrev, ...updatedData };
      localStorage.setItem('userProfile', JSON.stringify(merged));
      return merged;
    });
  };

  const value = {
    user,
    isLoading,
    login,
    loginAsEmployer,
    logout,
    updateProfile,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};