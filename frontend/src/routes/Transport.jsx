import { useState, useEffect } from "react";
import Chart from './../components/Chart';
import { useAuth } from '@clerk/clerk-react';
import DatePicker from 'react-datepicker'; // Import react-datepicker
import "react-datepicker/dist/react-datepicker.css"; // Import the CSS
import { FaCog, FaPlus } from "react-icons/fa";

export default function Transportation() {
  const { userId } = useAuth();
  const [chart, setChart] = useState('transportation-week');
  const [data, setData] = useState([]);
  const options = ['transportation-week', 'transportation-month'];
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [showCalendar, setShowCalendar] = useState(true);
  const [formData, setFormData] = useState({
    userID: userId,
    fuel_type: "",
    mpg: "",
    wh_mile: "",
    avg_miles: "",
  });

  useEffect(() => {
    if (!userId || !chart) return;
    if (chart === 'transportation-week' && !startDate) {
      setData([]);
      return;
    }
    if (chart === 'transportation-month' && !selectedMonth) {
      setData([]);
      return;
    }

    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5001/transData?userID=${userId}&chartType=${chart}&selectedDate=${selectedDate}&startDate=${startDate}&endDate=${endDate}&month=${selectedMonth}&year=${selectedYear}`
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

  const selectedIndex = options.indexOf(chart);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const checkVehicleData = async () => {
    if (!userId) return;
    try {
      const response = await fetch(`http://localhost:5001/checkVehicle?userID=${userId}`);
      if (!response.ok) throw new Error("Error fetching vehicle data");

      const data = await response.json();
      if (data.success == true) {
        document.getElementById('add_data_modal').showModal();
      } else {
        alert("You need to configure your transportation settings first.");
        document.getElementById('settings').showModal();
      }
    } catch (error) {
      console.error("Error checking vehicle data:", error);
      alert("An error occurred while verifying your vehicle data.");
    }
  };

  const handleDailyForm = async (event) => {
    event.preventDefault();

    const dailyFormData = new FormData(event.target)
    const milesDriven = dailyFormData.get('miles_driven')
    const carpool = dailyFormData.get('carpool') ? parseInt(dailyFormData.get('carpool'), 10) : 0; // Parse the carpool value as an integer

    try {
      if (!userId) {
        throw new Error('Submission failed: Invalid UserID')
      }
      const date = new Date();
      const formattedDate = date.toISOString().split('T')[0];

      const data = {
        date: formattedDate,
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(formData)
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

  return (
    <div className="h-full overflow-y-auto p-4 items-center text-center text-base-content" >
      {/* Banner */}
      <div className="w-full bg-gradient-to-r from-primary via-secondary to-primary text-white text-center py-6 rounded-t-lg">
        <h1 className="text-4xl font-bold border-b-2 border-white pb-2 w-2/3 mx-auto">
          Transportation 🚗
        </h1>
        <p className="text-lg mt-2">
          Track and analyze your transportation over time!
        </p>
      </div>

      {/* Top Options */}
      <div className="relative w-full flex items-center px-6 pt-6 bg-base-200">
        {/* Centered Buttons Container */}
        <div className="relative w-48 h-12 bg-base-100 rounded-lg overflow-hidden mx-auto">
          <div
            className="absolute top-[4px] bottom-[4px] h-[calc(100%-8px)] bg-primary rounded-md transition-transform duration-300"
            style={{
              width: `50%`,
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
        {/* Settings Button on far left */}
        <div className="absolute left-0 top-0 h-full flex items-center pt-6 pl-6 bg-base-200">
          <button className="btn btn-circle bg-neutral-content" onClick={() => document.getElementById('settings').showModal()}>
            <FaCog />
          </button>
        </div>

        {/* Upload Button on far right */}
        <div className="absolute right-0 top-0 h-full flex items-center pt-6 pr-6 bg-base-200">
          <button className="btn btn-circle btn-primary" onClick={checkVehicleData}>
            <FaPlus />
          </button>
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

          {showCalendar && chart === 'transportation-week' && (
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

          {showCalendar && chart === 'transportation-month' && (
            <div className="flex items-center space-x-2">
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
        </div>
        {/* Chart */}
        <Chart chartType={chart} data={data} />
      </div>

      <dialog id="settings" className="modal">
        <div className="modal-box w-[32rem] max-w-xl bg-base-200">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>
          <h3 className="font-bold w-full text-xl py-3">Transportation Settings</h3>
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
            <div className="divider" />
            <button type="submit" className="btn btn-primary btn-wide">Save</button>
          </form>
        </div>
      </dialog>

      <dialog id="add_data_modal" className="modal">
        <div className="modal-box w-[32rem] max-w-xl bg-base-200">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>
          <h3 className="font-bold w-full text-xl py-3">Log Transport Data</h3>
          <form onSubmit={handleDailyForm} className="w-full space-y-4">
            <div className="form-group">
              <label htmlFor="miles_driven" className="block text-left mb-2 font-medium">Miles Driven Today:</label>
              <input
                type="number"
                id="miles_driven"
                name="miles_driven"
                className="input input-bordered w-full"
              />
            </div>
            <div className="form-group">
              <label htmlFor="carpool" className="block text-left mb-2 font-medium">Carpool Count:</label>
              <input
                type="number"
                id="carpool"
                name="carpool"
                className="input input-bordered w-full"
              />
            </div>
            <div className="divider" />
            <div className="w-full px-24">
              <button type="submit" className="btn btn-primary btn-wide">
                Submit
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
}
