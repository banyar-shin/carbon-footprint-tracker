import { useState } from "react";
import { FiArrowRight } from "react-icons/fi";
import { useAuth } from '@clerk/clerk-react';


export default function MultiStepForm() {
  const { userId } = useAuth();
  const [currentStep, setCurrentStep] = useState(1); // Tracks the current step
  const [formData, setFormData] = useState({
    diet: {},
    plantBasedFoods: {},
    moreAboutYou: {},
  });
  const [carbonFootprintData, setCarbonFootprintData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (step, field, value) => {
    setFormData((prevData) => {
      console.log("Before update:", prevData);
  
      const updatedData = {
        ...prevData,
        [step]: {
          ...prevData[step],
          [field]: value,
        },
      };
  
      console.log("After update:", updatedData);
      return updatedData;
    });
  };
  
  const navigateToStep = (step) => {
    setCurrentStep(step);
  };

  const handleCalculate = async () => {
    const payload = {
      ...formData,
      userID: userId, // Add userID to the payload
    };
    setIsLoading(true);
  
    try {
      const response = await fetch(`http://localhost:5001/calculate_diet?userID=${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
  
      if (response.ok) {
        const result = await response.json();
        setCarbonFootprintData(result);
        setCurrentStep(4);
      } else {
        console.error("Error calculating carbon footprint");
      }
    } catch (error) {
      console.error("Error submitting data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full overflow-y-auto p-4 items-center text-center text-base-content space-y-4">
      {isLoading && (
        <div className="absolute inset-0 bg-gray-500 bg-opacity-50 backdrop-blur-md flex justify-center items-center z-50">
          <div className="flex justify-center items-center space-x-4">
            <div className="w-16 h-16 border-t-4 border-white border-solid rounded-full animate-spin"></div>
            <span className="text-white text-xl">Loading...</span>
          </div>
        </div>
      )}
      <div className="w-full bg-gradient-to-r from-primary via-secondary to-primary text-white text-center py-6 rounded-t-lg">
        <h1 className="text-4xl font-bold border-b-2 border-white pb-2 w-1/2 mx-auto">
          Diet Analysis 🍽️
        </h1>
        <p className="text-lg mt-2">
          Calculate the environmental impact of your food choices!
        </p>
      </div>
      <div className="card w-full bg-base-100 shadow-xl p-6 relative">
        {currentStep === 1 && (
          <DietPage data={formData.diet} handleChange={handleChange} />
        )}
        {currentStep === 2 && (
          <PlantBasedFoodsPage
            data={formData.plantBasedFoods}
            handleChange={handleChange}
          />
        )}
        {currentStep === 3 && (
          <MoreAboutYouPage
            data={formData.moreAboutYou}
            handleChange={handleChange}
            formData={formData}
            handleCalculate={handleCalculate}
          />
        )}
        {currentStep === 4 && (
          <ResultsPage carbonFootprintData={carbonFootprintData} />
        )}

        {/* Arrow navigation */}
        {currentStep < 3 && (
          <button
            onClick={() => setCurrentStep(currentStep + 1)}
            className="absolute top-1/2 right-0 transform -translate-y-1/2 text-primary text-3xl p-2 hover:text-white hover:bg-primary rounded-full transition duration-200"
          >
            <FiArrowRight />
          </button>
        )}

        {/* Step dots */}
        <div className="flex justify-center mt-6">
          {[1, 2, 3].map((step) => (
            <button
              key={step}
              onClick={() => navigateToStep(step)}
              className={`btn-circle ${
                step === currentStep ? "bg-primary" : "bg-gray-400"
              } mx-1`}
              style={{
                width: "15px",
                height: "15px",
                borderRadius: "50%",
              }}
            ></button>
          ))}
        </div>
      </div>
    </div>
  );
}

// Diet page component
function DietPage({ data, handleChange }) {
  const foodItems = [
    { name: "Beef", servingSize: "3 oz / serving" },
    { name: "Chicken", servingSize: "3 oz / serving" },
    { name: "Pork", servingSize: "3 oz / serving" },
    { name: "Fish & Seafood", servingSize: "3.5 oz / serving" },
    { name: "Eggs", servingSize: "1 egg or 2 oz / serving" },
    { name: "Milk & Yogurt", servingSize: "1 cup / serving" },
    { name: "Cheese", servingSize: "2 oz / serving" },
  ];

  const servingOptions = [
    "Never",
    "1-3x / mo",
    "1x / wk",
    "2-3x / wk",
    "4-6x / wk",
    "1x / day",
    "2-3x / day",
    "4-6x / day",
    "6+ / day",
  ];

  return (
    <div>
      <h2 className="text-xl text-center font-bold">Step 1 of 3: Animal Products</h2>
      <p className="text-gray-600 mb-4 text-center">
        How many servings of each food do you consume on an average week?
      </p>
      <div className="overflow-x-auto">
        <table className="table w-full border-collapse border-spacing-0">
          <thead>
            <tr>
              <th className="p-2"></th>
              {servingOptions.map((option, index) => (
                <th key={index} className="p-2 text-center font-normal">
                  {option}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {foodItems.map((item, rowIndex) => (
              <tr key={rowIndex}>
                <td className="p-2 text-center">
                  {item.name}
                  <div className="text-gray-500 text-sm mt-1">{item.servingSize}</div>
                </td>
                {servingOptions.map((option, colIndex) => (
                  <td key={colIndex} className="p-2 text-center">
                    <input
                      type="checkbox"
                      name={item.name}
                      checked={data[item.name] === option}
                      onChange={() =>
                        handleChange("diet", item.name, option)
                      }
                      className="checkbox checkbox-primary"
                      style={{
                        borderRadius: "50%",
                      }}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}




// Plant-based foods page component
function PlantBasedFoodsPage({ data, handleChange }) {
  console.log("Data passed to plant based foods page:", JSON.stringify(data, null, 2));
  const foodItems = [
    { name: "Beans & Legumes", servingSize: "0.5 cup cooked / serving" },
    { name: "Fruits", servingSize: "1 apple or 5 oz / serving" },
    { name: "Vegetables", servingSize: "1 cup / serving" },
    { name: "Wheat & Grains", servingSize: "1 slice bread, 0.5c oats" },
    { name: "Rice", servingSize: "0.5 cup cooked / serving" },
    { name: "Fats & Oils", servingSize: "1 tbsp oil, 1 bag of chips" },
    { name: "Nuts & Seeds", servingSize: "0.25 cup / serving" },
  ];

  const servingOptions = [
    "Never",
    "1-3x / mo",
    "1x / wk",
    "2-3x / wk",
    "4-6x / wk",
    "1x / day",
    "2-3x / day",
    "4-6x / day",
    "6+ / day",
  ];

  return (
    <div>
      <h2 className="text-xl text-center font-bold">Step 2 of 3: Plant-Based Foods</h2>
      <p className="text-gray-600 mb-4 text-center">
        How many servings of each food do you consume on an average week?
      </p>
      <div className="overflow-x-auto">
        <table className="table w-full border-collapse border-space-0">
          <thead>
            <tr>
              <th className="p-2"></th>
              {servingOptions.map((option, index) => (
                <th key={index} className="p-2 text-center font-normal">
                  {option}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {foodItems.map((item, rowIndex) => (
              <tr key={rowIndex}>
                <td className="p-2 text-center">
                  {item.name}
                  <div className="text-gray-500 text-sm mt-1">{item.servingSize}</div>
                </td>
                {servingOptions.map((option, colIndex) => (
                  <td key={colIndex} className="p-2 text-center">
                    <input
                      type="checkbox"
                      name={item.name}
                      checked={data[item.name] === option}
                      onChange={() =>
                        handleChange("plantBasedFoods", item.name, option)
                      }
                      className="checkbox checkbox-primary"
                      style={{
                        borderRadius: "50%",
                      }}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


// More about you page component
function MoreAboutYouPage({ data, handleChange, formData, handleCalculate }) {
  console.log("Data passed to MoreAboutYouPage:", JSON.stringify(data, null, 2));
  const fields = [
    { label: "Dietary Preference", name: "dietaryPreference", options: ["Prefer Not to Say", "Vegan", "Vegetarian", "Pescatarian", "Omnivore"] },
    { label: "Gender", name: "gender", options: ["Prefer Not to Say", "Male", "Female", "Non-binary", "Other"] },
    { label: "Age Range", name: "ageRange", options: ["Prefer Not to Say", "Under 18", "18-24", "25-34", "35-44", "45-54", "55-64", "65+"] },
    { label: "Ethnicity", name: "ethnicity", options: ["Prefer Not to Say", "White", "Black or African American", "Hispanic or Latino", "Asian", "Other"] },
    { label: "Annual Household Income", name: "income", options: ["Prefer Not to Say", "Under $20,000", "$20,000-$50,000", "$50,000-$100,000", "$100,000-$200,000", "$200,000+"] },
    { label: "Country", name: "country", options: ["Prefer Not to Say", "United States", "Canada", "United Kingdom", "Other"] },
  ];


  return (
    <div>
      <h2 className="text-xl font-bold">Step 3 of 3: More About You (Optional)</h2>
      <p className="text-gray-600 mb-4 text-center">
        Share more details to better tailor insights for you. All questions are optional.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields.map((field, index) => (
          <div key={index}>
            <label className="block mb-2 text-gray-700">{field.label}</label>
            <select
              className="select select-bordered w-full bg-white text-gray-700"
              value={data[field.name] || ""}
              onChange={(e) =>
                handleChange("moreAboutYou", field.name, e.target.value)
              }
            >
              <option value="">Select...</option>
              {field.options.map((option, idx) => (
                <option key={idx} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-6">
        <button
          onClick={handleCalculate}
          className="btn btn-primary px-6 py-2 text-white rounded-full"
        >
          Calculate Carbon Footprint
        </button>
      </div>
    </div>
  );
}

// Results page component
function ResultsPage({ carbonFootprintData }) {
  if (!carbonFootprintData) {
    return <p>No data available. Please calculate your footprint first.</p>;
  }

  const {
    carbonFootprintAnnually,
    carbonFootprintMonthly,
    carbonFootprintWeekly,
    foodRecommendations,
    nutritionAnalysis,
  } = carbonFootprintData;

  const [isExpandedNutrition, setIsExpandedNutrition] = useState(false); // Toggle expanded state
  const [isExpandedRecommendations, setIsExpandedRecommendations] = useState(false); // Toggle expanded state

  // Truncate content logic
  const truncateContent = (content, limit) => {
    if (content.length <= limit) return content; // No truncation needed
    return `${content.slice(0, limit)}...`;
  };

  // Limit for truncation (e.g., 300 characters)
  const truncationLimit = 300;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Your Carbon Footprint Results</h1>

      {/* Carbon Footprint Cards */}
      <div className="flex gap-10 mt-10 relative">
        {/* Left Card */}
        <div
          className="flex-1 bg-neutral-content shadow-lg rounded-lg p-4 text-center"
          style={{
            boxShadow: "-5px 5px 10px rgba(0, 0, 0, 0.2)",
            transform: "translateY(10px)", 
          }}
        >
          <h2 className="text-sm font-medium text-neutral uppercase tracking-wide mb-2">Carbon Footprint (Weekly)</h2>
          <p className="text-2xl font-extrabold text-neutral">{carbonFootprintWeekly} kg CO₂e</p>
        </div>

        {/* Middle Card */}
        <div
          className="flex-[2] bg-neutral-content shadow-xl rounded-lg p-4 text-center relative"
          style={{
            transform: "scale(1.2)", 
            zIndex: 1, 
            boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.3)", 
          }}
        >
          <h2 className="text-sm font-medium text-neutral uppercase tracking-wide mb-2">Carbon Footprint (Annually)</h2>
          <p className="text-4xl font-extrabold text-neutral">{carbonFootprintAnnually} kg CO₂e</p>
        </div>

        {/* Right Card */}
        <div
          className="flex-1 bg-neutral-content shadow-lg rounded-lg p-4 text-center"
          style={{
            boxShadow: "5px 5px 10px rgba(0, 0, 0, 0.2)",
            transform: "translateY(10px)", 
          }}
        >
          <h2 className="text-sm font-medium text-neutral uppercase tracking-wide mb-2">Carbon Footprint (Monthly)</h2>
          <p className="text-2xl font-extrabold text-neutral">{carbonFootprintMonthly} kg CO₂e</p>
        </div>
      </div>

      {/* Nutrition Analysis and Food Recommendations */}
      <div className="flex gap-4 mt-10">
        {/* Nutrition Analysis */}
        <div className="flex-1 bg-neutral-content shadow-lg rounded-lg p-4">
          <h2 className="text-xl font-bold shadow-lg">Nutrition Analysis</h2>
          <div
            className={`bg-neutral-content p-2 rounded mt-2 overflow-hidden transition-all duration-300`}
            style={{
              maxHeight: isExpandedNutrition ? "none" : "150px",
            }}
          >
            <pre className="text-sm whitespace-pre-wrap break-words">
              {JSON.stringify(nutritionAnalysis, null, 2)}
            </pre>
          </div>
          {JSON.stringify(nutritionAnalysis, null, 2).length > truncationLimit && (
            <button
              onClick={() => setIsExpandedNutrition(!isExpandedNutrition)}
              className="mt-2"
              aria-label={isExpandedNutrition ? "Show Less" : "Show More"}
            >
              {isExpandedNutrition ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 15l-7-7-7 7"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 9l7 7 7-7"
                  />
                </svg>
              )}
            </button>
          )}
        </div>

        {/* Food Recommendations */}
        <div className="flex-1 bg-neutral-content shadow-lg rounded-lg p-4">
          <h2 className="text-xl font-bold shadow-lg">Food Recommendations</h2>
          <div
            className={`bg-neutral-content p-2 rounded mt-2 overflow-hidden transition-all duration-300`}
            style={{
              maxHeight: isExpandedRecommendations ? "none" : "150px",
            }}
          >
            <pre className="text-sm whitespace-pre-wrap break-words">
              {JSON.stringify(foodRecommendations, null, 2)}
            </pre>
          </div>
          {JSON.stringify(foodRecommendations, null, 2).length > truncationLimit && (
            <button
              onClick={() => setIsExpandedRecommendations(!isExpandedRecommendations)}
              className="mt-2"
              aria-label={isExpandedRecommendations ? "Show Less" : "Show More"}
            >
              {isExpandedRecommendations ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 15l-7-7-7 7"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 9l7 7 7-7"
                  />
                </svg>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}








