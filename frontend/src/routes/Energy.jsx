import { useState } from "react";

export default function Energy() {
  const [data, setData] = useState([]);
  const [file, setFile] = useState(null);

  // Handle CSV file selection
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  // Handle file upload
  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData
      });

      const result = await response.text();
      if (result.error) {
        console.error("Error:", result.error);
      } else {
        console.log(result.data); // Assume backend sends processed data for chart
      }
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  return (
    <div className="h-full overflow-y-auto p-4 items-center text-center text-base-content space-y-4">
      <h2 className="text-3xl mb-4">Energy Usage Tracker</h2>

      {/* File Upload */}
      <div className="mb-4">
        <input type="file" accept=".csv" onChange={handleFileChange} className="mb-2" />
        <button
          onClick={handleUpload}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          Upload CSV
        </button>
      </div>
    </div>
  );
}
