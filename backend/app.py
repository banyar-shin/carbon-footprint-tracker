from flask import Flask, render_template, request, jsonify

import pandas as pd
from flask_cors import CORS
from main import parseMonthCSV, parseAnnualCSV


app = Flask("CFTbackend")
CORS(app)  # Enable CORS


@app.route("/")
def home():
    return "It works!"


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
            return parseAnnualCSV(file)
        elif 'START TIME' in df.columns and 'END TIME' in df.columns:
            return parseMonthCSV(file)
        
        else:
            return jsonify({"error": "Unknown CSV format"}), 400
    
    except Exception as e:
        return jsonify({"error": f"Failed to read CSV file: {str(e)}"}), 500


# Carbon footprint data kg CO2 per kg of food
food_carbonVal = {
    "beef": 2.25, # 3oz serving
    "chicken": 0.434, #3oz serving
    "pork": 0.587, # 3oz serving
    "seafood": 0.38, # 3.5oz serving
    "eggs": 0.20, # 1 Egg
    "fruits": 0.006, # 5oz serving
    "vegetables": 0.16 # 1 cup serving
}

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
