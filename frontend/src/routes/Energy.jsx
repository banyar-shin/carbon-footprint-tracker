import { useState } from "react";
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useAuth } from '@clerk/clerk-react';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Energy() {
  const [timeframe, setTimeframe] = useState('weekly');
  const [hasSolar, setHasSolar] = useState(null);
  const { userId } = useAuth();

  const handleSolarSubmit = async (value) => {
    try {
      if (!userId) {
        throw new Error('Submission failed: Invalid UserID');
      }




      console.log("Form Data:", userId); // Debugging



      const response = await fetch("http://127.0.0.1:5000/energy", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userID: userId,
          hasSolar: value,
        }),
      });

      if (!response.ok) {
        throw new Error(`Submission failed: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Submission successful:', data);

      alert('Solar information updated successfully!');
    } catch (error) {
      console.error('Error updating solar information:', error);
      alert('Failed to update solar information. Please try again.');
    }
  };

  const chartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Carbon Footprint (kg CO2)',
        data: [12, 19, 3, 5, 2, 3, 7],
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Carbon Footprint Data',
      },
    },
  };

  return (
    <div className="h-full overflow-y-auto p-4 items-center text-center text-base-content space-y-4">
      <div className="w-full p-6 rounded-lg bg-base-200 space-y-6">
        <Bar data={chartData} options={chartOptions} />
        <div className="grid grid-cols-3 justify-center w-full gap-4">
          <button
            className={`btn btn-secondary ${timeframe === 'weekly' ? 'text-white border border-white btn-active' : ''}`}
            onClick={() => setTimeframe('weekly')}
          >
            Weekly
          </button>
          <button
            className={`btn btn-secondary ${timeframe === 'monthly' ? 'text-white border border-white btn-active' : ''}`}
            onClick={() => setTimeframe('monthly')}
          >
            Monthly
          </button>
          <button
            className={`btn btn-secondary ${timeframe === 'annually' ? 'text-white border border-white btn-active' : ''}`}
            onClick={() => setTimeframe('annually')}
          >
            Annually
          </button>
        </div>
      </div>

      <div className="p-6 bg-base-200 rounded-lg gap-6 justify-center">
        <h3 className="font-bold w-full text-xl py-4">Do you have solar power?</h3>
        <div className="flex justify-center gap-4">
          <button
            className="btn btn-primary"
            onClick={() => handleSolarSubmit(true)}
          >
            Yes
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => handleSolarSubmit(false)}
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
}
