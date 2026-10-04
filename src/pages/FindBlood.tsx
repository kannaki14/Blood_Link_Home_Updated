import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import Layout from '../components/Layout';
import { donors, bloodGroups } from '../data/donors';
import type { Donor } from '../data/donors';
import { donorFromRow, type DonorRow } from '../lib/donors';
import { supabase } from '../lib/supabase';

export default function FindBlood() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [donorList, setDonorList] = useState<Donor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadDonors() {
      const { data, error } = await supabase
        .from('donors')
        .select('*')
        .not('blood_group', 'is', null)
        .order('created_at', { ascending: false });

      if (!active) return;
      if (error) {
        setLoadError('Live donor data is unavailable. Showing demo donors.');
        setDonorList(donors);
      } else {
        setDonorList(data?.length ? (data as DonorRow[]).map(donorFromRow) : donors);
      }
      setIsLoading(false);
    }

    loadDonors();
    return () => { active = false; };
  }, []);

  const filtered = donorList.filter(d => {
    const matchSearch = !search || d.name.toLowerCase().includes(search.toLowerCase()) || d.location.toLowerCase().includes(search.toLowerCase());
    const matchGroup = !selectedGroup || d.bloodGroup === selectedGroup;
    return matchSearch && matchGroup;
  });

  return (
    <Layout showBack backTo="/home">
      <h2 className="text-lg font-bold text-[#212121] mb-4">Blood Donors</h2>

      {/* Search bar */}
      <div className="relative mb-3">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[#BDBDBD]" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8"/>
          <path strokeLinecap="round" d="m21 21-4.35-4.35"/>
        </svg>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search donors..."
          className="w-full border border-[#E0E0E0] rounded-xl pl-9 pr-3 py-2.5 text-sm bg-white placeholder-[#BDBDBD] outline-none focus:border-[#C62828] focus:ring-1 focus:ring-[#FFCDD2]"
        />
      </div>

      {/* Blood group filter */}
      <div className="flex gap-2 flex-wrap mb-4">
        <button
          onClick={() => setSelectedGroup('')}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${!selectedGroup ? 'bg-[#C62828] text-white border-[#C62828]' : 'bg-white text-[#757575] border-[#E0E0E0]'}`}
        >
          All
        </button>
        {bloodGroups.map(g => (
          <button
            key={g}
            onClick={() => setSelectedGroup(g === selectedGroup ? '' : g)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${selectedGroup === g ? 'bg-[#C62828] text-white border-[#C62828]' : 'bg-white text-[#757575] border-[#E0E0E0]'}`}
          >
            {g}
          </button>
        ))}
      </div>

      {/* Donor list */}
      {loadError && <p className="text-xs text-[#C62828] mb-3">{loadError}</p>}
      {isLoading ? (
        <div className="text-center py-10 text-[#9E9E9E] text-sm">Loading donors...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-10 text-[#9E9E9E] text-sm">No donors found for selected group</div>
      ) : (
        <div className="space-y-3">
          {filtered.map(d => (
            <div key={d.id} className="bg-white rounded-2xl border border-[#E0E0E0] p-4 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-11 h-11 rounded-full bg-[#FFEBEE] flex items-center justify-center text-[#C62828] font-bold text-sm flex-shrink-0">
                  {d.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-[#212121] text-sm">{d.name}</div>
                  <span className="bg-[#FFEBEE] text-[#C62828] text-xs font-bold px-2 py-0.5 rounded-full">
                    {d.bloodGroup}
                  </span>
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${d.availability === 'Available' ? 'bg-[#E8F5E9] text-[#2E7D32]' : 'bg-[#FAFAFA] text-[#9E9E9E]'}`}>
                  {d.availability}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-x-2 gap-y-1 mb-3">
                <div className="flex items-center gap-1.5 text-xs text-[#757575]">
                  <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  {d.location}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-[#757575]">
                  <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                  </svg>
                  {d.phone}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-[#757575] col-span-2">
                  <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  Last Donation: {d.lastDonation}
                </div>
              </div>
              <button
                onClick={() => navigate(`/donor/${d.id}`)}
                className="w-full bg-[#C62828] hover:bg-[#B71C1C] text-white text-sm font-semibold py-2.5 rounded-xl transition-colors active:scale-[0.98]"
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}
