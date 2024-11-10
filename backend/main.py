import pandas as pd

from flask import jsonify
from datetime import datetime, timedelta
from db import myCollection

CO2_PER_KWH = 0.0404

def parseMonthCSV(file):
    df = pd.read_csv(file, skiprows = 5)
            
    # Drop the START TIME AND NOTES AND TYPE
    df = df.drop(columns=['TYPE', 'START TIME', 'NOTES'])

    # Add 1 minute to each END TIME and rename it to TIME
    df['TIME'] = df['END TIME'].apply(lambda x: (datetime.strptime(x, "%H:%M") + timedelta(minutes=1)).strftime("%H:%M"))
    df = df.drop(columns=["END TIME"])

    # Calculate daily energy usage (including import and export)
    dailyEnergyUsage = df.groupby('DATE').agg({
        'IMPORT (kWh)': 'sum',
        'EXPORT (kWh)': 'sum'
    }).reset_index()

    dailyEnergyUsage['Net Energy (kWh)'] = dailyEnergyUsage['IMPORT (kWh)'] - dailyEnergyUsage['EXPORT (kWh)']
    dailyEnergyUsage['Carbon Footprint (Kg CO2)'] = dailyEnergyUsage['Net Energy (kWh)'] * 0.0404

    # Structure the data for MongoDB
    for index, row in df.iterrows():
        detailedEnergyUsageData = {
            "userID": "userID",  # TODO: Add user ID 
            "timestamp": f"{row['DATE']} {row['TIME']}",
            "import_kwh": row["IMPORT (kWh)"],
            "export_kwh": row["EXPORT (kWh)"],
            "net_energy_kwh": row["IMPORT (kWh)"] - row["EXPORT (kWh)"],
            "carbon_footprint": round((row["IMPORT (kWh)"] - row["EXPORT (kWh)"]) * CO2_PER_KWH, 6) 
        }
        # Insert structured data into MongoDB TODO
        # Insert into DB, check for duplicate
        myCollection.update_one(
            {"timestamp": detailedEnergyUsageData["timestamp"]},
            {"$set": detailedEnergyUsageData},
            upsert=True
        )

    
    for index, row in dailyEnergyUsage.iterrows():
        dailyEnergyData = {
            "userID": "userID",  # TODO: Add user ID 
            "date": row['DATE'],
            "total_import_kwh": row["IMPORT (kWh)"],
            "total_export_kwh": row["EXPORT (kWh)"],
            "net_energy_kwh": round(row["Net Energy (kWh)"], 4),
            "carbon_footprint": round(row["Carbon Footprint (Kg CO2)"], 6)
        }
        # Insert structured data into MongoDB TODO
        # Insert into DB, check for duplicate
        myCollection.update_one(
            {"date": dailyEnergyData["date"]},
            {"$set": dailyEnergyData},
            upsert=True
        )
        print(dailyEnergyData)

    return jsonify({"Pass": "Parsed"}), 200


def parseAnnualCSV(file):

    df = pd.read_csv(file, skiprows = 5)
        
    df = df.drop(columns=['COST', 'START DATE', 'NOTES', 'TYPE'])

    df["END DATE"] = pd.to_datetime(df["END DATE"]).dt.to_period("M").astype(str)

    df = df.rename(columns={'END DATE':'DATE'})

    # Structure data for MongoDB
    for index, row in df.iterrows():
        monthlyEnergyData = {
            "userID": "userID",  # TODO: Add user ID 
            "date": row["DATE"],
            "usage": row["USAGE (kWh)"],
            "carbon_footprint": round(row["USAGE (kWh)"] * CO2_PER_KWH, 6)  # Calculate Carbon footprint per month
        }
        print(monthlyEnergyData)
        # Insert into DB, check for duplicate
        # myCollection.update_one(
        #     {"date": monthlyEnergyData["date"]},
        #     {"$set": monthlyEnergyData},
        #     upsert=True
        # )

    return jsonify({"Pass": "Parsed"}), 200







