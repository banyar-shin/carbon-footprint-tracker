import React, { useState, useEffect } from "react";
import { useAuth } from '@clerk/clerk-react';
import Chart from './../components/Chart'

export default function Transportation() {
    const { userId } = useAuth();
    const [chart, setChart] = useState('transport-week')
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Form Data:", formData); // Debugging
        try {
            const response = await fetch("http://127.0.0.1:5000/transportation", {
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
        </div>
    );
}
