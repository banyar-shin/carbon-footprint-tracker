import random
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from mongopass import mongopass
import certifi
from datetime import datetime, timedelta
from db import myCollection

# Constants
CO2_PER_KWH = 0.453  # in kg/kWh, assuming a value for simplicity
fuel_type = "EV"
wh_mile = 150
avg_miles = 20000
userID = "user_2oRzlTDQS2NyfZyDuuWPWaE3Bhh"


# Function to generate daily data with variations
def generate_sample_data(start_date, months):
    """Generates transportation data with varying carbon footprints for a specified number of months."""
    end_date = start_date + timedelta(days=30 * months)
    current_date = start_date

    while current_date < end_date:
        # Calculate miles driven (average per day)
        miles_driven = random.randint(10, 40)

        # Calculate base energy used for driving
        energy_used_driving = (miles_driven * wh_mile) / 1000  # kWh
        base_carbon_footprint = (miles_driven / 25) * 9.46

        # Introduce random variations in the carbon footprint

        # Prepare data for insertion
        carbon_footprint_data = {
            "date": current_date.strftime("%Y-%m-%d"),
            "carbon_footprint": round(
                base_carbon_footprint, 2
            ),  # Round for better readability
            "miles_driven": miles_driven,
        }

        # Check if the record for the given date already exists
        user_data = myCollection.find_one(
            {"userID": userID, "transportationData.date": carbon_footprint_data["date"]}
        )

        if user_data:
            # Update the existing record
            myCollection.update_one(
                {
                    "userID": userID,
                    "transportationData.date": carbon_footprint_data["date"],
                },
                {
                    "$set": {
                        "transportationData.$.carbon_footprint": base_carbon_footprint,
                        "transportationData.$.miles_driven": miles_driven,
                    }
                },
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

        # Increment date by 1 day
        current_date += timedelta(days=1)


# Start generating data
start_date = datetime(2024, 11, 1)
months_to_generate = 2
generate_sample_data(start_date, months_to_generate)

print("Sample data generation complete.")
