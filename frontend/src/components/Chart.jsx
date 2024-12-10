import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

const Chart = ({ chart, setChart }) => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  function getDaysInMonth(year, month) {
    const days = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: days }, (_, i) => i + 1);
  }

  const MonthlyLabels = getDaysInMonth(year, month);

  // ----------------- CHART DATA & OPTIONS ----------------- //
  // General Page //
  const GeneralWeekData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Carbon Footprint (kg CO2)',
        data: [12, 19, 3, 5, 2, 3, 7],
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
      },
    ],
  };

  const GeneralWeekOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Weekly Carbon Footprint',
      },
    },
  };

  const GeneralMonthData = {
    labels: MonthlyLabels,
    datasets: [
      {
        label: 'Carbon Footprint (kg CO2)',
        data: [12, 19, 3, 5, 2, 3, 7, 10, 30, 13],
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
      },
    ],
  };

  const GeneralMonthOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Monthly Carbon Footprint',
      },
    },
  };

  const GeneralYearData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Carbon Footprint (kg CO2)',
        data: [12, 19, 3, 5, 2, 3, 7],
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
      },
    ],
  };

  const GeneralYearOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Yearly Carbon Footprint',
      },
    },
  };

  // Energy Page //
  const EnergyDayData = {
    labels: ['1AM', '2AM', '3AM', '4AM', '5AM', '6AM', '7AM', '8AM', '9AM', '10AM', '11AM', '12PM', '1PM', '2PM', '3PM', '4PM', '5PM', '6PM', '7PM', '8PM', '9PM', '10PM', '11PM', '12AM'],
    datasets: [
      {
        label: 'Carbon Footprint (kg CO2)',
        data: [12, 19, 3, 5, 2, 3, 7],
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
      },
    ],
  };

  const EnergyDayOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Daily Carbon Footprint',
      },
    },
  };

  const EnergyWeekData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Carbon Footprint (kg CO2)',
        data: [12, 19, 3, 5, 2, 3, 7],
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
      },
    ],
  };

  const EnergyWeekOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Weekly Carbon Footprint',
      },
    },
  };

  const EnergyMonthData = {
    labels: MonthlyLabels,
    datasets: [
      {
        label: 'Carbon Footprint (kg CO2)',
        data: [12, 19, 3, 5, 2, 3, 7, 10, 30, 13],
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
      },
    ],
  };

  const EnergyMonthOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Monthly Carbon Footprint',
      },
    },
  };

  const EnergyYearData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Carbon Footprint (kg CO2)',
        data: [12, 19, 3, 5, 2, 3, 7],
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
      },
    ],
  };

  const EnergyYearOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Yearly Carbon Footprint',
      },
    },
  };

  // Transport Page //
  const TransportWeekData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Carbon Footprint (kg CO2)',
        data: [12, 19, 3, 5, 2, 3, 7],
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
      },
    ],
  };

  const TransportWeekOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Weekly Carbon Footprint',
      },
    },
  };

  const TransportMonthData = {
    labels: MonthlyLabels,
    datasets: [
      {
        label: 'Carbon Footprint (kg CO2)',
        data: [12, 19, 3, 5, 2, 3, 7, 10, 30, 13],
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
      },
    ],
  };

  const TransportMonthOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Monthly Carbon Footprint',
      },
    },
  };

  const TransportYearData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Carbon Footprint (kg CO2)',
        data: [12, 19, 3, 5, 2, 3, 7],
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
      },
    ],
  };

  const TransportYearOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Yearly Carbon Footprint',
      },
    },
  };


  // function to render chart according to their names
  const renderChart = () => {
    switch (chart) {
      case 'general-week':
        return <Bar data={GeneralWeekData} options={GeneralWeekOptions} />;
      case 'general-month':
        return <Bar data={GeneralMonthData} options={GeneralMonthOptions} />;
      case 'general-year':
        return <Bar data={GeneralYearData} options={GeneralYearOptions} />;
      case 'energy-day':
        return <Bar data={EnergyDayData} options={EnergyDayOptions} />;
      case 'energy-week':
        return <Bar data={EnergyWeekData} options={EnergyWeekOptions} />;
      case 'energy-month':
        return <Bar data={EnergyMonthData} options={EnergyMonthOptions} />;
      case 'energy-year':
        return <Bar data={EnergyYearData} options={EnergyYearOptions} />;
      case 'transport-week':
        return <Bar data={TransportWeekData} options={TransportWeekOptions} />;
      case 'transport-month':
        return <Bar data={TransportMonthData} options={TransportMonthOptions} />;
      case 'transport-year':
        return <Bar data={TransportYearData} options={TransportYearOptions} />;
      default:
        return <div className='text-center flex items-center justify-center text-3xl'>Error: Invalid Chart Option</div>;
    }
  };

  return (
    <>
      {renderChart()}
    </>
  );
};

export default Chart;
