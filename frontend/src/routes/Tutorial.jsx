import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import dashboard from '../assets/dashboard.png';

// Import placeholders - you'll want to replace these with actual screenshots
const dashboardTutorial = [
  {
    screenshot: dashboard,
    steps: [
      'Log in to your dashboard',
      'Navigate through different sections',
      'Understand the main dashboard layout',
      'Explore key metrics and visualizations'
    ]
  },
  {
    screenshot: '/api/placeholder/800/600',
    steps: [
      'Click on the Energy section',
      'Upload your energy consumption data',
      'View different time-based energy charts',
      'Analyze your energy usage patterns'
    ]
  },
  {
    screenshot: '/api/placeholder/800/600',
    steps: [
      'Explore the Transport section',
      'Log your transportation methods',
      'Calculate your carbon footprint',
      'Track improvements over time'
    ]
  }
];

export default function Tutorial() {
  const [currentTutorial, setCurrentTutorial] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const handleNextStep = () => {
    if (currentStep < dashboardTutorial[currentTutorial].steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="p-8 bg-base-200 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-center">App Tutorial</h1>
      
      <div className="grid grid-cols-2 gap-8">
        {/* Screenshot Section */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <img 
            src={dashboardTutorial[currentTutorial].screenshot} 
            alt={`Tutorial Step ${currentStep + 1}`} 
            className="w-full h-[70vh] object-cover"
          />
        </div>

        {/* Steps Section */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <button 
              onClick={handlePreviousStep} 
              disabled={currentStep === 0}
              className="btn btn-circle btn-outline"
            >
              <ChevronLeft />
            </button>
            <h2 className="text-xl font-semibold">
              {dashboardTutorial[currentTutorial].steps[currentStep]}
            </h2>
            <button 
              onClick={handleNextStep} 
              disabled={currentStep === dashboardTutorial[currentTutorial].steps.length - 1}
              className="btn btn-circle btn-outline"
            >
              <ChevronRight />
            </button>
          </div>

          {/* Step List */}
          <ul className="space-y-4">
            {dashboardTutorial[currentTutorial].steps.map((step, index) => (
              <li 
                key={index}
                className={`p-3 rounded-lg transition-all duration-300 ${
                  index === currentStep 
                    ? 'bg-primary text-white shadow-md' 
                    : 'bg-base-200 text-base-content hover:bg-base-300'
                }`}
              >
                {step}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Tutorial Navigation */}
      <div className="flex justify-center mt-8 space-x-4">
        {dashboardTutorial.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentTutorial(index);
              setCurrentStep(0);
            }}
            className={`btn btn-circle ${
              currentTutorial === index 
                ? 'btn-primary' 
                : 'btn-outline'
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}