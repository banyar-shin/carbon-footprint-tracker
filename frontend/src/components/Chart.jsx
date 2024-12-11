import React, { useEffect, useState } from 'react';
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

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Chart = ({ chartType, data }) => {
  const [chartData, setChartData] = useState(null);
  const [chartOptions, setChartOptions] = useState(null);

  // Function to format the date to a more readable format, e.g., "July 1, 2024"
  const formatDate = (dateStr) => {
    if (dateStr === undefined) {
      return
    }
    const [year, month, day] = dateStr.split('-');
    const date = new Date(year, month - 1, day);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options); // Formats to 'Month day, year'
  };

  useEffect(() => {
    console.log("Chart Type:", chartType);
    console.log("Data Received:", data);

    if (!chartType || !data || data.length === 0) {
      setChartData(null);
      setChartOptions(null);
      return;
    }

    let labels = [];
    let plot_data = [];
    let title = '';

    // Process chart data based on type
    switch (chartType) {
      case 'energy-day':
        labels = data.map((entry) => entry.timestamp?.substring(11)); // Extract time from timestamp
        plot_data = data.map((entry) => entry.net_energy_kwh); // Use carbon footprint
        title = 'Daily Energy Usage';
        break;
      case 'energy-week':
        labels = data.map((entry) => formatDate(entry.date));
        plot_data = data.map((entry) => entry.net_energy_kwh);
        title = 'Weekly Energy Usage';
        break;
      case 'energy-month':
        labels = data.map((entry) => entry.date);
        plot_data = data.map((entry) => entry.net_energy_kwh);
        title = 'Monthly Energy Usage';
        break;
      case 'energy-year':
        labels = data.map((entry) => entry.date);
        plot_data = data.map((entry) => entry.usage);
        title = 'Yearly Energy Usage';
        break;
      case 'transportation-week':
        labels = data.map((entry) => formatDate(entry.date));
        plot_data = data.map((entry) => entry.miles_driven);
        title = 'Weekly Miles Driven';
        break;
      case 'transportation-month':
        labels = data.map((entry) => entry.date);
        plot_data = data.map((entry) => entry.miles_driven);
        title = 'Monthly Miles Driven';
        break;
      default:
        console.error("Invalid chart type provided.");
        setChartData(null);
        setChartOptions(null);
        return;
    }

    console.log("Processed Labels:", labels);
    console.log("Processed Plot Data:", plot_data);

    // Set chart data and options
    setChartData({
      labels,
      datasets: [
        {
          label: chartType.includes('energy') ? 'Energy (kWh)' : chartType.includes('transportation') ? 'Miles Driven (miles)' : 'Carbon Footprint (kg CO2)',
          data: plot_data,
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 2,
        },
      ],
    });

    setChartOptions({
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: title,
        },
      },
    });
  }, [chartType, data]);

  return (
    <>
      {chartData && chartOptions ? (
        <Bar data={chartData} options={chartOptions} />
      ) : (
        <div className="text-center flex items-center justify-center text-lg">
          No data to display chart!
        </div>
      )}
    </>
  );
};

export default Chart;
