import React, { useState, useEffect } from "react";
import { useAuth } from '@clerk/clerk-react';
import Chart from './../components/Chart'

export default function Transportation() {
  const { userId } = useAuth();
  const [chart, setChart] = useState('transport-week')
  const [vehicleDataExists, setVehicleDataExists] = useState(false);
  const [formData, setFormData] = useState({
    userID: "", // Initialize userID as empty string
    fuel_type: "",
    mpg: "",
    wh_mile: "",
    avg_miles: "",
  });

  useEffect(() => {
    if (userId) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        userID: userId,
      }));
    }
  }, [userId]);

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
      }
    } catch (error) {
      console.error("Error checking vehicle data:", error);
      alert("An error occurred while verifying your vehicle data.");
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form Data:", formData); // Debugging
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

  return (
    <div className="h-full overflow-y-auto p-4 items-center text-center text-base-content space-y-4">
      <div className="p-6 bg-base-200 rounded-lg justify-center">
        <button className="btn btn-secondary w-full" onClick={checkVehicleData} >
          Add Today's Transportation Data
        </button>
      </div>
      <div className="w-full p-6 rounded-lg bg-base-200 space-y-6">
        <Chart chart={chart} setChart={setChart} />
        <div className="grid grid-cols-3 justify-center w-full gap-4">
          <button
            className={`btn btn-secondary ${chart === 'transport-week' ? 'text-white border border-white btn-active' : ''}`}
            onClick={() => setChart('transport-week')}
          >
            Weekly
          </button>
          <button
            className={`btn btn-secondary ${chart === 'transport-month' ? 'text-white border border-white btn-active' : ''}`}
            onClick={() => setChart('transport-month')}
          >
            Monthly
          </button>
          <button
            className={`btn btn-secondary ${chart === 'transport-year' ? 'text-white border border-white btn-active' : ''}`}
            onClick={() => setChart('transport-year')}
          >
            Yearly
          </button>
        </div>
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
      <dialog id="add_data_modal" className="modal">
        <div className="modal-box w-[48rem] max-w-5xl">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>
          <h3 className="font-bold w-full text-xl py-6">Add Today's Data</h3>
          <form onSubmit={handleDailyForm} className="w-full flex flex-col px-6 py-12 rounded-xl bg-base-200 justify-center items-center">
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text font-semibold">Miles Driven</span>
              </div>
              <input type="number" name="miles_driven" className="input input-bordered max-w-xs" />
            </label>
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text font-semibold">Carpool Count</span>
              </div>
              <input type="number" name="carpool" className="input input-bordered max-w-xs" required />
            </label>
            <div className="divider" />
            <div className="w-full px-24">
              <button type="submit" className="btn btn-primary w-full">
                Submit
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
}

