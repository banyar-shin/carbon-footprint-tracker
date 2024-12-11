import { useState } from 'react'
import { useAuth } from '@clerk/clerk-react'
import Chart from './../components/Chart'
import { useNavigate } from 'react-router-dom'
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const weeklyData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      label: 'Transport',
      data: [4, 3, 2, 5, 3, 4, 2],
      backgroundColor: '#8884d8',
    },
    {
      label: 'Food',
      data: [3, 4, 3, 2, 5, 3, 4],
      backgroundColor: '#82ca9d',
    },
    {
      label: 'Energy',
      data: [2, 1, 4, 3, 1, 2, 3],
      backgroundColor: '#ffc658',
    },
    {
      label: 'Other',
      data: [1, 2, 1, 2, 3, 4, 1],
      backgroundColor: '#ff8042',
    },
  ],
};

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    tooltip: {
      callbacks: {
        label: function (tooltipItem) {
          return `${tooltipItem.dataset.label}: ${tooltipItem.raw} kg CO2`;
        },
      },
    },
  },
  scales: {
    x: {
      stacked: true,
    },
    y: {
      stacked: true,
    },
  },
};

const distribution = [
  { category: 'Transport', percentage: 35 },
  { category: 'Food', percentage: 30 },
  { category: 'Energy', percentage: 25 },
  { category: 'Other', percentage: 10 },
];

const suggestedActions = [
  'Use public transportation instead of driving',
  'Eat more plant-based meals',
  'Switch to energy-efficient appliances',
  'Reduce single-use plastics',
];


export default function General() {
  const navigate = useNavigate();
  const { userId } = useAuth();
  const [chart, setChart] = useState('general-week')
  const [vehicleDataExists, setVehicleDataExists] = useState(false);
  const [viewOption, setViewOption] = useState('week');
  const [goal, setGoal] = useState(20);
  const [energyData, setEnergyData] = useState([]);

  const handleAddGoal = () => {
    const newGoal = prompt('Enter your carbon footprint goal (in kg CO2):');
    if (newGoal && !isNaN(newGoal)) {
      setGoal(Number(newGoal));
    }
  };

  const handleActionCheck = (action) => {
    console.log(`Added to to-do list: ${action}`);
  };

  const checkVehicleData = async () => {
    if (!userId) return;
    try {
      const response = await fetch(`http://localhost:5001/checkVehicle?userID=${userId}`);
      if (!response.ok) throw new Error("Error fetching vehicle data");

      const data = await response.json();
      if (data.success == true) {
        setVehicleDataExists(true);
        document.getElementById('add_data_modal').showModal();
      } else {
        alert("You need to configure your transportation settings first.");
        navigate("/dashboard/transport");
      }
    } catch (error) {
      console.error("Error checking vehicle data:", error);
      alert("An error occurred while verifying your vehicle data.");
    }
  };

  const handleDailyForm = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target)
    const milesDriven = formData.get('miles_driven')
    const carpool = formData.get('carpool') ? parseInt(formData.get('carpool'), 10) : 0; // Parse the carpool value as an integer

    try {
      if (!userId) {
        throw new Error('Submission failed: Invalid UserID')
      }

      const data = {
        date: new Date().toLocaleDateString('en-US'),
        miles_driven: parseInt(milesDriven, 10),
        carpool_count: carpool, // Send the integer value to the backend
        userID: userId,
      }

      const response = await fetch('http://localhost:5001/dailyform', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error(`Submission failed: ${response.statusText}`)
      }

      alert('Data submitted successfully!')
      document.getElementById('add_data_modal').close()
    } catch (error) {
      console.error('Error submitting data:', error)
      alert('Failed to submit data. Please try again.');
    }
  }

  return (
    <div className="p-4 bg-base-200 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Carbon Footprint Dashboard</h1>

      <div className="flex mb-4">
        <div className="btn-group">
          {['day', 'week', 'month', 'year'].map((option) => (
            <button
              key={option}
              className={`btn btn-sm ${viewOption === option ? 'btn-active' : ''}`}
              onClick={() => setViewOption(option)}
            >
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </button>
          ))}
        </div>
        <button className="btn btn-primary btn-sm ml-4" onClick={handleAddGoal}>
          Set Goal
        </button>
      </div>

      <div className="flex flex-wrap -mx-2">
        <div className="w-full lg:w-3/4 px-2 mb-4">
          <div className="bg-base-100 rounded-box p-4 shadow-lg">
            <Bar data={weeklyData} options={options} />
          </div>
        </div>

        <div className="w-full lg:w-1/4 px-2 mb-4">
          <div className="bg-base-100 rounded-box p-4 shadow-lg">
            <h2 className="text-xl font-semibold mb-2">Carbon Footprint Distribution</h2>
            {distribution.map((item) => (
              <div key={item.category} className="flex justify-between mb-2">
                <span>{item.category}</span>
                <span>{item.percentage}%</span>
              </div>
            ))}
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Your Goal</h3>
              <p className="text-2xl font-bold">{goal} kg CO2</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div className="stat bg-base-100 rounded-box shadow-lg">
          <div className="stat-title">Today's Footprint</div>
          <div className="stat-value">12 kg CO2</div>
        </div>
        <div className="stat bg-base-100 rounded-box shadow-lg">
          <div className="stat-title">Weekly Average</div>
          <div className="stat-value">85 kg CO2</div>
        </div>
        <div className="stat bg-base-100 rounded-box shadow-lg">
          <div className="stat-title">Monthly Average</div>
          <div className="stat-value">340 kg CO2</div>
        </div>
        <div className="stat bg-base-100 rounded-box shadow-lg">
          <div className="stat-title">Annual Average</div>
          <div className="stat-value">4,080 kg CO2</div>
        </div>
      </div>

      <h2 className="text-2xl font-semibold mb-4">Suggested Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {suggestedActions.map((action, index) => (
          <div key={index} className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <p>{action}</p>
              <div className="card-actions justify-end">
                <button className="btn btn-circle btn-sm btn-success" onClick={() => handleActionCheck(action)}>
                  ✓
                </button>
                <button className="btn btn-circle btn-sm btn-error">✕</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

}
