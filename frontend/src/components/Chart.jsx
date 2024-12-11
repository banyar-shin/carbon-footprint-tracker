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
    const date = new Date(dateStr);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
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
        plot_data = data.map((entry) => entry.carbon_footprint); // Use carbon footprint
        title = 'Detailed Daily Carbon Footprint';
        break;
      case 'energy-week':
        labels = data.map((entry) => formatDate(entry.date));
        plot_data = data.map((entry) => entry.carbon_footprint);
        title = 'Daily Carbon Footprint Summary';
        break;
      case 'energy-month':
        labels = data.map((entry) => entry.date);
        plot_data = data.map((entry) => entry.net_energy_kwh);
        title = 'Monthly Carbon Footprint Summary';
        break;
      case 'energy-year':
        labels = data.map((entry) => entry.date);
        plot_data = data.map((entry) => entry.carbon_footprint);
        title = 'Yearly Carbon Footprint Summary';
        break;
      case 'transportation-week':
        labels = data.map((entry) => entry.date);
        plot_data = data.map((entry) => entry.carbon_footprint);
        title = 'Daily Carbon Footprint Summary';
        break;
      case 'transportation-month':
        labels = data.map((entry) => entry.date);
        plot_data = data.map((entry) => entry.carbon_footprint);
        title = 'Monthly Carbon Footprint Summary';
        break;
      case 'transportation-year':
        labels = data.map((entry) => entry.date);
        plot_data = data.map((entry) => entry.carbon_footprint);
        title = 'Yearly Carbon Footprint Summary';
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
          // TODO for includes transportation
          label: chartType.includes('energy') ? 'Carbon Footprint (kg CO2)' : 'Energy (kWh)',
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
        <div className="text-center flex items-center justify-center text-3xl">
          Error: Invalid or Insufficient Data
        </div>
      )}
    </>
  );
};

export default Chart;
