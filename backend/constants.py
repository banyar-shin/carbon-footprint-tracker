CO2_PER_KWH = 0.0404
CO2_DIESEL = 10.19
CO2_GASOLINE = 9.46

# Carbon footprint data kg CO2 per kg of food
food_carbonVal = {
    "Beef": 2.25,  # 3oz serving
    "Chicken": 0.434,  # 3oz serving
    "Pork": 0.587,  # 3oz serving
    "Fish & Seafood": 0.38,  # 3.5oz serving
    "Eggs": 0.20,  # 1 egg or 2 oz serving
    "Milk & Yogurt": 0.31,  # 1 cup serving
    "Cheese": 0.56,  # 2oz serving
    "Beans & Legumes": 0.006,  # 0.5 cup serving
    "Fruits": 0.16,  # 1 apple or 5 oz serving
    "Vegetables": 0.03,  # 1 cup serving
    "Wheat & Grains": 0.11,  # 1 slice bread, 0.5c oats
    "Rice": 0.022,  # 0.5 cup serving
    "Fats & Oils": 0.069,  # 1 tbsp oil, 1 bag of chips
    "Nuts & Seeds": 0.034,  # 0.25 cup serving
}

frequency_multiplier = {
    "Never": 0,
    "1-3x / mo": 2,
    "1x / wk": 4,
    "2-3x / wk": 10,
    "4-6x / wk": 20,
    "1x / day": 30,
    "2-3x / day": 75,
    "4-6x / day": 150,
    "6+ / day": 200,
}

