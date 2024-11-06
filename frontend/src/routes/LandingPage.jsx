import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="flex flex-col h-screen w-full items-center justify-center text-center text-base-content bg-base-100 p-4">
      {/* Hero Section */}
      <h1 className="text-5xl font-bold text-base-content mb-4 animate-pulseSlow">Welcome to CarbonWise🍃</h1>
      <p className="text-lg text-base-content max-w-xl mb-8 ">
        Take control of your environmental impact. Track your carbon footprint and get actionable insights to live more sustainably.
      </p>

      {/* Features Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl ">
        <Link to="/dashboard/transport" className="bg-base-100 shadow-lg rounded-lg p-6 hover:bg-base-200 transition duration-300 ease-in-out hover:scale-105">
          <h3 className="text-2xl font-semibold text-base-content mb-2 ">Transportation Tracker</h3>
          <p className="text-base-content">Track emissions from your daily travel and explore sustainable transport options.</p>
        </Link>
        <Link to="/dashboard/energy" className="bg-base-100 shadow-lg rounded-lg p-6 hover:bg-base-200 transition duration-300 ease-in-out hover:scale-105">
          <h3 className="text-2xl font-semibold text-base-content mb-2">Energy Usage Monitoring</h3>
          <p className="text-base-content">Monitor your household energy usage and reduce idle energy consumption.</p>
        </Link>
        <Link to="/dashboard/diet" className="bg-base-100 shadow-lg rounded-lg p-6 hover:bg-base-200 transition duration-300 ease-in-out hover:scale-105">
          <h3 className="text-2xl font-semibold text-base-content mb-2">Diet Analysis</h3>
          <p className="text-base-content">Analyze the carbon impact of your diet and get suggestions for eco-friendly choices.</p>
        </Link>
      </div>
    </div>
  );
}
