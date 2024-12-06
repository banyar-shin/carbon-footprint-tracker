from flask import Flask, request, jsonify

import pandas as pd
from flask_cors import CORS
from main import parseMonthCSV, parseAnnualCSV, getEnergyData, getEnergyProduced, getVehicleData
from constants import *
from db import myCollection

app = Flask("CFTbackend")
CORS(app)  # Enable CORS


@app.route("/")
def home():
    return "It works!"

@app.route("/dailyform", methods=["POST"])
def dailyForm():
    # default carpool
    carpool_count = 1

    data = request.get_json()
    userID = data.get("userID")
    vehicleInfo = getVehicleData(userID)
    energyInfo = getEnergyData(userID)


    # Get from form
    date = data.get("date")
    miles_driven = int(data.get("miles_driven"))    
    carpool_count = int(data.get("carpool_count"))
    wh_mile = vehicleInfo.get("wh_mile")
    mpg = vehicleInfo.get("mpg")


    electricity_usage_kwh = float(data.get("electricity_usage_kwh"))

    # Calculate carbon footprint based on vehicle type
    if vehicleInfo.get("fuel_type") == "EV":
        energyInDay = getEnergyProduced(userID, date)
        # TODO test the carbon_footprint for having solar becuz we have to account for if they charged at home 
        if energyInfo.get("hasSolar") == True and energyInDay < 0:
            carbon_footprint =  (getEnergyProduced(userID, date) - ((miles_driven * wh_mile) / 1000)) * CO2_PER_KWH / carpool_count # if solar produced more household consumed
        else:   
            carbon_footprint = ((miles_driven * wh_mile) / 1000) * CO2_PER_KWH / carpool_count
    elif vehicleInfo.get("fuel_type") == "Diesel":
        carbon_footprint = (miles_driven / mpg) * CO2_DIESEL / carpool_count
    elif vehicleInfo.get("fuel_type") == "Gasoline":
        carbon_footprint = (miles_driven / mpg) * CO2_GASOLINE / carpool_count
    else:
        return jsonify({"error": "Unknown vehicle type"}), 400
    
    # Prepare carbonfootprint data
    carbon_footprint = {
       "date": date, 
       "carbon_footprint": carbon_footprint
    }
    
    # Insert into MongoDB 
    myCollection.update_one(
        {"userID": userID},
        {
            "$set": {
                "userID": userID,
                "carbon_footprint": carbon_footprint
            }
        },
        upsert=True
    )
    
    return
    

@app.route("/transportation", methods=["POST"])
def transportSettings():

    data = request.get_json()
    userID = data.get("userID")

    # Extract data from the request
    fuel_type = data.get("fuel_type")
    mpg = int(data.get("mpg")) if fuel_type in ["Gasoline", "Diesel"] else None
    wh_mile = int(data.get("wh_mile")) if fuel_type in ["EV"] else None
    avg_miles = int(data.get("avg_miles")) if data.get("avg_miles") else None


    # Prepare transportation data
    transportation_data = {
        "fuel_type": fuel_type,
        "mpg": mpg,
        "wh_mile": wh_mile,
        "avg_miles": avg_miles,
    }

    myCollection.update_one(
            {"userID": userID},
            {
                "$set": {
                    "userID": userID,
                    "transportationData": transportation_data
                }
            },
            upsert=True 
        )
    
    return jsonify({"Pass": "Updated Transportation Information"}), 200


@app.route("/energy", methods=["POST"])
def energySettings():

    data = request.get_json()
    userID = data.get("userID")

    # Extract data from the request
    avg_month_kw = int(data.get("avg_month_kw"))
    hasSolar = bool(data.get("hasSolar"))


    # Prepare power data
    energy_data = {
        "avg_month_kw": avg_month_kw,
        "hasSolar": hasSolar
    }

    myCollection.update_one(
            {"userID": userID},
            {
                "$set": {
                    "userID": userID,
                    "energy_data": energy_data
                }
            },
            upsert=True 
        )
    
    return jsonify({"Pass": "Updated Energy Information"}), 200


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
