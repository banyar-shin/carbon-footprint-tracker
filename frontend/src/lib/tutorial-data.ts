import { LayoutDashboard, Zap, Car } from 'lucide-react';

// Example tutorial data
export const tutorialData = [
  {
    title: 'Dashboard Overview',
    icon: LayoutDashboard,
    screenshot: '/placeholder.svg?height=600&width=800',
    steps: [
      {
        title: 'Log in to your dashboard',
        description: 'Enter your credentials to access your personalized dashboard.'
      },
      {
        title: 'Navigate through different sections',
        description: 'Use the sidebar to explore various features of the application.'
      },
      {
        title: 'Understand the main dashboard layout',
        description: 'Familiarize yourself with the key components and information displayed.'
      },
      {
        title: 'Explore key metrics and visualizations',
        description: 'Analyze important data points and graphical representations of your sustainability efforts.'
      }
    ]
  },
  {
    title: 'Energy Management',
    icon: Zap,
    screenshot: '/placeholder.svg?height=600&width=800',
    steps: [
      {
        title: 'Access the Energy section',
        description: 'Navigate to the dedicated energy management area of the dashboard.'
      },
      {
        title: 'Upload energy consumption data',
        description: 'Import your energy usage information for analysis and tracking.'
      },
      {
        title: 'Interpret energy charts',
        description: 'Understand various time-based visualizations of your energy consumption patterns.'
      },
      {
        title: 'Identify optimization opportunities',
        description: 'Discover potential areas for improving energy efficiency based on your usage data.'
      }
    ]
  },
  {
    title: 'Transportation Insights',
    icon: Car,
    screenshot: '/placeholder.svg?height=600&width=800',
    steps: [
      {
        title: 'Explore the Transport section',
        description: 'Access detailed information about your transportation-related carbon footprint.'
      },
      {
        title: 'Log transportation methods',
        description: 'Record your various modes of transport to track their environmental impact.'
      },
      {
        title: 'Calculate carbon footprint',
        description: 'View an estimate of your carbon emissions based on your transportation choices.'
      },
      {
        title: 'Track improvements over time',
        description: 'Monitor your progress in reducing transportation-related emissions.'
      }
    ]
  }
];
