import { useState } from "react";
import Chart from './../components/Chart'
import { useAuth } from '@clerk/clerk-react';

export default function Energy() {
  const [hasSolar, setHasSolar] = useState(null);
  const { userId } = useAuth();
  const [chart, setChart] = useState('energy-week')

  const handleDailyForm = async (event) => {
    event.preventDefault();
    // TODO: implement handleDailyForm function (follow handleUpload)
  }
  const handleSolarSubmit = async (value) => {
    try {
      if (!userId) {
        throw new Error('Submission failed: Invalid UserID');
      }

      console.log("Form Data:", userId); // Debugging

      const response = await fetch("http://127.0.0.1:5001/energy", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userID: userId,
          hasSolar: value,
        }),
      });

      if (!response.ok) {
        throw new Error(`Submission failed: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Submission successful:', data);

      alert('Solar information updated successfully!');
    } catch (error) {
      console.error('Error updating solar information:', error);
      alert('Failed to update solar information. Please try again.');
    }
  };

  return (
    <div className="h-full overflow-y-auto p-4 items-center text-center text-base-content space-y-4">
      <div className="p-6 bg-base-200 rounded-lg justify-center">
        <button className="btn btn-secondary w-full" onClick={() => document.getElementById('add_data_modal').showModal()}>
          Add Today's Data
        </button>
      </div>
      <div className="w-full p-6 rounded-lg bg-base-200 space-y-6">
        <Chart className='transition-all duration-100' chart={chart} setChart={setChart} />
        <div className="grid grid-cols-4 justify-center w-full gap-4">
          <button
            className={`btn btn-secondary ${chart === 'energy-day' ? 'text-white border border-white btn-active' : ''}`}
            onClick={() => setChart('energy-day')}
          >
            Daily
          </button>
          <button
            className={`btn btn-secondary ${chart === 'energy-week' ? 'text-white border border-white btn-active' : ''}`}
            onClick={() => setChart('energy-week')}
          >
            Weekly
          </button>
          <button
            className={`btn btn-secondary ${chart === 'energy-month' ? 'text-white border border-white btn-active' : ''}`}
            onClick={() => setChart('energy-month')}
          >
            Monthly
          </button>
          <button
            className={`btn btn-secondary ${chart === 'energy-year' ? 'text-white border border-white btn-active' : ''}`}
            onClick={() => setChart('energy-year')}
          >
            Yearly
          </button>
        </div>
      </div>
      <dialog id="add_data_modal" className="modal">
        <div className="modal-box w-[48rem] max-w-5xl">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>
          <h3 className="font-bold w-full text-xl py-6">Add Today's Data</h3>
          <form onSubmit={handleDailyForm} className='w-full flex flex-col px-6 py-12 rounded-xl bg-base-200 justify-center items-center'>
            {/* TODO: Daily Form: Use components from here: https://daisyui.com/components/select/ */}
            <div className='divider' />
            <div className='w-full px-24'>
              <button type="submit" className="btn btn-primary w-full">
                Submit
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
}
