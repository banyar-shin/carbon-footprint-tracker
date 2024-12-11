import { useState, useEffect } from 'react'
import { useAuth } from '@clerk/clerk-react'
import Chart from './../components/Chart'
import { Bar } from 'react-chartjs-2';
import DatePicker from 'react-datepicker'; // Import react-datepicker
import { FaPlus } from "react-icons/fa";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const suggestedActions = [
  'Use public transportation instead of driving',
  'Eat more plant-based meals',
  'Switch to energy-efficient appliances',
  'Reduce single-use plastics',
];

export default function General() {
  const { userId } = useAuth();
  const [chart, setChart] = useState('general-week');
  const [data, setData] = useState([]);
  const options = ['general-week', 'general-month', 'general-year'];
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [showCalendar, setShowCalendar] = useState(true);
  const [logistics, setLogistics] = useState([0, 0, 0, 0])

  useEffect(() => {
    if (!userId || !chart) return;
    if (chart === 'general-week' && !startDate) {
      setData([]);
      return;
    }
    if (chart === 'general-month' && !selectedMonth) {
      setData([]);
      return;
    }
    if (chart === 'general-year' && !selectedYear) {
      setData([])
      return;
    }

    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5001/dashboardData?userID=${userId}&chartType=${chart}&selectedDate=${selectedDate}&startDate=${startDate}&endDate=${endDate}&month=${selectedMonth}&year=${selectedYear}`
        );
        if (!response.ok) {
          throw new Error(`Error fetching data: ${response.statusText}`);
        }
        const result = await response.json();
        console.log(result[3])
        setLogistics(result[3])
        setData(result); // Update the state with fetched data
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("Failed to fetch data. Please try again.");
      }
    };

    fetchData();
  }, [chart, userId, startDate, endDate, selectedMonth, selectedYear, selectedDate]);
  const handleActionCheck = (action) => {
    console.log(`Added to to-do list: ${action}`);
  };

  const selectedIndex = options.indexOf(chart);

  return (
    <div className="h-full overflow-y-auto p-4 items-center text-center text-base-content" >
      {/* Banner */}
      <div className="w-full bg-gradient-to-r from-primary via-secondary to-primary text-white text-center py-6 rounded-t-lg">
        <h1 className="text-4xl font-bold border-b-2 border-white pb-2 w-2/3 mx-auto">
          Carbon Footprint Dashboard
        </h1>
        <p className="text-lg mt-2">
          Track and analyze your carbon footprint over time!
        </p>
      </div>
      {/* Top Options */}
      <div className="relative w-full flex items-center px-6 pt-6 bg-base-200">
        {/* Centered Buttons Container */}
        <div className="relative w-96 h-12 bg-base-100 rounded-lg overflow-hidden mx-auto">
          <div
            className="absolute top-[4px] bottom-[4px] h-[calc(100%-8px)] bg-primary rounded-md transition-transform duration-300"
            style={{
              width: `33.33%`,
              transform: `translateX(${selectedIndex * 100}%)`,
            }}
          />
          <div className="flex h-full">
            {options.map((option, index) => (
              <button
                key={option}
                className={`flex-1 text-center z-10 relative font-semibold transition-colors duration-300 ${selectedIndex === index ? 'text-white' : 'text-black'
                  }`}
                onClick={() => {
                  setChart(option);
                  if (option === 'general-week') {
                    setShowCalendar(true); // Show the calendar when "day" is selected
                  } else if (option === 'general-month') {
                    setShowCalendar(true); // Show the month dropdown when "month" is selected
                  } else if (option === 'general-year') {
                    setShowCalendar(true); // Show the year input box when "year" is selected
                  } else {
                    setShowCalendar(false); // Hide the calendar for other options
                  }
                }}
              >
                {option.split('-')[1].charAt(0).toUpperCase() + option.split('-')[1].slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Upload Button on Far Right */}
        {/* <div className="absolute right-0 top-0 h-full flex items-center pt-6 pr-6 bg-base-200"> */}
        {/*   <button className="btn btn-circle btn-primary" onClick={() => document.getElementById('upload_csv_modal').showModal()}> */}
        {/*     <FaPlus /> */}
        {/*   </button> */}
        {/* </div> */}
      </div>

      <div className="w-full bg-base-200 flex flex-col justify-center items-center rounded-b-lg pb-6 px-6">
        <div className="py-4">
          {showCalendar && chart === 'general-week' && (
            <div className="flex space-x-4">
              <div>
                <span className="mr-2 text-center items-center justify-center">Date:</span>
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  dateFormat="yyyy-MM-dd"
                  className="p-2 border w-32 rounded-md"
                />
              </div>
            </div>
          )}

          {showCalendar && chart === 'general-month' && (
            <div className="flex items-center space-x-3">
              <span>Month:</span>
              <select
                id="month-select"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="p-2 border rounded-md"
              >
                <option value=""></option>
                <option value="01">January</option>
                <option value="02">February</option>
                <option value="03">March</option>
                <option value="04">April</option>
                <option value="05">May</option>
                <option value="06">June</option>
                <option value="07">July</option>
                <option value="08">August</option>
                <option value="09">September</option>
                <option value="10">October</option>
                <option value="11">November</option>
                <option value="12">December</option>
              </select>
            </div>
          )}

          {showCalendar && chart === 'general-year' && (
            <div className="flex items-center text-center space-x-3">
              <span>Year:</span>
              <input
                type="number"
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="p-2 border rounded-md text-center w-32"
                min={1900}
                max={2100}
              />
            </div>
          )}
        </div>
        {/* Chart */}
        <Chart chartType={chart} data={data} />
      </div>

      <div className="bg-base-200 rounded-lg my-3 p-6">
        <h2 className="text-2xl font-semibold mb-6">Carbon Footprint Distribution</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div className="stat bg-base-100 rounded-lg shadow-lg">
            <div className="stat-title">Total Footprint</div>
            <div className="stat-value">{Math.round(logistics[3])} kg CO2</div>
          </div>
          <div className="stat bg-base-100 rounded-lg shadow-lg">
            <div className="stat-title">Energy</div>
            <div className="stat-value">{Math.round(logistics[0] / logistics[3] * 100)} %</div>
          </div>
          <div className="stat bg-base-100 rounded-lg shadow-lg">
            <div className="stat-title">Transport</div>
            <div className="stat-value">{Math.round(logistics[1] / logistics[3] * 100)} %</div>
          </div>
          <div className="stat bg-base-100 rounded-lg shadow-lg">
            <div className="stat-title">Food</div>
            <div className="stat-value">{Math.round(logistics[2] / logistics[3] * 100)} %</div>
          </div>
        </div>
      </div>

      <div className="p-6 bg-base-200 rounded-lg">
        <h2 className="text-2xl font-semibold mb-6">Suggested Actions</h2>
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
    </div>
  );

}
