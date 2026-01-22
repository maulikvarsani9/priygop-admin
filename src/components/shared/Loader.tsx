import React from 'react';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  isCenter?: boolean;
}

const Loader: React.FC<LoaderProps> = ({ size = 'md', text, isCenter = false }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const containerClasses = isCenter 
    ? 'flex flex-col items-center justify-center min-h-[400px]'
    : 'flex flex-col items-center justify-center';

  return (
    <div className={containerClasses}>
      <div
        className={`${sizeClasses[size]} border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin`}
      />
      {text && <p className="mt-4 text-gray-600">{text}</p>}
    </div>
  );
};

export default Loader;

