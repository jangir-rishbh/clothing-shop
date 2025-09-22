"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Locale = "en" | "hi";

type Messages = Record<string, string>;

type Resources = Record<Locale, Messages>;

const resources: Resources = {
  en: {
    // Common
    back: "Back",
    menu: "Menu",
    settings: "Settings",
    signOut: "Sign out",
    login: "Login",
    signup: "Sign Up",
    yourProfile: "Your Profile",

    // Brand tagline
    brandTagline: "Elegant Clothing & Fashion",

    // Nav items
    home: "Home",
    about: "About Us",
    contact: "Contact",
    messages: "Messages",
    adminProfile: "Admin Profile",

    // Mobile labels with emojis
    mobileHome: "🏠 Home",
    mobileAbout: "ℹ️ About Us",
    mobileContact: "📞 Contact",
    mobileMessages: "💬 Messages",
    mobileAdminProfile: "🛡️ Admin Profile",

    // Aria labels
    openMenu: "Open menu",
    closeMenu: "Close menu",
    openUserMenu: "Open user menu",

    // Language
    language: "Language",
    english: "English",
    hindi: "Hindi",
  },
  hi: {
    // Common
    back: "वापस",
    menu: "मेनू",
    settings: "सेटिंग्स",
    signOut: "साइन आउट",
    login: "लॉगिन",
    signup: "साइन अप",
    yourProfile: "आपकी प्रोफ़ाइल",

    // Brand tagline
    brandTagline: "खूबसूरत कपड़े और फ़ैशन",

    // Nav items
    home: "होम",
    about: "हमारे बारे में",
    contact: "संपर्क",
    messages: "संदेश",
    adminProfile: "एडमिन प्रोफ़ाइल",

    // Mobile labels with emojis
    mobileHome: "🏠 होम",
    mobileAbout: "ℹ️ हमारे बारे में",
    mobileContact: "📞 संपर्क",
    mobileMessages: "💬 संदेश",
    mobileAdminProfile: "🛡️ एडमिन प्रोफ़ाइल",

    // Aria labels
    openMenu: "मेनू खोलें",
    closeMenu: "मेनू बंद करें",
    openUserMenu: "यूज़र मेनू खोलें",

    // Language
    language: "भाषा",
    english: "अंग्रेज़ी",
    hindi: "हिंदी",
  },
};

type I18nContextType = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string) => string;
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    // Load saved locale
    const saved = typeof window !== "undefined" ? (localStorage.getItem("locale") as Locale | null) : null;
    if (saved && (saved === "en" || saved === "hi")) {
      setLocaleState(saved);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("locale", locale);
      // Update <html lang="..."> for accessibility/SEO
      document.documentElement.lang = locale;
    }
  }, [locale]);

  const setLocale = (l: Locale) => setLocaleState(l);

  const t = useMemo(() => {
    return (key: string) => {
      const dict = resources[locale] || resources.en;
      return dict[key] ?? key;
    };
  }, [locale]);

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
