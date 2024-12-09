import React, { useState } from "react";

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqItems = [
    {
      question: "What if I don't know how to access PG&E Data?",
      answer: (
        <>
          Click the <a href="http://127.0.0.1:5174/dashboard/tutorial" className="text-primary underline">blue hyperlink</a> how to access PG&E data. We have a step-by-step guide showing you how to.
        </>
      ),
    },
    {
      question: "Can I submit CSV whenever?",
      answer:
        "Yes. You can estimate for your original inputs and come in afterwards to upload the CSV. It will automatically override your estimated inputs.",
    },
    {
      question: "What if I don't track my food intake?",
      answer: "You can give us a rough estimate of how many calories you eat.",
    },
    {
      question: "Is my data stored securely?",
      answer: "Yes, we use industry-standard encryption to ensure your data is stored securely and is not shared with third parties.",
    },
    {
      question: "Can I view a summary of my carbon footprint?",
      answer: "Yes, once you input all the required data, you can view a detailed summary on the dashboard.",
    },
    {
      question: "How do I know the environmental impact of my energy usage?",
      answer: "After providing your energy data, we calculate the carbon emissions and display it in the energy section.",
    },
  ];

  const toggleFAQ = (index) => { 
    setActiveIndex(index === activeIndex ? null : index);
  };

  return (
    <div className="h-full overflow-y-auto p-4 items-center text-center text-base-content space-y-4">
      <div className="w-full p-6 rounded-lg bg-base-200 space-y-6">
        <h1 className="text-2xl font-bold mb-4">Frequently Asked Questions</h1>
        <div className="space-y-4">
          {faqItems.map((item, index) => (
            <div
              key={index}
              className="p-4 border rounded-lg bg-base-100 shadow-md"
            >
              <button
                className="w-full text-left font-medium text-lg flex justify-between items-center"
                onClick={() => toggleFAQ(index)}
              >
                {item.question}
                <span className="text-base-content">{activeIndex === index ? "\u25BC" : "\u25B6"}</span>
              </button>
              {activeIndex === index && (
                <p className="mt-2 text-left text-base">{item.answer}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
