import { useState, useEffect } from "react";
import Chart from './../components/Chart';
import { useAuth } from '@clerk/clerk-react';
import DatePicker from 'react-datepicker'; // Import react-datepicker
import "react-datepicker/dist/react-datepicker.css"; // Import the CSS

export default function Transportation() {
  const { userId } = useAuth();
  const [chart, setChart] = useState('transportation-week');
  const [data, setData] = useState([]);
  const options = ['transportation-week', 'transportation-month', 'transportation-year'];
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [showCalendar, setShowCalendar] = useState(false);
  const [formData, setFormData] = useState({
    userID: "", // Initialize userID as empty string
    fuel_type: "",
    mpg: "",
    wh_mile: "",
    avg_miles: "",
  });

  // Fetch data whenever chart type, date, or user changes
  useEffect(() => {
    if (!userId) return;

    setFormData((prevFormData) => ({
      ...prevFormData,
      userID: userId,
    }));

    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5001/transData?userID=${userId}&chartType=${chart}&startDate=${startDate}&endDate=${endDate}&month=${selectedMonth}&year=${selectedYear}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const result = await response.json();
        setData(result.flat());
      } catch (error) {
        console.error("Error fetching transportation data:", error);
        alert("Failed to fetch transportation data. Please try again.");
      }
    };

    fetchData();
  }, [chart, userId, startDate, endDate, selectedMonth, selectedYear]);


  const selectedIndex = options.indexOf(chart);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:5001/transportation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to update transportation information");
      }

      const result = await response.json();
      alert("Settings saved successfully!");
    } catch (error) {
      console.error(error);
      alert("Error saving settings. Please try again.");
    }
  };

  const incrementYear = () => setSelectedYear((prev) => prev + 1);
  const decrementYear = () => setSelectedYear((prev) => prev - 1);

  return (
    <div className="h-full p-4 flex flex-col items-center bg-white">
      {/* Banner */}
      <div className="w-full bg-gradient-to-r from-primary via-secondary to-primary text-white text-center py-6 rounded-t-lg">
        <h1 className="text-4xl font-bold border-b-2 border-white pb-2 w-1/2 mx-auto">
          Transportation 🚗
        </h1>
        <p className="text-lg mt-2">
          Track and analyze your transportation over time!
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
                className={`flex-1 text-center z-10 relative font-semibold transition-colors duration-300 ${selectedIndex === index ? 'text-white' : 'text-black'
                  }`}
                onClick={() => {
                  setChart(option);
                  if (option === 'transportation-week') {
                    setShowCalendar(true); // Show the date range pickers when "week" is selected
                  } else if (option === 'transportation-month') {
                    setShowCalendar(true); // Show the month dropdown when "month" is selected
                  } else if (option === 'transportation-year') {
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
      </div>

      {/* Show calendar for day, start & end dates for week, month dropdown, and year input box */}
      {showCalendar && chart === 'transportation-day' && (
        <div className="mt-4">
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="yyyy-MM-dd"
            className="p-2 border rounded-md"
          />
        </div>
      )}
      {showCalendar && chart === 'transportation-week' && (
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

      {showCalendar && chart === 'transportation-month' && (
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

      {showCalendar && chart === 'transportation-year' && (
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

      <div className="p-6 bg-base-200 rounded-lg gap-6 justify-center">
        <h1 className="text-2xl font-bold mb-4">Transportation Settings</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-group">
            <label htmlFor="fuel_type" className="block text-left mb-2 font-medium">Fuel Type:</label>
            <select
              id="fuel_type"
              name="fuel_type"
              value={formData.fuel_type}
              onChange={handleChange}
              required
              className="select select-bordered w-full"
            >
              <option value="">Select Fuel Type</option>
              <option value="Gasoline">Gasoline</option>
              <option value="Diesel">Diesel</option>
              <option value="EV">Electric Vehicle (EV)</option>
            </select>
          </div>

          {formData.fuel_type === "Gasoline" || formData.fuel_type === "Diesel" ? (
            <div className="form-group">
              <label htmlFor="mpg" className="block text-left mb-2 font-medium">Miles Per Gallon (MPG):</label>
              <input
                type="number"
                id="mpg"
                name="mpg"
                value={formData.mpg}
                onChange={handleChange}
                required
                className="input input-bordered w-full"
              />
            </div>
          ) : null}

          {formData.fuel_type === "EV" ? (
            <div className="form-group">
              <label htmlFor="wh_mile" className="block text-left mb-2 font-medium">Watt-Hours per Mile (Wh/Mile):</label>
              <input
                type="number"
                id="wh_mile"
                name="wh_mile"
                value={formData.wh_mile}
                onChange={handleChange}
                required
                className="input input-bordered w-full"
              />
            </div>
          ) : null}

          <div className="form-group">
            <label htmlFor="avg_miles" className="block text-left mb-2 font-medium">Average Miles Driven per Year:</label>
            <input
              type="number"
              id="avg_miles"
              name="avg_miles"
              value={formData.avg_miles}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </div>

          <button type="submit" className="btn btn-primary w-full">Save Settings</button>
        </form>
      </div>
    </div>
  );


}
