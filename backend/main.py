import pandas as pd

from flask import Flask, render_template, request, jsonify
from datetime import datetime, timedelta
from db import myCollection

def parseMonthCSV(file):
    df = pd.read_csv(file,
                                skiprows = 5 # skip the first 5 rows
                                )
            
        # Drop the START TIME AND NOTES AND TYPE
    df = df.drop(columns=['TYPE', 'START TIME', 'NOTES'])

        # Add 1 minute to each END TIME and rename it to TIME
    df['TIME'] = df['END TIME'].apply(lambda x: (datetime.strptime(x, "%H:%M") + timedelta(minutes=1)).strftime("%H:%M"))
    df = df.drop(columns=["END TIME"])

    # Structure the data for MongoDB
    energy_usage_data = [
        {
            "date": row['DATE'],
            "time": row["TIME"],
            "import": row["IMPORT (kWh)"],
            "export": row["EXPORT (kWh)"]
        }
        for _, row in df.iterrows()
    ]

    userID = 11

     # Insert the structured data into MongoDB
    result = myCollection.update_one(
        {"userID": "userID"},  # TODO add user id
        {"$push": {"energyUsageData": {"$each": energy_usage_data}}},
        upsert=True
    )

    return jsonify({"Pass": "Parsed"}), 200



def parseAnnualCSV(file):
    df = pd.read_csv(file,
                                skiprows = 5 # skip the first 5 rows
                                )
        
    df = df.drop(columns=['COST', 'START DATE', 'NOTES', 'TYPE'])

    df["END DATE"] = pd.to_datetime(df["END DATE"]).dt.to_period("M").astype(str)

    df = df.rename(columns={'END DATE':'DATE'})

    # TODO add into mongo 
    # Structure data for MongoDB
    monthly_energy_usage_data = [
        {
            "date": row["DATE"],
            "usage": row["USAGE (kWh)"]
        }
        for _, row in df.iterrows()
    ]

    # Insert structured data into MongoDB
    result = myCollection.update_one(
        {"userID": "userID"},  # TODO add user id
        {"$push": {"monthlyEnergyUsageData": {"$each": monthly_energy_usage_data}}},
        upsert=True
    )
    return jsonify({"Pass": "Parsed"}), 200







