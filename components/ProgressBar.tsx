import React from 'react';

interface ProgressBarProps {
  current: number;
  total: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ current, total }) => {
  const percentage = Math.round(((current) / total) * 100);

  return (
    <div className="w-full max-w-xs mx-auto mb-8">
      <div className="flex justify-between text-xs font-bold text-slate-400 mb-1">
        <span>START</span>
        <span>{percentage}%</span>
        <span>END</span>
      </div>
      <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-pink-400 to-cyan-400 transition-all duration-500 ease-out rounded-full"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;