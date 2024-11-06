from flask import Flask, render_template, request, jsonify

import subprocess as sp
from pymongo import MongoClient
from mongopass import mongopass
import pandas as pd
from main import *

app = Flask("CFTbackend")

client = MongoClient(mongopass)
db = client.curd
myCollection = db.myColl


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
        
        # Check for specific columns to determine parsing method
        if 'START DATE' in df.columns and 'END DATE' in df.columns:
            return parseAnnualCSV(file)
        elif 'START TIME' in df.columns and 'END TIME' in df.columns:
           
            return parseMonthCSV(file)
        
        else:
            return jsonify({"error": "Unknown CSV format"}), 400
    
    except Exception as e:
        return jsonify({"error": f"Failed to read CSV file: {str(e)}"}), 500
    


app.run(port=5000, debug=True)
