from flask import Flask, request, jsonify

import pandas as pd
from flask_cors import CORS
from main import (
    parseMonthCSV,
    parseMonthCSVSolar,
    parseAnnualCSV,
    getEnergyData,
    getEnergyProduced,
    getVehicleData,
    setSolarFalse,
    setSolarTrue,
)
from constants import *
from geminiService import (
    gemini_analyze_nutrition,
    gemini_suggest_sustainable_alternatives,
)
from db import myCollection
from datetime import datetime


app = Flask("CFTbackend")
CORS(app, resources={r"/*": {"origins": "*"}})


@app.route("/")
def home():
    return "It works!"


@app.route("/checkVehicle", methods=["GET"])
def checkVehicleData():
    try:
        # Extract userID from the query string
        userID = request.args.get("userID")
        # Query the MongoDB collection for vehicle information
        vehicleSettings = myCollection.find_one(
            {"userID": userID, "vehicleData": {"$exists": True}}
        )
        if vehicleSettings:
            return jsonify(
                {"success": True, "vehicleData": vehicleSettings.get("vehicleData")}
            ), 200
        else:
            return jsonify({"success": False}), 200
    except Exception as e:
        print(f"Error getting vehicle info: {str(e)}")
        return None


@app.route("/dailyform", methods=["POST"])
def dailyForm():
    # default carpool
    carpool_count = 1
    data = request.get_json()
    userID = data.get("userID")

    if not userID:
        return jsonify({"Error": "userID is required"}), 400

    vehicleInfo = getVehicleData(userID)

    # Get from form
    date = data.get("date")

    # If user did not enter in Miles Driven use average miles driven to calculate
    if data.get("miles_driven") is None:
        miles_driven = vehicleInfo.get("avg_miles") / 365
    else:
        miles_driven = int(data.get("miles_driven"))
    carpool_count = int(data.get("carpool_count"))

    if carpool_count == 0:
        carpool_count = 1

    if not (vehicleInfo.get("wh_mile")):
        mpg = vehicleInfo.get("mpg")
    else:
        wh_mile = vehicleInfo.get("wh_mile")
    fuel_type = vehicleInfo.get("fuel_type")

    # Calculate carbon footprint based on vehicle type
    if fuel_type == "EV":
        energyUsedDriving = ((miles_driven * wh_mile) / 1000)
        carbon_footprint = (energyUsedDriving) * CO2_PER_KWH / carpool_count

    elif fuel_type == "Diesel":
        carbon_footprint = (miles_driven / mpg) * CO2_DIESEL / carpool_count
    elif fuel_type == "Gasoline":
        carbon_footprint = (miles_driven / mpg) * CO2_GASOLINE / carpool_count
    else:
        return jsonify({"error": "Unknown vehicle type"}), 400


    # Prepare carbon footprint data
    carbon_footprint_data = {"date": date, "carbon_footprint": carbon_footprint}

    # Check if the record for the given date already exists
    user_data = myCollection.find_one({"userID": userID, "transportationData.date": date})

    if user_data:
        # Update the existing record
        myCollection.update_one(
            {"userID": userID, "transportationData.date": date},
            {"$set": {"transportationData.$.carbon_footprint": carbon_footprint}}
        )
    else:
        # Insert a new record
        myCollection.update_one(
            {"userID": userID},
            {
                "$push": {
                    "transportationData": carbon_footprint_data,
                }
            },
            upsert=True,
        )
    return jsonify({"Pass": "Updated Daily Form Information"}), 200


# Working 12-6-2024
@app.route("/transportation", methods=["POST"])
def transportSettings():
    data = request.get_json()
    userID = data.get("userID")
    print(userID)

    if not userID:
        return jsonify({"Error": "userID is required"}), 400

    # Extract data from the request
    fuel_type = data.get("fuel_type")
    mpg = int(data.get("mpg")) if fuel_type in ["Gasoline", "Diesel"] else None
    wh_mile = int(data.get("wh_mile")) if fuel_type in ["EV"] else None
    avg_miles = int(data.get("avg_miles")) if data.get("avg_miles") else None

    # Prepare transportation data
    vehicleData = {
        "fuel_type": fuel_type,
        "mpg": mpg,
        "wh_mile": wh_mile,
        "avg_miles": avg_miles,
    }

    myCollection.update_one(
        {"userID": userID}, {"$set": {"vehicleData": vehicleData}}, upsert=True
    )

    return jsonify({"Pass": "Updated Transportation Information"}), 200


@app.route("/upload", methods=["POST"])
def uploadCSV():
    # Check if a file was uploaded
    if "file" not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files["file"]
    userID = request.form.get("userID")

    # Ensure the file has content
    if file.filename == "":
        return jsonify({"error": "Empty filename"}), 400

    # Read the CSV into a Pandas DataFrame to check its structure
    try:
        df = pd.read_csv(file, skiprows=5, nrows=2)  # Get first 2 rows
        file.seek(0)

        # Check for specific columns to determine parsing method
        if "START DATE" in df.columns and "END DATE" in df.columns:
            return parseAnnualCSV(file, userID)
        elif (
            "START TIME" in df.columns
            and "END TIME" in df.columns
            and "EXPORT (kWh)" in df.columns
        ):
            setSolarTrue(userID)
            return parseMonthCSVSolar(file, userID)
        elif (
            "START TIME" in df.columns
            and "END TIME" in df.columns
            and "USAGE (kWh)" in df.columns
        ):
            setSolarFalse(userID)
            return parseMonthCSV(file, userID)

        else:
            return jsonify({"error": "Unknown CSV format"}), 400

    except Exception as e:
        return jsonify({"error": f"Failed to read CSV file: {str(e)}"}), 500


@app.route("/calculate_diet", methods=["POST"])
def calculate_footprint():
    userID = request.form.get("userID")
    # Ask user for MONTHLY INPUT of food intake
    data = request.get_json()
    total_carbon = 0

    for food, frequency in data["diet"].items():
        print(food, frequency)
        total_carbon += food_carbonVal.get(food) * frequency_multiplier.get(frequency)
        print(total_carbon)

    for food, frequency in data["plantBasedFoods"].items():
        total_carbon += food_carbonVal.get(food) * frequency_multiplier.get(frequency)
        print(total_carbon)

    # Calculate the weekly/monthly/annually carbon footprint (in kg of carbon)
    weekly_carbon_diet = round(
        (total_carbon * 12) / 52, 0
    )  # times 12 (months) divided by 52 (52 weeks)
    monthly_carbon_diet = round(total_carbon, 0)
    annually_carbon_diet = round(total_carbon * 12, 0)  # times 12 (months)

    # Call Gemini AI methods
    nutrition_analysis = gemini_analyze_nutrition(data)
    food_recommendations = gemini_suggest_sustainable_alternatives(data)

    footprint_data = {
        "userID": userID,
        "carbonFootprint": {
            "weekly": weekly_carbon_diet,
            "monthly": monthly_carbon_diet,
            "annually": annually_carbon_diet,
        },
        "nutritionAnalysis": nutrition_analysis,
        "foodRecommendations": food_recommendations,
    }

    # Insert or update the MongoDB document
    myCollection.update_one({"userID": userID}, {"$set": footprint_data}, upsert=True)

    return jsonify(
        {
            "carbonFootprintWeekly": weekly_carbon_diet,
            "carbonFootprintMonthly": monthly_carbon_diet,
            "carbonFootprintAnnually": annually_carbon_diet,
            "nutritionAnalysis": nutrition_analysis,
            "foodRecommendations": food_recommendations,
        }
    )


@app.route("/data", methods=["GET"])
def get_data():
    userID = request.args.get("userID")
    selected_date = request.args.get("selectedDate")
    chart_type = request.args.get("chartType")
    start_date = request.args.get("startDate")  # The date to filter on
    end_date = request.args.get(
        "endDate"
    )  # For other types like week/month/year, if needed
    month = request.args.get("month")
    year = request.args.get("year")

    print(selected_date)

    # Convert selectedDate to YYYY-MM-DD format
    if selected_date:
        try:
            cleaned_date = selected_date.split(" (")[0]  # Remove everything after " ("
            # Parse the incoming date string
            selected_date_obj = datetime.strptime(
                cleaned_date, "%a %b %d %Y %H:%M:%S %Z%z"
            )
            # Format the date to YYYY-MM-DD
            selected_date = selected_date_obj.strftime("%Y-%m-%d")
        except ValueError as e:
            return jsonify(
                {"error": f"Invalid date format for selectedDate: {str(e)}"}
            ), 400

    if not userID:
        return jsonify({"error": "userID is required"}), 400

    try:
        # Query all documents with the given userID
        user_data_documents = myCollection.find({"userID": userID}, {"_id": 0})

        if not user_data_documents:
            return jsonify({"error": "User not found"}), 404

        filtered_data = []

        # Iterate through all documents and look for the specified date
        for user_data in user_data_documents:
            if chart_type == "energy-day" and selected_date:
                # Look through the "dailyEnergyData" in each document and check the date
                starting = user_data.get("detailedEnergyUsageData", [])
                for entry in starting[0]:
                    timestamp = entry.get("timestamp")
                    if timestamp:
                        entry_date = timestamp.split(" ")[0]
                        print(entry_date)
                        if entry_date == selected_date:
                            filtered_data.append(entry)

                print(filtered_data)
                # If we found matching data, return it
                if filtered_data:
                    return jsonify(filtered_data), 200
                else:
                    return jsonify(
                        {"error": "No data found for the specified date"}
                    ), 404

        # If the chart type is for week/month/year, return the full dailyEnergyData
        if chart_type in ["energy-week", "energy-month", "energy-year"]:
            # Returning all data from dailyEnergyData across all documents
            all_data = [
                user_data.get("dailyEnergyData") for user_data in user_data_documents
            ]
            return jsonify(all_data), 200

        else:
            return jsonify({"error": "Invalid chart type"}), 400

    except Exception as e:
        return jsonify({"error": f"Failed to get data: {str(e)}"}), 500


@app.route("/transData", methods=["GET"])
def get_trans_data():
    userID = request.args.get("userID")
    chart_type = request.args.get("chartType")
    start_date = request.args.get("startDate")  # The date to filter on
    end_date = request.args.get("endDate")  # For other types like week/month/year, if needed
    month = request.args.get("month")
    year = request.args.get("year")

    if not userID:
        return jsonify({"error": "userID is required"}), 400
    
    try:
        # Query all documents with the given userID
        user_data_documents = myCollection.find({"userID": userID}, {"_id": 0})
        if not user_data_documents:
            return jsonify({"error": "User not found"}), 404
        
        # If the chart type is for week/month/year, return the full dailyEnergyData
        if chart_type in ["transportation-week", "transportation-month", "transportation-year"]:
            # Returning all data from dailyEnergyData across all documents
            all_data = [user_data.get("transportationData") for user_data in user_data_documents]
            print(all_data)
            return jsonify(all_data), 200
        
        else:
            return jsonify({"error": "Invalid chart type"}), 400

    except Exception as e:
        return jsonify({"error": f"Failed to get data: {str(e)}"}), 500


if __name__ == "__main__":
    app.run(port=5001, debug=True)
