import { useNavigate } from 'react-router';
import Layout from '../components/Layout';

export default function RegistrationSuccess() {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="bg-white rounded-2xl shadow-sm border border-[#E0E0E0] p-8 mt-2 flex flex-col items-center text-center">
        <div className="w-24 h-24 rounded-full bg-[#E8F5E9] flex items-center justify-center mb-5">
          <svg width="48" height="48" fill="none" stroke="#2E7D32" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>

        <h2 className="text-xl font-bold text-[#212121] mb-2">Registration Successful!</h2>
        <p className="text-sm text-[#757575] leading-relaxed mb-8">
          Your account has been created successfully.<br />
          Welcome to Blood Link!
        </p>

        <button
          onClick={() => navigate('/home')}
          className="w-full bg-[#C62828] hover:bg-[#B71C1C] text-white font-semibold py-3.5 rounded-xl text-sm transition-colors active:scale-[0.98]"
        >
          Continue to Home
        </button>
      </div>
    </Layout>
  );
}
