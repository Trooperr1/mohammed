import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import CashierView from './components/CashierView';
import KitchenView from './components/KitchenView';
import AdminView from './components/AdminView';
import './App.css';

function App() {
  const { t, i18n } = useTranslation();
  const [currentLang, setCurrentLang] = useState('en');

  useEffect(() => {
    // Set document direction based on language
    document.dir = currentLang === 'ar' || currentLang === 'ku' ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLang;
  }, [currentLang]);

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    setCurrentLang(lang);
  };

  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <div className="nav-content">
            <div className="nav-brand">
              🍕 Restaurant POS
            </div>
            <div className="nav-links">
              <Link to="/" className="nav-link">{t('cashier')}</Link>
              <Link to="/kitchen" className="nav-link">{t('kitchen')}</Link>
              <Link to="/admin" className="nav-link">{t('admin')}</Link>
            </div>
            <div className="language-selector">
              <button
                className={`lang-btn ${currentLang === 'en' ? 'active' : ''}`}
                onClick={() => changeLanguage('en')}
              >
                EN
              </button>
              <button
                className={`lang-btn ${currentLang === 'ar' ? 'active' : ''}`}
                onClick={() => changeLanguage('ar')}
              >
                ع
              </button>
              <button
                className={`lang-btn ${currentLang === 'ku' ? 'active' : ''}`}
                onClick={() => changeLanguage('ku')}
              >
                کو
              </button>
            </div>
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<CashierView />} />
            <Route path="/kitchen" element={<KitchenView />} />
            <Route path="/admin" element={<AdminView />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
