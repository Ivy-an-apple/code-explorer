import React from 'react';
import { motion } from 'framer-motion';

function ProgressBar({ 
  progress, 
  total, 
  current, 
  showPercentage = true,
  size = 'md',
  color = 'primary',
  animated = true 
}) {
  const percentage = total ? Math.round((current / total) * 100) : progress;
  
  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  };

  const colorClasses = {
    primary: 'from-primary-500 to-primary-400',
    blue: 'from-blue-500 to-blue-400',
    purple: 'from-purple-500 to-purple-400',
    orange: 'from-orange-500 to-orange-400',
    green: 'from-green-500 to-green-400',
    yellow: 'from-yellow-500 to-yellow-400',
  };

  return (
    <div className="w-full">
      {(showPercentage || total) && (
        <div className="flex justify-between text-sm mb-2">
          <span className="text-secondary-400">
            {total ? `进度: ${current}/${total}` : '进度'}
          </span>
          <span className="text-primary-400 font-semibold">{percentage}%</span>
        </div>
      )}
      <div className={`w-full bg-secondary-700 rounded-full overflow-hidden ${sizeClasses[size]}`}>
        <motion.div
          className={`h-full bg-gradient-to-r ${colorClasses[color]} rounded-full`}
          initial={animated ? { width: 0 } : false}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

export default ProgressBar;
