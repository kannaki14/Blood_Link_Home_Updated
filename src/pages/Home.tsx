import { useNavigate } from 'react-router';
import Layout from '../components/Layout';
import { supabase } from '../lib/supabase';

export default function Home() {
  const navigate = useNavigate();

  const handleDonate = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    navigate(session ? '/donate' : '/login', {
      state: session ? undefined : { from: '/donate' },
    });
  };

  return (
    <Layout>
      {/* Welcome quote */}
      <div className="text-center mb-6 px-2">
        <p className="text-base font-semibold text-[#C62828] leading-relaxed">
          “A small act of kindness can save a life.”
        </p>
        <p className="text-xs text-[#757575] mt-1">
          Every donation can make a difference.
        </p>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={handleDonate}
          className="bg-[#C62828] hover:bg-[#B71C1C] text-white rounded-2xl p-4 flex flex-col items-start gap-2 shadow-md transition-colors active:scale-[0.97]"
        >
          <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <path d="M12 2C12 2 5 9.5 5 14.5C5 18.1 8.1 21 12 21C15.9 21 19 18.1 19 14.5C19 9.5 12 2 12 2Z"/>
            </svg>
          </div>
          <div>
            <div className="font-semibold text-sm">Donate Blood</div>
            <div className="text-white/70 text-xs">Register as donor</div>
          </div>
        </button>

        <button
          onClick={() => navigate('/find')}
          className="bg-white hover:bg-[#FFEBEE] border border-[#E0E0E0] rounded-2xl p-4 flex flex-col items-start gap-2 shadow-sm transition-colors active:scale-[0.97]"
        >
          <div className="w-9 h-9 bg-[#FFEBEE] rounded-full flex items-center justify-center">
            <svg width="20" height="20" fill="none" stroke="#C62828" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/>
              <path strokeLinecap="round" d="m21 21-4.35-4.35"/>
            </svg>
          </div>
          <div>
            <div className="font-semibold text-sm text-[#212121]">Find Blood</div>
            <div className="text-[#9E9E9E] text-xs">Search donors</div>
          </div>
        </button>
      </div>
            {/* How Blood Link Works */}
      <div className="mt-8">
        <h2 className="text-base font-bold text-[#212121] text-center mb-4">
          How Blood Link Works
        </h2>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white border border-[#E0E0E0] rounded-2xl p-4 text-center shadow-sm">
            <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-[#FFEBEE] flex items-center justify-center">
              <span className="text-[#C62828] font-bold">1</span>
            </div>
            <h3 className="text-sm font-semibold text-[#212121]">Find</h3>
            <p className="text-xs text-[#757575] mt-1">
              Search for blood donors
            </p>
          </div>

          <div className="bg-white border border-[#E0E0E0] rounded-2xl p-4 text-center shadow-sm">
            <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-[#FFEBEE] flex items-center justify-center">
              <span className="text-[#C62828] font-bold">2</span>
            </div>
            <h3 className="text-sm font-semibold text-[#212121]">Connect</h3>
            <p className="text-xs text-[#757575] mt-1">
              Connect with a donor
            </p>
          </div>

          <div className="bg-white border border-[#E0E0E0] rounded-2xl p-4 text-center shadow-sm">
            <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-[#E8F5E9] flex items-center justify-center">
              <span className="text-[#2E7D32] font-bold">3</span>
            </div>
            <h3 className="text-sm font-semibold text-[#212121]">Save</h3>
            <p className="text-xs text-[#757575] mt-1">
              Help save a life
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
