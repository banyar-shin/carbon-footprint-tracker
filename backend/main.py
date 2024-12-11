import pandas as pd

from flask import jsonify
from datetime import datetime, timedelta
from dateutil import parser
from db import myCollection
from constants import *


def parseMonthCSVSolar(file, userID):
    df = pd.read_csv(file, skiprows=5)

    # Drop the START TIME AND NOTES AND TYPE
    df = df.drop(columns=["TYPE", "START TIME", "NOTES"])

    # Standardize the 'DATE' column
    df["DATE"] = df["DATE"].apply(standardize_date)

    # Add 1 minute to each END TIME and rename it to TIME
    df["TIME"] = df["END TIME"].apply(
        lambda x: (datetime.strptime(x, "%H:%M") + timedelta(minutes=1)).strftime(
            "%H:%M"
        )
    )
    df = df.drop(columns=["END TIME"])

    # Calculate daily energy usage (including import and export)
    dailyEnergyUsage = (
        df.groupby("DATE")
        .agg({"IMPORT (kWh)": "sum", "EXPORT (kWh)": "sum"})
        .reset_index()
    )

    dailyEnergyUsage["Net Energy (kWh)"] = (
        dailyEnergyUsage["IMPORT (kWh)"] - dailyEnergyUsage["EXPORT (kWh)"]
    )
    dailyEnergyUsage["Carbon Footprint (Kg CO2)"] = (
        dailyEnergyUsage["Net Energy (kWh)"] * CO2_PER_KWH
    )

    # Prepare detailed energy usage data
    detailedEnergyUsageData = []
    for index, row in df.iterrows():
        # Parse the time string into a datetime object
        time_obj = datetime.strptime(row["TIME"], "%H:%M")
        if time_obj.minute == 30 or time_obj.minute == 00:
            detailedEnergyUsageData.append(
                {
                    "timestamp": f"{row['DATE']} {row['TIME']}",
                    "import_kwh": row["IMPORT (kWh)"],
                    "export_kwh": row["EXPORT (kWh)"],
                    "net_energy_kwh": row["IMPORT (kWh)"] - row["EXPORT (kWh)"],
                    "carbon_footprint": round(
                        (row["IMPORT (kWh)"] - row["EXPORT (kWh)"]) * CO2_PER_KWH, 6
                    ),
                }
            )

    # Prepare daily energy data
    dailyEnergyData = []
    for index, row in dailyEnergyUsage.iterrows():
        dailyEnergyData.append(
            {
                "date": row["DATE"],
                "total_import_kwh": row["IMPORT (kWh)"],
                "total_export_kwh": row["EXPORT (kWh)"],
                "net_energy_kwh": round(row["Net Energy (kWh)"], 4),
                "carbon_footprint": round(row["Carbon Footprint (Kg CO2)"], 6),
            }
        )

    # Insert into MongoDB
    myCollection.update_one(
        {"userID": userID},
        {
            "$addToSet": {
                "detailedEnergyUsageData": {"$each": detailedEnergyUsageData},
                "dailyEnergyData": {"$each": dailyEnergyData},
            }
        },
        upsert=True,
    )

    return jsonify({"Pass": "Parsed"}), 200


def parseMonthCSV(file, userID):
    df = pd.read_csv(file, skiprows=5)

    # Drop the START TIME AND NOTES AND TYPE
    df = df.drop(columns=["TYPE", "START TIME", "NOTES"])

    # Standardize the 'DATE' column
    df["DATE"] = df["DATE"].apply(standardize_date)

    # Add 1 minute to each END TIME and rename it to TIME
    df["TIME"] = df["END TIME"].apply(
        lambda x: (datetime.strptime(x, "%H:%M") + timedelta(minutes=1)).strftime(
            "%H:%M"
        )
    )
    df = df.drop(columns=["END TIME"])

    # Calculate daily energy usage (including import and export)
    dailyEnergyUsage = df.groupby("DATE").agg({"USAGE (kWh)": "sum"}).reset_index()

    dailyEnergyUsage["Carbon Footprint (Kg CO2)"] = (
        dailyEnergyUsage["USAGE (kWh)"] * CO2_PER_KWH
    )

    # Prepare detailed energy usage data
    detailedEnergyUsageData = []
    for index, row in df.iterrows():
        # Parse the time string into a datetime object
        time_obj = datetime.strptime(row["TIME"], "%H:%M")
        if time_obj.minute == 30 or time_obj.minute == 00:
            detailedEnergyUsageData.append(
                {
                    "timestamp": f"{row['DATE']} {row['TIME']}",
                    "usage_kwh": row["USAGE (kWh)"],
                    "carbon_footprint": round((row["USAGE (kWh)"]) * CO2_PER_KWH, 6),
                }
            )

    # Prepare daily energy data
    dailyEnergyData = []
    for index, row in dailyEnergyUsage.iterrows():
        dailyEnergyData.append(
            {
                "date": row["DATE"],
                "total_usage_kwh": row["USAGE (kWh)"],
                "carbon_footprint": round(row["Carbon Footprint (Kg CO2)"], 6),
            }
        )

    # Insert into MongoDB
    myCollection.update_one(
        {"userID": userID},
        {
            "$addToSet": {
                "detailedEnergyUsageData": {"$each": detailedEnergyUsageData},
                "dailyEnergyData": {"$each": dailyEnergyData},
            }
        },
        upsert=True,
    )

    return jsonify({"Pass": "Parsed"}), 200


def standardize_date(dateString):
    return parser.parse(dateString).strftime("%Y-%m-%d")


def parseAnnualCSV(file, userID):
    df = pd.read_csv(file, skiprows=5)

    df = df.drop(columns=["COST", "START DATE", "NOTES", "TYPE"])

    df["END DATE"] = pd.to_datetime(df["END DATE"]).dt.to_period("M").astype(str)

    df = df.rename(columns={"END DATE": "DATE"})

    # Prepare monthly energy data
    monthlyEnergyData = []
    for index, row in df.iterrows():
        monthlyEnergyData.append(
            {
                "date": row["DATE"],
                "usage": row["USAGE (kWh)"],
                "carbon_footprint": round(
                    row["USAGE (kWh)"] * CO2_PER_KWH, 6
                ),  # Calculate Carbon footprint per month
            }
        )

    myCollection.update_one(
        {"userID": userID},
        {
            "$addToSet": {
                "monthlyEnergyData": {"$each": monthlyEnergyData},
            }
        },
        upsert=True,
    )

    return jsonify({"Pass": "Parsed"}), 200


def getVehicleData(userID):
    try:
        # Query the MongoDB collection for vehicle information
        vehicleSettings = myCollection.find_one({"userID": userID})

        if vehicleSettings:
            return vehicleSettings.get("vehicleData")
        else:
            return None  # Return None if no record is found
    except Exception as e:
        print(f"Error getting vehicle info: {str(e)}")
        return None


def getEnergyData(userID):
    try:
        # Query the MongoDB collection for vehicle information
        energySettings = myCollection.find_one({"userID": userID})

        if energySettings:
            return energySettings.get("energyData")
        else:
            return None  # Return None if no record is found
    except Exception as e:
        print(f"Error getting energy info: {str(e)}")
        return None


def getEnergyProduced(userID, date):
    try:
        # Query the MongoDB collection for energy produced a specific day
        energyOnDay = myCollection.find_one({"userID": userID, "dailyEnergyData": date})

        if energyOnDay:
            return energyOnDay.get("total_export_kwh")
        else:
            return None  # Return None if no record is found
    except Exception as e:
        print(f"Error getting energy info: {str(e)}")
        return None


def setSolarTrue(userID):
    # Prepare power data
    energyData = {"hasSolar": True}

    myCollection.update_one(
        {"userID": userID}, {"$set": {"energyData": energyData}}, upsert=True
    )


def setSolarFalse(userID):
    # Prepare power data
    energyData = {"hasSolar": False}

    myCollection.update_one(
        {"userID": userID}, {"$set": {"energyData": energyData}}, upsert=True
    )
