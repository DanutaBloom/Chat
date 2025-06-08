import React, { useEffect } from 'react';
import { Theme } from '../types';

interface GlobalScrollbarStyleProps {
  theme: Theme;
}

const GlobalScrollbarStyle: React.FC<GlobalScrollbarStyleProps> = ({ theme }) => {
  useEffect(() => {
    const styleId = 'custom-scrollbar-styles';
    let styleElement = document.getElementById(styleId) as HTMLStyleElement | null;

    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }

    // Colors derived from theme's textSecondary for better integration
    // Light theme textSecondary: '#6E6E73' -> rgba(110, 110, 115, alpha)
    // Dark theme textSecondary: '#A0A0A0' -> rgba(160, 160, 160, alpha)
    const scrollbarThumbBg = theme === 'light' ? 'rgba(110, 110, 115, 0.45)' : 'rgba(160, 160, 160, 0.45)';
    const scrollbarThumbHoverBg = theme === 'light' ? 'rgba(110, 110, 115, 0.55)' : 'rgba(160, 160, 160, 0.55)';
    // For Firefox scrollbar-color: thumb track
    const firefoxScrollbarValues = theme === 'light' ? 'rgba(110, 110, 115, 0.45) transparent' : 'rgba(160, 160, 160, 0.45) transparent';

    styleElement.textContent = `
      .custom-scrollbar::-webkit-scrollbar {
        width: 6px; /* Made thinner */
      }
      .custom-scrollbar::-webkit-scrollbar-track {
        background: transparent;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background: ${scrollbarThumbBg};
        border-radius: 3px; /* Adjusted for thinner bar */
      }
      .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: ${scrollbarThumbHoverBg};
      }
      /* For Firefox */
      .custom-scrollbar {
        scrollbar-width: thin; /* Standard Firefox way to request a thin scrollbar */
        scrollbar-color: ${firefoxScrollbarValues};
      }
    `;

  }, [theme]);

  return null;
};

export default GlobalScrollbarStyle;