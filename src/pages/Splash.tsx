import { useNavigate } from 'react-router';


function BloodDropIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="#C62828" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C12 2 4 10.5 4 15.5C4 19.6 7.6 23 12 23C16.4 23 20 19.6 20 15.5C20 10.5 12 2 12 2Z"/>
    </svg>
  );
}

export default function Splash() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="bg-[#C62828] px-5 py-4 shadow-md">
        <div className="max-w-md mx-auto flex items-center gap-2">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C12 2 4 10.5 4 15.5C4 19.6 7.6 23 12 23C16.4 23 20 19.6 20 15.5C20 10.5 12 2 12 2Z"/>
          </svg>
          <div>
            <div className="text-white font-bold text-base leading-tight">Blood Link</div>
            <div className="text-white/80 text-[10px] leading-tight">Connecting Donors, Saving Lives</div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center px-6 max-w-md mx-auto w-full">
        {/* Illustration */}
        <div className="relative mb-8 w-52 h-52 flex items-center justify-center">
          <img
            src="/welcome.png"
            alt=""
            className="w-52 h-auto"
          />
        </div>

        <h1 className="text-2xl font-bold text-[#212121] text-center mb-3">
          Welcome to Blood Link
        </h1>
        <p className="text-[#757575] text-sm text-center leading-relaxed mb-10">
          Find blood donors quickly<br />and save lives with one click.
        </p>

        <button
          onClick={() => navigate('/login')}
          className="w-full bg-[#C62828] hover:bg-[#B71C1C] text-white font-semibold py-3.5 rounded-xl text-base transition-colors active:scale-[0.98] shadow-md"
        >
          Get started
        </button>
      </div>
    </div>
  );
}
