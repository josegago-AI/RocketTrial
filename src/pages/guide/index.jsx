import React, { useState, useEffect } from 'react';
import Header from 'components/ui/Header';
import Icon from 'components/AppIcon';
import Button from 'components/ui/Button';
import TutorialSidebar from './components/TutorialSidebar';
import TutorialContent from './components/TutorialContent';
import ProgressTracker from './components/ProgressTracker';
import InteractiveOverlay from './components/InteractiveOverlay';

const GuidePage = () => {
  const [currentStep, setCurrentStep] = useState(null);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [activeCategory, setActiveCategory] = useState('getting-started');
  const [showOverlay, setShowOverlay] = useState(false);
  const [notes, setNotes] = useState({});

  // Load progress from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem('financeflow-tutorial-progress');
    const savedNotes = localStorage.getItem('financeflow-tutorial-notes');
    
    if (savedProgress) {
      setCompletedSteps(JSON.parse(savedProgress));
    }
    
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
  }, []);

  // Save progress to localStorage
  useEffect(() => {
    localStorage.setItem('financeflow-tutorial-progress', JSON.stringify(completedSteps));
  }, [completedSteps]);

  // Save notes to localStorage
  useEffect(() => {
    localStorage.setItem('financeflow-tutorial-notes', JSON.stringify(notes));
  }, [notes]);

  const handleStepComplete = (stepId) => {
    if (!completedSteps?.includes(stepId)) {
      setCompletedSteps([...completedSteps, stepId]);
    }
  };

  const handleStepSelect = (stepId) => {
    setCurrentStep(stepId);
  };

  const handleTryItNow = (stepId) => {
    setShowOverlay(true);
    // Additional logic for guided overlay can be implemented here
  };

  const handleNoteUpdate = (stepId, note) => {
    setNotes(prev => ({
      ...prev,
      [stepId]: note
    }));
  };

  const resetProgress = () => {
    setCompletedSteps([]);
    setNotes({});
    localStorage.removeItem('financeflow-tutorial-progress');
    localStorage.removeItem('financeflow-tutorial-notes');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-16 flex h-screen">
        {/* Tutorial Sidebar */}
        <div className="w-80 bg-card border-r border-border overflow-y-auto">
          <div className="p-6 border-b border-border">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-foreground flex items-center">
                <Icon name="BookOpen" size={24} className="mr-3 text-primary" />
                FinanceFlow Guide
              </h1>
              <Button
                variant="ghost"
                size="sm"
                onClick={resetProgress}
                iconName="RotateCcw"
                className="text-muted-foreground hover:text-foreground"
              >
                Reset
              </Button>
            </div>
            
            <ProgressTracker 
              completedSteps={completedSteps}
              totalSteps={25} // Total number of tutorial steps
            />
          </div>

          <TutorialSidebar
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            currentStep={currentStep}
            onStepSelect={handleStepSelect}
            completedSteps={completedSteps}
          />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto">
          {currentStep ? (
            <TutorialContent
              stepId={currentStep}
              onComplete={handleStepComplete}
              onTryItNow={handleTryItNow}
              onNoteUpdate={handleNoteUpdate}
              note={notes?.[currentStep] || ''}
              isCompleted={completedSteps?.includes(currentStep)}
            />
          ) : (
            // Welcome Screen
            <div className="flex items-center justify-center h-full p-8">
              <div className="max-w-2xl text-center">
                <div className="mb-8">
                  <Icon name="Compass" size={64} className="mx-auto text-primary mb-4" />
                  <h2 className="text-3xl font-bold text-foreground mb-4">
                    Welcome to FinanceFlow
                  </h2>
                  <p className="text-lg text-muted-foreground mb-6">
                    Master your personal finance management with our comprehensive step-by-step guide. 
                    Learn everything from basic transaction tracking to advanced budget planning and goal setting.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div className="p-6 bg-card border border-border rounded-lg hover-lift">
                    <Icon name="Play" size={32} className="text-green-500 mb-3" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">Quick Start</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Get up and running in 10 minutes with the essentials
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        setActiveCategory('getting-started');
                        setCurrentStep('setup-profile');
                      }}
                    >
                      Start Here
                    </Button>
                  </div>

                  <div className="p-6 bg-card border border-border rounded-lg hover-lift">
                    <Icon name="Target" size={32} className="text-blue-500 mb-3" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">Feature Deep Dive</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Comprehensive tutorials for advanced features
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setActiveCategory('transactions');
                        setCurrentStep('add-transaction');
                      }}
                    >
                      Explore Features
                    </Button>
                  </div>
                </div>

                <div className="flex flex-wrap justify-center gap-4">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Icon name="Clock" size={16} className="mr-2" />
                    <span>~30 min total</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Icon name="Users" size={16} className="mr-2" />
                    <span>Beginner friendly</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Icon name="Smartphone" size={16} className="mr-2" />
                    <span>Mobile optimized</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Interactive Overlay */}
      {showOverlay && (
        <InteractiveOverlay
          stepId={currentStep}
          onClose={() => setShowOverlay(false)}
          onComplete={handleStepComplete}
        />
      )}

      {/* Floating Help Widget */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          variant="default"
          size="lg"
          className="rounded-full shadow-lg hover-lift"
          iconName="HelpCircle"
          onClick={() => {
            if (!currentStep) {
              setActiveCategory('getting-started');
              setCurrentStep('setup-profile');
            }
          }}
        >
          Need Help?
        </Button>
      </div>
    </div>
  );
};

export default GuidePage;