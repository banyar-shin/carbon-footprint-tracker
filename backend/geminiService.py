from flask import Flask, request, jsonify
import requests
from geminiKey import GEMINI_API_KEY
from constants import food_carbonVal

app = Flask(__name__)

# Configure your Gemini AI API Key
GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent"


def gemini_analyze_nutrition(food_data):
    payload = {
        "contents": [
            {
                "parts": [
                    {
                        "text": f"Be detailed. NO SPECIAL FORMATTING, PLAIN TEXT A-Za-z CHARACTERS ONLY. Do not include any newlines or line breaks in your response. \
                        Analyze the following foods, including which food items are sustainable and which should be changed, and correlate it with their \
                        carbon footprint based on these values (kg CO2 per kg): {food_carbonVal} and how often I eat those Foods within a month [foodItem, servings]: {food_data}. \
                        Provide a concise summary of the environmental impact. Which food item has the highest environmental impact, and which has the least? \
                        Provide a brief comparison."
                    }
                ]
            }
        ]
    }
    headers = {"Content-Type": "application/json"}

    response = requests.post(
        f"{GEMINI_API_URL}?key={GEMINI_API_KEY}", json=payload, headers=headers
    )
    cleaned_text = ""

    if response.status_code == 200:
        response_data = response.json()
        candidates = response_data.get("candidates", [])
        content = candidates[0].get("content", {})
        parts = content.get("parts", [])
        response_text = parts[0].get("text", "")
        cleaned_text = response_text.strip()
        return cleaned_text
    else:
        return {"error": "Failed to extract text from Gemini AI response"}


def gemini_suggest_sustainable_alternatives(food_data):
    payload = {
        "contents": [
            {
                "parts": [
                    {
                        "text": f"Be detailed. NO SPECIAL FORMATTING, PLAIN TEXT A-Za-z CHARACTERS ONLY. Do not include any newlines or line breaks in your response. \
                        Suggest sustainable alternatives for the following foods based on lower carbon footprint values (kg CO2 per kg) provided here: {food_carbonVal}. \
                        The following foods are based on how often I eat those Foods within a month [foodItem, servings]: {food_data}. \
                        Look at the key 'moreAboutYou' in the JSON response and recommend alternatives based on your dietary preferences, gender, age, ethnicity, income, country, and more."
                    }
                ]
            }
        ]
    }
    headers = {"Content-Type": "application/json"}

    response = requests.post(
        f"{GEMINI_API_URL}?key={GEMINI_API_KEY}", json=payload, headers=headers
    )
    cleaned_text = ""

    if response.status_code == 200:
        response_data = response.json()
        candidates = response_data.get("candidates", [])
        content = candidates[0].get("content", {})
        parts = content.get("parts", [])
        response_text = parts[0].get("text", "")
        cleaned_text = response_text.strip()
        return cleaned_text
    else:
        return {"error": "Failed to extract text from Gemini AI response"}

