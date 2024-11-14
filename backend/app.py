from flask import Flask, request, jsonify

import pandas as pd
from flask_cors import CORS
from main import parseMonthCSV, parseAnnualCSV
from constants import *

app = Flask("CFTbackend")
CORS(app)  # Enable CORS


@app.route("/")
def home():
    return "It works!"

@app.route("/form", methods=["POST"])
def dailyForm():
    data = request.get_json()

    # TODO get userID
    miles_driven = int(data.get("miles_driven"))
    vehicle_id = int(data.get("vehicle_id"))
    carpool_count = int(data.get("carpool_count"))
    electricity_usage_kwh = float(data.get("electricity_usage_kwh"))

    # Calculate carbon footprint based on vehicle type
    #if #EV
        
    carbon_footprint = ((miles_driven * wh_per_mile) / 1000) * CO2_PER_KWH / carpool_count

    #elif #Diesel
    
    carbon_footprint = (miles_driven / mpg) * CO2_DIESEL / carpool_count

    #elif #Gas
        
    carbon_footprint = (miles_driven / mpg) * CO2_GASOLINE / carpool_count

    #else:
    return jsonify({"error": "Unknown vehicle type"}), 400





@app.route("/upload", methods=["POST"])
def uploadCSV():
      # Check if a file was uploaded
    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400
    
    file = request.files['file']
    
    # Ensure the file has content
    if file.filename == '':
        return jsonify({"error": "Empty filename"}), 400

    # Read the CSV into a Pandas DataFrame to check its structure
    try:
        df = pd.read_csv(file, skiprows= 5, nrows=2) # Get first 2 rows
        file.seek(0)
        
        # Check for specific columns to determine parsing method
        if 'START DATE' in df.columns and 'END DATE' in df.columns:
            return parseAnnualCSV(file, userID=99)
        elif 'START TIME' in df.columns and 'END TIME' in df.columns:
            return parseMonthCSV(file, userID=99)
        
        else:
            return jsonify({"error": "Unknown CSV format"}), 400
    
    except Exception as e:
        return jsonify({"error": f"Failed to read CSV file: {str(e)}"}), 500




@app.route('/calculate_diet', methods=['POST'])
def calculate_footprint():
    # Ask user for MONTHLY INPUT of food intake
    data = request.get_json()
    
    # Extract food consumption data (kg per week)
    food_data = data.get('foodData', {})
    
    # Calculate the total carbon footprint
    total_carbon = 0
    for food_item, amount in food_data.items():
        total_carbon += food_carbonVal.get(food_item, 0) * amount
    
    # Calculate the annual carbon footprint
    weekly_carbon_diet = round((total_carbon * 12)/52,0) # Multiply by 12 months for annual value, then divide by 52 for weekly val
    
    return jsonify({
        "weeklyCarbonFootprint": weekly_carbon_diet,
    })
    

app.run(port=5000, debug=True)
