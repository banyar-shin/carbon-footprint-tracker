import { useState, useEffect } from "react";
import Chart from './../components/Chart';
import { useAuth } from '@clerk/clerk-react';
import DatePicker from 'react-datepicker'; // Import react-datepicker
import "react-datepicker/dist/react-datepicker.css"; // Import the CSS

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
    if (!userId) return;

    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5001/data?userID=${userId}&chartType=${chart}&startDate=${startDate}&endDate=${endDate}&month=${selectedMonth}&year=${selectedYear}`
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
  }, [chart, userId, startDate, endDate, selectedMonth, selectedYear]);

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
    <div className="h-full p-4 flex flex-col items-center bg-white">
      
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
      <div className="relative w-full flex items-center mt-4">
        <div className="absolute left-0 top-0 h-full flex items-center">
        </div>

        {/* Centered Buttons Container */}
        <div className="relative w-64 h-12 bg-white border-gray-400 rounded-lg overflow-hidden mx-auto">
          <div
            className="absolute top-[4px] left-[4px] bottom-[4px] h-[calc(100%-8px)] bg-primary rounded-md transition-transform duration-300"
            style={{
              width: `25%`,
              transform: `translateX(${selectedIndex * 100}%)`,
            }}
          />
          <div className="flex h-full">
            {options.map((option, index) => (
              <button
                key={option}
                className={`flex-1 text-center z-10 relative font-semibold transition-colors duration-300 ${
                  selectedIndex === index ? 'text-white' : 'text-black'
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
        <div className="absolute right-0 top-0 h-full flex items-center">
          <label htmlFor="file-upload" className="btn btn-circle btn-primary text-xl">+</label>
          <input
            id="file-upload"
            type="file"
            className="hidden"
            onChange={handleUpload}
            accept=".csv"
          />
        </div>
      </div>

      {/* Show calendar for day, start & end dates for week, month dropdown, and year input box */}
      {showCalendar && chart === 'energy-day' && (
        <div className="mt-4">
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="yyyy-MM-dd"
            className="p-2 border rounded-md"
          />
        </div>
      )}

      {showCalendar && chart === 'energy-week' && (
        <div className="mt-4 flex space-x-4">
          <div>
            <span>Start Date</span>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              dateFormat="yyyy-MM-dd"
              className="p-2 border rounded-md"
            />
          </div>
          <div>
            <span>End Date</span>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              dateFormat="yyyy-MM-dd"
              className="p-2 border rounded-md"
            />
          </div>
        </div>
      )}

      {showCalendar && chart === 'energy-month' && (
        <div className="mt-4">
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
        <div className="mt-4 flex items-center space-x-2">
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

      {/* Chart */}
      <div className="w-full h-[60vh] flex justify-center items-center rounded-lg mt-4 border-1 border-gray-300 shadow-xl transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl">
        <Chart chartType={chart} data={data} />
      </div>
    </div>
  );
}
