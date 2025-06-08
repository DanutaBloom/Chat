
import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="w-5 h-5 border-2 border-light-accent dark:border-dark-accent border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};

export default LoadingSpinner;
