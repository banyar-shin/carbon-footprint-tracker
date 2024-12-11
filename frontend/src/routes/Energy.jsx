import { useState, useEffect } from "react";
import Chart from './../components/Chart';
import { useAuth } from '@clerk/clerk-react';
import DatePicker from 'react-datepicker'; // Import react-datepicker
import "react-datepicker/dist/react-datepicker.css"; // Import the CSS
import { FaPlus } from "react-icons/fa";

export default function Energy() {
  const [chart, setChart] = useState('energy-week');
  const [data, setData] = useState([]);
  const { userId } = useAuth();
  const options = ['energy-day', 'energy-week', 'energy-month', 'energy-year'];
  const [selectedDate, setSelectedDate] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [showCalendar, setShowCalendar] = useState(false);

  useEffect(() => {
    if (!userId || !chart) return;
    if (chart === 'energy-day' && !selectedDate) return;
    if (chart === 'energy-week' && !startDate) return;
    if (chart === 'energy-month' && !selectedMonth) return;
    if (chart === 'energy-year' && !selectedYear) return;

    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5001/data?userID=${userId}&chartType=${chart}&selectedDate=${selectedDate}&startDate=${startDate}&endDate=${endDate}&month=${selectedMonth}&year=${selectedYear}`
        );
        if (!response.ok) {
          throw new Error(`Error fetching data: ${response.statusText}`);
        }
        const result = await response.json();
        setData(result); // Update the state with fetched data
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("Failed to fetch data. Please try again.");
      }
    };

    fetchData();
  }, [chart, userId, startDate, endDate, selectedMonth, selectedYear, selectedDate]);

  const handleUpload = async (event) => {
    event.preventDefault();

    const file = event.target.files[0];

    if (!file) {
      alert('Please select a file to upload');
      return;
    }

    if (!file.name.endsWith('.csv')) {
      alert('Please upload a CSV file');
      return;
    }

    try {
      if (!userId) {
        throw new Error('Upload failed: Invalid UserID');
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('userID', userId);

      const response = await fetch("http://localhost:5001/upload", {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Upload successful:', data);

      alert('File uploaded successfully!');

    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload file. Please try again.');
    }
  };

  const selectedIndex = options.indexOf(chart);

  const incrementYear = () => {
    setSelectedYear((prevYear) => prevYear + 1);
  };

  const decrementYear = () => {
    setSelectedYear((prevYear) => prevYear - 1);
  };

  return (
    <div className="h-full overflow-y-auto p-4 items-center text-center text-base-content" >
      {/* Banner */}
      <div className="w-full bg-gradient-to-r from-primary via-secondary to-primary text-white text-center py-6 rounded-t-lg">
        <h1 className="text-4xl font-bold border-b-2 border-white pb-2 w-1/2 mx-auto">
          Energy Usage 📊
        </h1>
        <p className="text-lg mt-2">
          Track and analyze your energy consumption over time!
        </p>
      </div>

      {/* Top Options */}
      <div className="relative w-full flex items-center px-6 pt-6 bg-base-200">
        {/* Centered Buttons Container */}
        <div className="relative w-1/2 h-12 bg-base-100 rounded-lg overflow-hidden mx-auto">
          <div
            className="absolute top-[4px] bottom-[4px] h-[calc(100%-8px)] bg-primary rounded-md transition-transform duration-300"
            style={{
              width: `25%`,
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
                  if (option === 'energy-day') {
                    setShowCalendar(true); // Show the calendar when "day" is selected
                  } else if (option === 'energy-week') {
                    setShowCalendar(true); // Show the date range pickers when "week" is selected
                  } else if (option === 'energy-month') {
                    setShowCalendar(true); // Show the month dropdown when "month" is selected
                  } else if (option === 'energy-year') {
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
        <div className="absolute right-0 top-0 h-full flex items-center pt-6 pr-6 bg-base-200">
          <label htmlFor="file-upload" className="btn btn-circle btn-primary">
            <FaPlus />
          </label>
          <input
            id="file-upload"
            type="file"
            className="hidden"
            onChange={handleUpload}
            accept=".csv"
          />
        </div>
      </div>

      <div className="w-full bg-base-200 flex flex-col justify-center items-center rounded-b-lg pb-6 px-6">
        <div className="py-4">
          {/* Show calendar for day, start & end dates for week, month dropdown, and year input box */}
          {showCalendar && chart === 'energy-day' && (
            <div className="flex">
              <span className="flex mr-2 text-center items-center justify-center">Date:</span>
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                dateFormat="yyyy-MM-dd"
                className="p-2 border w-32 rounded-md"
              />
            </div>
          )}

          {showCalendar && chart === 'energy-week' && (
            <div className="flex space-x-4">
              <div>
                <span className="mr-3 text-center items-center justify-center">Start:</span>
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  dateFormat="yyyy-MM-dd"
                  className="p-2 border w-32 rounded-md"
                />
              </div>
              <div>
                <span className="mr-3 text-center items-center justify-center">End:</span>
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  dateFormat="yyyy-MM-dd"
                  className="p-2 border w-32 rounded-md"
                />
              </div>
            </div>
          )}

          {showCalendar && chart === 'energy-month' && (
            <div className="flex items-center space-x-3">
              <span>Month:</span>
              <select
                id="month-select"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="p-2 border rounded-md"
              >
                <option value="">Select a month</option>
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

          {showCalendar && chart === 'energy-year' && (
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
    </div>
  );
}
