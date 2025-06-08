
import React, { useState, useEffect, useRef, useCallback } from 'react';
import ChatInput from './components/ChatInput'; // Corrected: default import
import ChatMessage from './components/ChatMessage';
import ThemeToggle from './components/ThemeToggle';
import GlobalScrollbarStyle from './components/GlobalScrollbarStyle';
import MarkdownStyles from './components/MarkdownStyles'; // Import new component
import { Message, Theme } from './types';
import { sendMessageToGemini } from './services/geminiService';
import { INITIAL_AI_MESSAGE, APP_TITLE } from './constants';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [theme, setTheme] = useState<Theme>('light');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([
      {
        id: crypto.randomUUID(),
        text: INITIAL_AI_MESSAGE,
        sender: 'ai',
        timestamp: new Date(),
      },
    ]);
    const storedTheme = localStorage.getItem('theme') as Theme | null;
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (storedTheme) {
      setTheme(storedTheme);
    } else if (prefersDark) {
      setTheme('dark');
    }
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = useCallback(async (text: string) => {
    const userMessage: Message = {
      id: crypto.randomUUID(),
      text,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setIsLoading(true);

    try {
      const aiResponseText = await sendMessageToGemini(text);
      const aiMessage: Message = {
        id: crypto.randomUUID(),
        text: aiResponseText,
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
    } catch (error) {
      console.error("Error sending message or processing AI response:", error);
      const errorMessageText = error instanceof Error ? error.message : "Sorry, something went wrong. Please try again.";
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        text: errorMessageText,
        sender: 'error',
        timestamp: new Date(),
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="flex flex-col h-screen bg-light-background dark:bg-dark-background text-light-textPrimary dark:text-dark-textPrimary font-sans transition-colors duration-300 ease-in-out">
      <GlobalScrollbarStyle theme={theme} />
      <MarkdownStyles theme={theme} /> {/* Add MarkdownStyles component */}
      {/* Header: No bottom border for cleaner look */}
      <header className="flex items-center justify-between p-3 md:p-4 sticky top-0 bg-light-background/80 dark:bg-dark-background/80 backdrop-blur-md z-10 transition-colors duration-300 ease-in-out">
        <h1 className="text-xl font-medium text-light-textPrimary dark:text-dark-textPrimary">{APP_TITLE}</h1>
        <ThemeToggle theme={theme} onThemeChange={setTheme} />
      </header>

      <div className="flex-grow flex flex-col items-center w-full overflow-hidden py-4 md:py-6 lg:py-8">
        {/* Centered chat content area */}
        <div className="w-full max-w-2xl lg:max-w-3xl flex flex-col flex-grow h-full overflow-hidden">
          <main className="flex-grow overflow-y-auto p-3 md:p-4 space-y-4 custom-scrollbar">
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            {isLoading && messages[messages.length - 1]?.sender === 'user' && (
              <div className="py-3 pl-1"> 
                <p className="text-xs mb-1 text-light-textPrimary dark:text-dark-textPrimary font-medium">
                  {APP_TITLE}
                </p>
                <div className="animate-pulse flex space-x-1.5 pt-1">
                    <div className="rounded-full bg-light-textSecondary/60 dark:bg-dark-textSecondary/60 h-1.5 w-1.5"></div>
                    <div className="rounded-full bg-light-textSecondary/60 dark:bg-dark-textSecondary/60 h-1.5 w-1.5 animation-delay-200"></div>
                    <div className="rounded-full bg-light-textSecondary/60 dark:bg-dark-textSecondary/60 h-1.5 w-1.5 animation-delay-400"></div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </main>
          {/* ChatInput is now seamless with the page */}
          <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
};

export default App;