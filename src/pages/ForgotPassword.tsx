import { useState } from 'react';
import { useNavigate } from 'react-router';
import Layout from '../components/Layout';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { setError('Email is required'); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { setError('Enter a valid email address'); return; }
    setSent(true);
  };

  if (sent) {
    return (
      <Layout showBack backTo="/login">
        <div className="bg-white rounded-2xl shadow-sm border border-[#E0E0E0] p-8 mt-2 flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full bg-[#E8F5E9] flex items-center justify-center mb-4">
            <svg width="40" height="40" fill="none" stroke="#2E7D32" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <h2 className="text-xl font-bold text-[#212121] mb-2">Reset Link Sent!</h2>
          <p className="text-sm text-[#757575] leading-relaxed mb-8">
            Please check your email address<br />to reset your password
          </p>
          <button
            onClick={() => navigate('/login')}
            className="w-full bg-[#C62828] hover:bg-[#B71C1C] text-white font-semibold py-3.5 rounded-xl text-sm transition-colors active:scale-[0.98]"
          >
            Back to Login
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout showBack backTo="/login">
      <div className="bg-white rounded-2xl shadow-sm border border-[#E0E0E0] p-6 mt-2">
        <h2 className="text-xl font-bold text-[#212121] mb-2">Forgot Password?</h2>
        <p className="text-sm text-[#757575] mb-6">
          Enter your registered email address to reset your password.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#424242] mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => { setEmail(e.target.value); setError(''); }}
              placeholder="Enter your email"
              className={`w-full border ${error ? 'border-[#C62828]' : 'border-[#E0E0E0]'} rounded-xl px-4 py-3 text-sm text-[#212121] placeholder-[#BDBDBD] outline-none focus:border-[#C62828] focus:ring-2 focus:ring-[#FFCDD2] transition-all bg-white`}
            />
            {error && <p className="text-xs text-[#C62828] mt-1">{error}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-[#C62828] hover:bg-[#B71C1C] text-white font-semibold py-3.5 rounded-xl text-sm transition-colors active:scale-[0.98]"
          >
            Send Reset Link
          </button>
        </form>

        <button
          onClick={() => navigate('/login')}
          className="block w-full text-center text-sm text-[#757575] font-medium mt-4 hover:text-[#C62828]"
        >
          Back to Login
        </button>
      </div>
    </Layout>
  );
}
