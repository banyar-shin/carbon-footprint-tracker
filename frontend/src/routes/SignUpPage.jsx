import { SignUp } from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom';

export default function SignUpPage() {
  const navigate = useNavigate();

  return (
    <div className='w-full h-screen flex flex-col items-center justify-center'>
      <button
        className="absolute top-4 left-4 btn btn-primary py-2 px-4 rounded"
        onClick={() => navigate('/')}
      >
        Go Back
      </button>
      <SignUp
        path="/sign-up"
      />
    </div>
  )
}
