import React, { useState, useEffect } from "react";
import { useAuth } from '@clerk/clerk-react';
import Chart from './../components/Chart';

export default function Transportation() {
  const { userId } = useAuth(); // Get user ID from Clerk
  const [chart, setChart] = useState('transport-week'); // Default chart type
  const [data, setData] = useState([]); // Data to render in the chart
  const options = ['transportation-week', 'transportation-month', 'transportation-year']; // Available chart options

  // Fetch data when the selected chart changes
  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5001/data?userID=${userId}&chartType=${chart}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching transportation data:", error);
        alert("Failed to fetch transportation data. Please try again.");
      }
    };

    fetchData();
  }, [chart, userId]); // Refetch whenever the user or selected chart type changes

  return (
    <div className="h-full overflow-y-auto p-4 items-center text-center text-base-content space-y-4">
      
      {/* Banner Section */}
      <div className="w-full p-6 rounded-lg bg-base-200 space-y-6">
        <h1 className="text-2xl font-bold mb-4">Transportation 📊</h1>
        
        {/* Chart Options (Buttons to switch chart type) */}
        <div className="grid grid-cols-3 justify-center w-full gap-4">
          {options.map((option) => (
            <button
              key={option}
              className={`btn btn-secondary ${chart === option ? 'text-white border border-white btn-active' : ''}`}
              onClick={() => setChart(option)}
            >
              {option.split('-')[1].charAt(0).toUpperCase() + option.split('-')[1].slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Visualization Chart Section */}
      <div className="w-full h-[60vh] flex justify-center items-center rounded-lg mt-4 border-1 border-gray-300 shadow-xl transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl">
        <Chart chartType={chart} data={data} />
      </div>
      
    </div>
  );
}
