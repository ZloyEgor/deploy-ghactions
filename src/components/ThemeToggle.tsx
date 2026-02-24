import React, { useState, useEffect } from 'react';

interface ThemeToggleProps {
  className?: string;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '' }) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check for saved theme preference or default to 'light'
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    setIsDark(initialTheme === 'dark');
    
    // Apply theme to document
    document.documentElement.setAttribute('data-bs-theme', initialTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = isDark ? 'light' : 'dark';
    setIsDark(!isDark);
    
    // Save preference
    localStorage.setItem('theme', newTheme);
    
    // Apply to document
    document.documentElement.setAttribute('data-bs-theme', newTheme);
    
    // Dispatch custom event for other components
    window.dispatchEvent(new CustomEvent('themeChanged', { 
      detail: { theme: newTheme } 
    }));
  };

  return (
    <button
      className={`btn btn-outline-secondary ${className}`}
      onClick={toggleTheme}
      title={isDark ? 'Переключить на светлую тему' : 'Переключить на тёмную тему'}
      aria-label={isDark ? 'Переключить на светлую тему' : 'Переключить на тёмную тему'}
    >
      <i className={`fas ${isDark ? 'fa-sun' : 'fa-moon'}`}></i>
      <span className="d-none d-sm-inline ms-2">
        {isDark ? 'Светлая' : 'Тёмная'}
      </span>
    </button>
  );
};

export default ThemeToggle;