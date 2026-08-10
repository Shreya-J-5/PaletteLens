import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  name: string;
  email: string;
}

export interface RegisteredUser {
  name: string;
  email: string;
  password?: string;
}

interface AuthContextType {
  user: User | null;
  trialsUsed: number;
  maxFreeTrials: number;
  isAuthModalOpen: boolean;
  authMode: 'login' | 'signup';
  trialLimitReachedMessage: string | null;
  isLogoutConfirmOpen: boolean;
  login: (email: string, password?: string) => { success: boolean; error?: string };
  signup: (name: string, email: string, password?: string) => { success: boolean; error?: string };
  requestLogout: () => void;
  confirmLogout: () => void;
  cancelLogout: () => void;
  incrementTrial: () => boolean;
  openAuthModal: (mode?: 'login' | 'signup', customMessage?: string) => void;
  closeAuthModal: () => void;
  trackAnalysisForUser: (analysisId: string) => void;
  getUserAnalysisIds: () => string[];
  getRegisteredUsers: () => RegisteredUser[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TRIALS_KEY = 'palettelens_trials_count';
const USER_KEY = 'palettelens_user_session';
const REGISTERED_USERS_KEY = 'palettelens_registered_users';
const USER_ANALYSES_MAP_KEY = 'palettelens_user_analyses_map';
const MAX_TRIALS = 3;

const DEFAULT_USERS: Record<string, RegisteredUser> = {
  'admin@palettelens.com': {
    name: 'Admin Studio',
    email: 'admin@palettelens.com',
    password: 'password123',
  },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem(USER_KEY);
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [trialsUsed, setTrialsUsed] = useState<number>(() => {
    const savedTrials = localStorage.getItem(TRIALS_KEY);
    return savedTrials ? parseInt(savedTrials, 10) : 0;
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');
  const [trialLimitReachedMessage, setTrialLimitReachedMessage] = useState<string | null>(null);
  
  // Logout confirmation modal state
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);

  // Helper to load registered users map
  const getRegisteredUsersMap = (): Record<string, RegisteredUser> => {
    const stored = localStorage.getItem(REGISTERED_USERS_KEY);
    if (!stored) {
      localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(DEFAULT_USERS));
      return DEFAULT_USERS;
    }
    try {
      const parsed = JSON.parse(stored);
      return { ...DEFAULT_USERS, ...parsed };
    } catch {
      return DEFAULT_USERS;
    }
  };

  useEffect(() => {
    localStorage.setItem(TRIALS_KEY, trialsUsed.toString());
  }, [trialsUsed]);

  const signup = (name: string, email: string, password?: string): { success: boolean; error?: string } => {
    const cleanEmail = email.toLowerCase().trim();
    if (!cleanEmail) {
      return { success: false, error: 'Email address is required.' };
    }
    if (!name.trim()) {
      return { success: false, error: 'Full name is required.' };
    }

    const regMap = getRegisteredUsersMap();
    const newUserRecord: RegisteredUser = {
      name: name.trim(),
      email: cleanEmail,
      password: password || '',
    };

    regMap[cleanEmail] = newUserRecord;
    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(regMap));

    const sessionUser: User = { name: newUserRecord.name, email: cleanEmail };
    setUser(sessionUser);
    localStorage.setItem(USER_KEY, JSON.stringify(sessionUser));
    setIsAuthModalOpen(false);
    setTrialLimitReachedMessage(null);
    return { success: true };
  };

  const login = (email: string, password?: string): { success: boolean; error?: string } => {
    const cleanEmail = email.toLowerCase().trim();
    if (!cleanEmail) {
      return { success: false, error: 'Please enter your registered email address.' };
    }

    const regMap = getRegisteredUsersMap();
    const registeredAccount = regMap[cleanEmail];

    if (!registeredAccount) {
      return {
        success: false,
        error: 'No account found with this email address. Please sign up first!',
      };
    }

    if (password && registeredAccount.password && registeredAccount.password !== password) {
      return {
        success: false,
        error: 'Incorrect password. Please verify your details or sign up with a new account.',
      };
    }

    const sessionUser: User = { name: registeredAccount.name, email: cleanEmail };
    setUser(sessionUser);
    localStorage.setItem(USER_KEY, JSON.stringify(sessionUser));
    setIsAuthModalOpen(false);
    setTrialLimitReachedMessage(null);
    return { success: true };
  };

  const requestLogout = () => {
    setIsLogoutConfirmOpen(true);
  };

  const confirmLogout = () => {
    setUser(null);
    localStorage.removeItem(USER_KEY);
    setIsLogoutConfirmOpen(false);
  };

  const cancelLogout = () => {
    setIsLogoutConfirmOpen(false);
  };

  const incrementTrial = (): boolean => {
    if (user) {
      return true; // Logged-in users have unlimited access
    }

    if (trialsUsed >= MAX_TRIALS) {
      openAuthModal(
        'signup',
        'You have used all 3 free trial analyses. Create a free account or log in to keep extracting colors without limits.'
      );
      return false;
    }

    setTrialsUsed((prev) => prev + 1);
    return true;
  };

  const openAuthModal = (mode: 'login' | 'signup' = 'signup', customMessage?: string) => {
    setAuthMode(mode);
    setTrialLimitReachedMessage(customMessage || null);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setTrialLimitReachedMessage(null);
  };

  // Associate an analysis ID with the currently logged-in email or guest session
  const trackAnalysisForUser = (analysisId: string) => {
    const currentAccountKey = user ? user.email.toLowerCase().trim() : 'guest';
    const mapStr = localStorage.getItem(USER_ANALYSES_MAP_KEY);
    const mapObj: Record<string, string[]> = mapStr ? JSON.parse(mapStr) : {};

    if (!mapObj[currentAccountKey]) {
      mapObj[currentAccountKey] = [];
    }

    if (!mapObj[currentAccountKey].includes(analysisId)) {
      mapObj[currentAccountKey].push(analysisId);
    }

    localStorage.setItem(USER_ANALYSES_MAP_KEY, JSON.stringify(mapObj));
  };

  // Get list of analysis IDs owned by the current logged-in user or guest
  const getUserAnalysisIds = (): string[] => {
    const currentAccountKey = user ? user.email.toLowerCase().trim() : 'guest';
    const mapStr = localStorage.getItem(USER_ANALYSES_MAP_KEY);
    const mapObj: Record<string, string[]> = mapStr ? JSON.parse(mapStr) : {};

    return mapObj[currentAccountKey] || [];
  };

  const getRegisteredUsers = (): RegisteredUser[] => {
    const map = getRegisteredUsersMap();
    return Object.values(map);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        trialsUsed,
        maxFreeTrials: MAX_TRIALS,
        isAuthModalOpen,
        authMode,
        trialLimitReachedMessage,
        isLogoutConfirmOpen,
        login,
        signup,
        requestLogout,
        confirmLogout,
        cancelLogout,
        incrementTrial,
        openAuthModal,
        closeAuthModal,
        trackAnalysisForUser,
        getUserAnalysisIds,
        getRegisteredUsers,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
