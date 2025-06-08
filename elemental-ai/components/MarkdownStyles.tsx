
import React, { useEffect } from 'react';
import { Theme } from '../types';

interface MarkdownStylesProps {
  theme: Theme;
}

const MarkdownStyles: React.FC<MarkdownStylesProps> = ({ theme }) => {
  useEffect(() => {
    const styleId = 'markdown-styles';
    let styleElement = document.getElementById(styleId) as HTMLStyleElement | null;

    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }

    const lightCodeBg = 'rgba(0, 0, 0, 0.04)'; // Subtle dark on light
    const darkCodeBg = 'rgba(255, 255, 255, 0.08)'; // Subtle light on dark
    
    const lightBlockquoteBorder = 'rgba(0, 0, 0, 0.15)';
    const darkBlockquoteBorder = 'rgba(255, 255, 255, 0.2)';

    // Static color definitions based on typical Tailwind setup
    const lightLinkColor = '#007AFF'; // Example: Apple Blue
    const darkLinkColor = '#0A84FF';  // Example: Brighter Apple Blue for dark mode

    const lightTextSecondaryColor = '#6E6E73'; // From GlobalScrollbarStyle
    const darkTextSecondaryColor = '#A0A0A0';   // From GlobalScrollbarStyle

    const lightBorderColor = '#D1D1D6'; // Example: Light Gray
    const darkBorderColor = '#3A3A3C';   // Example: Dark Gray

    const styles = `
      .prose-elemental p {
        margin-top: 0.5em;
        margin-bottom: 0.5em;
      }
      .prose-elemental a {
        color: ${theme === 'light' ? lightLinkColor : darkLinkColor};
        text-decoration: none;
      }
      .prose-elemental a:hover {
        text-decoration: underline;
      }
      .prose-elemental strong {
        font-weight: 600; /* semibold */
      }
      .prose-elemental em {
        font-style: italic;
      }
      .prose-elemental code:not(pre code) { /* Inline code */
        background-color: ${theme === 'light' ? lightCodeBg : darkCodeBg};
        padding: 0.1em 0.3em;
        border-radius: 0.25rem; /* rounded-md */
        font-size: 0.875em; /* Slightly smaller */
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
      }
      .prose-elemental pre {
        background-color: ${theme === 'light' ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.05)'};
        padding: 0.75em 1em;
        border-radius: 0.375rem; /* rounded-lg */
        overflow-x: auto;
        margin-top: 1em;
        margin-bottom: 1em;
      }
      .prose-elemental pre code {
        background-color: transparent;
        padding: 0;
        font-size: 0.875em;
        color: inherit; /* Inherit color from pre for syntax highlighting themes if added later */
      }
      .prose-elemental blockquote {
        border-left: 3px solid ${theme === 'light' ? lightBlockquoteBorder : darkBlockquoteBorder};
        padding-left: 0.75em;
        margin-left: 0;
        margin-right: 0;
        font-style: italic;
        color: ${theme === 'light' ? lightTextSecondaryColor : darkTextSecondaryColor};
        margin-top: 1em;
        margin-bottom: 1em;
      }
      .prose-elemental ul, .prose-elemental ol {
        margin-top: 0.75em;
        margin-bottom: 0.75em;
        padding-left: 1.5em; /* Standard indentation */
      }
      .prose-elemental ul {
        list-style-type: disc;
      }
      .prose-elemental ol {
        list-style-type: decimal;
      }
      .prose-elemental li {
        margin-top: 0.25em;
        margin-bottom: 0.25em;
      }
      .prose-elemental li > p { /* For paragraphs inside list items */
        margin-top: 0.25em;
        margin-bottom: 0.25em;
      }
      .prose-elemental hr {
        border-top: 1px solid ${theme === 'light' ? lightBorderColor : darkBorderColor};
        margin-top: 1.5em;
        margin-bottom: 1.5em;
      }
      .prose-elemental h1, .prose-elemental h2, .prose-elemental h3, .prose-elemental h4, .prose-elemental h5, .prose-elemental h6 {
        font-weight: 600; /* semibold */
        margin-top: 1.2em;
        margin-bottom: 0.6em;
      }
      .prose-elemental h1 { font-size: 1.5em; } /* text-2xl */
      .prose-elemental h2 { font-size: 1.25em; } /* text-xl */
      .prose-elemental h3 { font-size: 1.125em; } /* text-lg */
      /* Add more heading styles if needed */
    `;
    
    styleElement.textContent = styles;

  }, [theme]);

  return null;
};

export default MarkdownStyles;
