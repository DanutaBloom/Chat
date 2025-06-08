import React, { useState, useRef, useEffect, useCallback } from 'react';
import LoadingSpinner from './LoadingSpinner';

// Minimalist UPWARD Arrow (sharp, filled triangle)
const UpwardSendIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className={className || "w-3 h-3"}>
        <path d="M7.219.566a.75.75 0 0 1 1.562 0l4.25 11.75A.75.75 0 0 1 12.25 13H3.75a.75.75 0 0 1-.781-.684L7.22 0.566Z" transform="translate(0 1)" />
    </svg>
);

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [inputValue, setInputValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const adjustTextareaHeight = useCallback(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; // Reset height
      const scrollHeight = textareaRef.current.scrollHeight;
      const minContentHeight = parseFloat(textareaRef.current.style.minHeight) || 26; // 26px is content-box minHeight
      const newHeight = Math.max(scrollHeight, minContentHeight);
      textareaRef.current.style.height = `${newHeight}px`;
    }
  }, []);

  useEffect(() => {
    if (inputValue) {
      adjustTextareaHeight();
    } else if (textareaRef.current) {
       // Reset to single line content height (which is minHeight of the textarea's content box)
      textareaRef.current.style.height = textareaRef.current.style.minHeight || '26px';
    }
  }, [inputValue, adjustTextareaHeight]);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = useCallback((event?: React.FormEvent<HTMLFormElement>) => {
    if (event) event.preventDefault();
    const trimmedValue = inputValue.trim();
    if (trimmedValue && !isLoading) {
      onSendMessage(trimmedValue);
      setInputValue('');
      setTimeout(() => {
        if (textareaRef.current) {
          // Reset to single line content height after send
          textareaRef.current.style.height = textareaRef.current.style.minHeight || '26px';
        }
        textareaRef.current?.focus();
      }, 0);
    }
  }, [inputValue, isLoading, onSendMessage]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey && !isLoading) {
      event.preventDefault();
      handleSubmit();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative flex items-center p-2 md:p-3 bg-light-background dark:bg-dark-background transition-colors duration-300 ease-in-out"
      aria-label="Chat input form"
    >
      {/* This div is the main visual container for the input field */}
      <div
        className="relative flex items-center flex-grow rounded-lg
                   bg-light-surface dark:bg-dark-surface
                   border-2 border-transparent /* Default border for layout, matches background */
                   focus-within:border-light-accent dark:focus-within:border-dark-accent
                   focus-within:ring-0 /* Disable default ring, use border for focus */
                   transition-colors duration-200 px-4" // Horizontal padding for the field
        style={{ minHeight: '46px' }} // Total height of the input field
      >
        <textarea
          ref={textareaRef}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Message Elemental AI..."
          className="flex-grow bg-transparent text-light-textPrimary dark:text-dark-textPrimary
                     placeholder-light-textSecondary dark:placeholder-dark-textSecondary/80 /* Solid gray for light, slightly transparent for dark */
                     border-0 outline-none focus:ring-0
                     resize-none overflow-y-auto custom-scrollbar
                     py-2.5 /* Vertical padding for text centering */
                     text-sm"
          style={{
            maxHeight: '120px',
            minHeight: '26px', // Content-box height for one line (46px total - 20px padding)
            lineHeight: '1.25rem', // 20px, for text-sm (14px font) to center in 26px content box
            paddingRight: '2.75rem' // Space for the icon button (approx 44px)
          }}
          disabled={isLoading}
          aria-label="Chat message input"
        />
        <button
          type="submit"
          disabled={isLoading || inputValue.trim() === ''}
          className={`absolute right-0 top-0 bottom-0 flex items-center justify-center
                     w-11 h-full /* Clickable area for the icon */
                     bg-transparent border-0 outline-none focus:outline-none
                     text-light-textSecondary/70 dark:text-dark-textSecondary /* Icon colors matching screenshots */
                     hover:text-light-textPrimary/80 dark:hover:text-dark-textPrimary /* Hover icon color */
                     disabled:text-light-textSecondary/30 dark:disabled:text-dark-textSecondary/40 /* Disabled icon color */
                     transition-colors duration-200`}
          aria-label={isLoading ? "Sending message, please wait" : "Send message"}
          title={isLoading ? "Sending..." : "Send"}
        >
          {isLoading ? <LoadingSpinner /> : <UpwardSendIcon className="w-2.5 h-2.5" />} {/* Icon size updated */}
        </button>
      </div>
    </form>
  );
};

export default ChatInput;