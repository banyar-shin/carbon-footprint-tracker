import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import tutorial1 from '../assets/tutorial1.png';
import tutorial2 from '../assets/tutorial2.png';
import tutorial3 from '../assets/tutorial3.png';
import tutorial4 from '../assets/tutorial4.png';

const tutorialImages = [
  tutorial1,
  tutorial2,
  tutorial3,
  tutorial4,
];

export default function Tutorial() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleNextImage = () => {
    if (currentImageIndex < tutorialImages.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const handlePreviousImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  return (
    <div className="h-full overflow-y-auto p-4 items-center text-center text-base-content space-y-4">
      <div className="w-full p-6 rounded-lg bg-base-200 space-y-6">
        <h1 className="text-2xl font-bold mb-4">PG&E Download CSV Tutorial</h1>
        <div className="flex-col space-y-4">
          {/* Steps Section */}
          <div className="bg-base-100 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">Follow the steps below:</h2>
            <ul className="space-y-4">
              <li className={`p-3 rounded-lg transition-all duration-300 ${currentImageIndex === 0 ? 'bg-primary text-white shadow-md' : 'bg-base-200 text-base-content hover:bg-base-300'}`}>First head over to <a href="https://m.pge.com/" target="_blank" rel="noopener noreferrer">https://m.pge.com/</a> and Login in with account details.</li>
              <li className={`p-3 rounded-lg transition-all duration-300 ${currentImageIndex === 1 ? 'bg-primary text-white shadow-md' : 'bg-base-200 text-base-content hover:bg-base-300'}`}>Secondly, click on energy usage details.</li>
              <li className={`p-3 rounded-lg transition-all duration-300 ${currentImageIndex === 2 ? 'bg-primary text-white shadow-md' : 'bg-base-200 text-base-content hover:bg-base-300'}`}>Thirdly, click Green Download Data Button.</li>
              <li className={`p-3 rounded-lg transition-all duration-300 ${currentImageIndex === 3 ? 'bg-primary text-white shadow-md' : 'bg-base-200 text-base-content hover:bg-base-300'}`}>Finally, You can download any timeframe. We recommend doing based on monthly billing cycle.</li>
            </ul>

            <div className="flex justify-between items-center mt-6">
              <button
                onClick={handlePreviousImage}
                disabled={currentImageIndex === 0}
                className="btn btn-circle btn-outline"
              >
                <ChevronLeft />
              </button>
              <span className="text-lg">Step {currentImageIndex + 1} of {tutorialImages.length}</span>
              <button
                onClick={handleNextImage}
                disabled={currentImageIndex === tutorialImages.length - 1}
                className="btn btn-circle btn-outline"
              >
                <ChevronRight />
              </button>
            </div>
          </div>
          {/* Screenshot Section */}
          <div className="bg-base-100 rounded-xl p-3">
            <img
              src={tutorialImages[currentImageIndex]}
              alt={`Tutorial Substep ${currentImageIndex + 1}`}
              className="w-full h-auto max-h-[70vh] rounded-lg object-contain mx-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
