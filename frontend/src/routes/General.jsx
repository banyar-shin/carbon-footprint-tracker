import { useState } from 'react'
import { useAuth } from '@clerk/clerk-react'
import Chart from './../components/Chart'

export default function General() {
  const { userId } = useAuth()
  const [chart, setChart] = useState('general-week')

  const handleDailyForm = async (event) => {
    event.preventDefault();
    // TODO: implement handleDailyForm function (follow handleUpload)
  }

  const handleUpload = async (event) => {
    event.preventDefault();

    const fileInput = event.target.querySelector('input[type="file"]');
    const file = fileInput.files[0];

    if (!file) {
      alert('Please select a file to upload');
      return;
    }

    if (!file.name.endsWith('.csv')) {
      alert('Please upload a CSV file');
      return;
    }

    try {
      if (!userId) {
        throw new Error('Upload failed: Invalid UserID')
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('userID', userId)

      const response = await fetch("http://localhost:5001/upload", {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Upload successful:', data);

      fileInput.value = '';

      document.getElementById('upload_csv_modal').close();

      alert('File uploaded successfully!');

    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload file. Please try again.');
    }
  };

  return (
    <div className="h-full overflow-y-auto p-4 items-center text-center text-base-content space-y-4" >
      <div className="p-6 bg-base-200 rounded-lg grid grid-cols-2 gap-6 justify-center">
        <button className="btn btn-secondary w-full" onClick={() => document.getElementById('upload_csv_modal').showModal()}>
          Upload PG&E File
        </button>
        <button className="btn btn-secondary w-full" onClick={() => document.getElementById('add_data_modal').showModal()}>
          Add Today's Data
        </button>
      </div>

      <div className="w-full p-6 rounded-lg bg-base-200 space-y-6">
        <Chart chart={chart} setChart={setChart} />
        <div className="grid grid-cols-3 justify-center w-full gap-4">
          <button
            className={`btn btn-secondary ${chart === 'general-week' ? 'text-white border border-white btn-active' : ''}`}
            onClick={() => setChart('general-week')}
          >
            Weekly
          </button>
          <button
            className={`btn btn-secondary ${chart === 'general-month' ? 'text-white border border-white btn-active' : ''}`}
            onClick={() => setChart('general-month')}
          >
            Monthly
          </button>
          <button
            className={`btn btn-secondary ${chart === 'general-year' ? 'text-white border border-white btn-active' : ''}`}
            onClick={() => setChart('general-year')}
          >
            Yearly
          </button>
        </div>
      </div>

      <div className="bg-base-200 p-8 rounded-lg">
        <h3 className='text-lg text-left font-semibold'>Today's Carbon Footprint</h3>
        <p className='text-md text-left'>Value</p>
        <div className='divider' />
        <h3 className='text-lg text-left font-semibold'>Average Weekly Carbon Footprint</h3>
        <p className='text-md text-left'>Value</p>
        <div className='divider' />
        <h3 className='text-lg text-left font-semibold'>Average Monthly Carbon Footprint</h3>
        <p className='text-md text-left'>Value</p>
        <div className='divider' />
        <h3 className='text-lg text-left font-semibold'>Average Annual Carbon Footprint</h3>
        <p className='text-md text-left'>Value</p>
      </div>

      <dialog id="upload_csv_modal" className="modal">
        <div className="modal-box w-[32rem] max-w-xl">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>
          <h3 className="font-bold w-full text-xl py-6">Upload PG&E File</h3>
          <form onSubmit={handleUpload} className='w-full flex flex-col px-6 py-12 rounded-xl bg-base-200 justify-center items-center'>
            <label className="form-control flex w-full max-w-xs">
              <div className="label">
                <span className="label-text font-semibold">Pick a file</span>
              </div>
              <input type="file" accept=".csv" className="file-input file-input-bordered max-w-xs" />
            </label>
            <div className='divider' />
            <div className='w-full px-24'>
              <button type="submit" className="btn btn-primary w-full">
                Upload File
              </button>
            </div>
          </form>
        </div>
      </dialog>

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
    </div >
  );
}
