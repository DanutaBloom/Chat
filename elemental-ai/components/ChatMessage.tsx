
import React from 'react';
import { Message } from '../types';
import { APP_TITLE } from '../constants';
import { marked } from 'marked';

interface ChatMessageProps {
  message: Message;
}

// Configure marked
marked.use({
  mangle: false, // Recommended for security with user-generated content if not displaying email addresses
  headerIds: false, // Not typically needed for chat messages
  gfm: true, // Enable GitHub Flavored Markdown
  breaks: true, // Treat newlines as <br>
  //pedantic: false, // Relax GFM rules (default is false)
  // Deprecated options, ensure they are not used or are set to their secure defaults
  // sanitize: true, // This is deprecated and replaced by sanitizer or DOMPurify
  // sanitizer: (html) => DOMPurify.sanitize(html) // If using DOMPurify
});


const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.sender === 'user';
  const isError = message.sender === 'error';
  const isAI = message.sender === 'ai';

  const senderLabel = isUser ? "You" : (isAI ? APP_TITLE : "Error");
  const senderLabelColor = isUser 
    ? "text-light-accent dark:text-dark-accent font-medium" 
    : (isAI 
      ? "text-light-textPrimary dark:text-dark-textPrimary font-medium" 
      : "text-red-500 dark:text-red-400 font-medium");

  const renderMarkdownContent = (text: string) => {
    // Basic sanitization by marked itself is limited.
    // For robust XSS protection with arbitrary AI output, a more comprehensive
    // HTML sanitizer like DOMPurify would be recommended on the parsed output.
    // However, for this exercise, we rely on marked's internal escaping of HTML by default for text,
    // and its behavior with GFM.
    // Ensure that if HTML is allowed in markdown, it's from a trusted source or sanitized.
    // By default, marked escapes embedded HTML.
    const rawMarkup = marked.parse(text) as string;
    return { __html: rawMarkup };
  };
  
  const textColor = isError 
    ? 'text-red-600 dark:text-red-400' 
    : 'text-light-textPrimary dark:text-dark-textPrimary';

  return (
    <div className={`py-3 pl-1`}>
      <p className={`text-xs mb-1 ${senderLabelColor}`}>
        {senderLabel}
      </p>
      <div 
        className={`text-sm leading-relaxed ${textColor} prose-elemental`}
        dangerouslySetInnerHTML={renderMarkdownContent(message.text)}
      />
      <p className={`text-xs mt-1.5 ${isError ? 'text-red-500/80 dark:text-red-400/80' : 'text-light-textSecondary/60 dark:text-dark-textSecondary/60'}`}> {/* Timestamp opacity reduced */}
        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </p>
    </div>
  );
};

export default ChatMessage;
