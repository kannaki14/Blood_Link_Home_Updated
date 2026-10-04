import { useNavigate } from 'react-router';
import type { Donor } from '../data/donors';

interface DonorCardProps {
  donor: Donor;
  compact?: boolean;
}

export default function DonorCard({ donor, compact }: DonorCardProps) {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl border border-[#E0E0E0] p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-full bg-[#FFEBEE] flex items-center justify-center text-[#C62828] font-bold text-sm flex-shrink-0">
          {donor.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-[#212121] text-sm">{donor.name}</div>
          <div className="flex items-center gap-1 mt-0.5">
            <span className="bg-[#FFEBEE] text-[#C62828] text-xs font-bold px-2 py-0.5 rounded-full">
              {donor.bloodGroup}
            </span>
          </div>
          {!compact && (
            <div className="mt-2 space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-[#757575]">
                <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                {donor.location}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-[#757575]">
                <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                </svg>
                {donor.phone}
              </div>
            </div>
          )}
        </div>
      </div>
      <button
        onClick={() => navigate(`/donor/${donor.id}`)}
        className="mt-3 w-full bg-[#C62828] hover:bg-[#B71C1C] text-white text-sm font-semibold py-2.5 rounded-xl transition-colors active:scale-[0.98]"
      >
        View Details
      </button>
    </div>
  );
}
