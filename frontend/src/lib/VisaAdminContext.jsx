import React, { createContext, useContext, useState, useCallback } from 'react';

// Hardcoded owner credentials — portal is purely client-side
const ADMIN_EMAIL = 'banjaratravel@gmail.com';
const ADMIN_PASSWORD = 'banjara50008';
const STORAGE_KEY = 'banjara_visa_admin_session';

const VisaAdminContext = createContext(null);

export const VisaAdminProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      return sessionStorage.getItem(STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const login = useCallback((email, password) => {
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      sessionStorage.setItem(STORAGE_KEY, 'true');
      setIsAuthenticated(true);
      return { success: true };
    }
    return { success: false, error: 'Invalid email or password.' };
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEY);
    setIsAuthenticated(false);
  }, []);

  return (
    <VisaAdminContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </VisaAdminContext.Provider>
  );
};

export const useVisaAdmin = () => useContext(VisaAdminContext);

// ─── Visa data helpers (localStorage) ─────────────────────────────────────────
const VISA_DATA_KEY = 'banjara_visa_customRates';
const VISA_CARDS_KEY = 'banjara_visa_customCards';

export const getVisaRates = () => {
  try {
    const raw = localStorage.getItem(VISA_DATA_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const saveVisaRates = (data) => {
  localStorage.setItem(VISA_DATA_KEY, JSON.stringify(data));
};

export const getCustomCards = () => {
  try {
    const raw = localStorage.getItem(VISA_CARDS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveCustomCards = (cards) => {
  localStorage.setItem(VISA_CARDS_KEY, JSON.stringify(cards));
};
