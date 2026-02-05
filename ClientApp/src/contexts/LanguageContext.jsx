import React, { createContext, useState, useContext, useEffect } from 'react';
import { id } from '../translations/id';
import { en } from '../translations/en';

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }) => {
    // Try to get from localStorage first, default to 'id'
    const [language, setLanguage] = useState(localStorage.getItem('app_language') || 'id');
    const [translations, setTranslations] = useState(language === 'en' ? en : id);

    useEffect(() => {
        // Update translations when language changes
        setTranslations(language === 'en' ? en : id);
        localStorage.setItem('app_language', language);
    }, [language]);

    // Helper function to get nested values strings cleanly (e.g. t('menu.dashboard'))
    const t = (key) => {
        const keys = key.split('.');
        let value = translations;
        for (let k of keys) {
            value = value?.[k];
            if (!value) return key; // Fallback to key if not found
        }
        return value;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};
