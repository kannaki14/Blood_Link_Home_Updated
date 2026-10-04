import { useNavigate } from 'react-router';

interface LayoutProps {
  children: React.ReactNode;
  showBack?: boolean;
  backTo?: string;
}

function BloodDropIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C12 2 4 10.5 4 15.5C4 19.6 7.6 23 12 23C16.4 23 20 19.6 20 15.5C20 10.5 12 2 12 2Z"/>
    </svg>
  );
}

export function Header({ showBack, backTo }: { showBack?: boolean; backTo?: string }) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (backTo) navigate(backTo);
    else navigate(-1);
  };

  return (
    <header className="bg-[#C62828] px-4 py-4 shadow-md">
      <div className="max-w-md mx-auto flex items-center gap-2">
        {showBack && (
          <button
            onClick={handleBack}
            className="text-white mr-1 p-1 rounded-full hover:bg-white/20 transition-colors"
            aria-label="Go back"
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
            </svg>
          </button>
        )}
        <div className="flex items-center gap-2">
          <BloodDropIcon />
          <div>
            <div className="text-white font-bold text-base leading-tight">Blood Link</div>
            <div className="text-white/80 text-[10px] leading-tight">Connecting Donors, Saving Lives</div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default function Layout({ children, showBack, backTo }: LayoutProps) {
  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <Header showBack={showBack} backTo={backTo} />
      <main className="max-w-md mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
}
