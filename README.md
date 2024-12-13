# CarbonWise - Carbon Footprint Tracker

CarbonWise is a web application that helps users track and manage their carbon footprint through monitoring energy usage, transportation habits, and dietary choices.

## Features

- 🚗 Transportation carbon footprint tracking
- 🔋 Energy usage monitoring with solar integration
- 🥗 Diet-based carbon footprint analysis
- 📊 Dashboard with visualization
- 🔐 Secure authentication with Clerk
- 🤖 AI-powered recommendations using Gemini AI

## Prerequisites

- Python 3.8+
- Node.js 16+
- MongoDB
- Clerk Account (for authentication)
- Gemini AI API Key

## Installation

### Backend Setup

1. Navigate to the backend directory:

```bash
cd backend
```

2. Create a virtual environment:

```bash
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate
```

3. Install dependencies:

```bash
pip install -r requirements.txt
```

4. Create a `mongopass.py` file with your MongoDB connection string:

```python
mongopass = "your_mongodb_connection_string"
```

### Frontend Setup

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file with your Clerk publishable key:

```
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

## Running the Application

### Start the Backend

1. From the backend directory:

```bash
python app.py
```

The server will start at `http://localhost:5000`

### Start the Frontend

1. From the frontend directory:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Building for Production

### Frontend Build

```bash
cd frontend
npm run build
```

This will create a `dist` directory with production-ready files.

### Backend Deployment

The backend can be deployed to any Python-compatible hosting service. Make sure to:

1. Set up environment variables for sensitive data
2. Configure CORS settings appropriately
3. Set up MongoDB connection in production

## Project Structure

```
carbon-footprint-tracker/
├── frontend/                # React frontend application
│   ├── src/
│   │   ├── routes/         # Application routes
│   │   ├── components/     # Reusable components
│   │   ├── layouts/        # Layout components
│   │   └── lib/           # Utility functions and constants
│   └── ...
└── backend/                # Flask backend application
    ├── app.py             # Main application entry
    ├── db.py             # Database configuration
    ├── main.py           # Core business logic
    └── geminiService.py  # AI service integration
```

## Technologies Used

### Frontend

- React
- Vite
- TailwindCSS
- DaisyUI
- Clerk Authentication
- React Router

### Backend

- Flask
- MongoDB
- Pandas
- Gemini AI API

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
