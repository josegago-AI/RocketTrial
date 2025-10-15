import React from 'react';
import Icon from 'components/AppIcon';

const ProgressTracker = ({ completedSteps, totalSteps }) => {
  const progress = totalSteps > 0 ? (completedSteps?.length / totalSteps) * 100 : 0;

  return (
    <div className="bg-secondary rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-foreground flex items-center">
          <Icon name="TrendingUp" size={18} className="mr-2 text-primary" />
          Progress
        </h3>
        <span className="text-sm font-medium text-muted-foreground">
          {completedSteps?.length}/{totalSteps}
        </span>
      </div>
      
      <div className="w-full bg-muted rounded-full h-3 mb-3">
        <div 
          className="bg-primary h-3 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          {Math.round(progress)}% Complete
        </span>
        
        {progress === 100 && (
          <div className="flex items-center text-green-600">
            <Icon name="Trophy" size={16} className="mr-1" />
            <span className="font-medium">All Done!</span>
          </div>
        )}
        
        {progress > 0 && progress < 100 && (
          <div className="flex items-center text-primary">
            <Icon name="Zap" size={16} className="mr-1" />
            <span className="font-medium">Keep Going!</span>
          </div>
        )}
        
        {progress === 0 && (
          <div className="flex items-center text-muted-foreground">
            <Icon name="Play" size={16} className="mr-1" />
            <span className="font-medium">Get Started</span>
          </div>
        )}
      </div>
      
      {/* Achievement Badges */}
      <div className="flex items-center justify-center mt-4 space-x-2">
        {progress >= 25 && (
          <div className="flex items-center justify-center w-8 h-8 bg-yellow-100 rounded-full">
            <Icon name="Award" size={16} className="text-yellow-600" />
          </div>
        )}
        {progress >= 50 && (
          <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
            <Icon name="Star" size={16} className="text-blue-600" />
          </div>
        )}
        {progress >= 75 && (
          <div className="flex items-center justify-center w-8 h-8 bg-purple-100 rounded-full">
            <Icon name="Crown" size={16} className="text-purple-600" />
          </div>
        )}
        {progress === 100 && (
          <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full">
            <Icon name="Trophy" size={16} className="text-green-600" />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressTracker;