import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import Layout from '../components/Layout';
import { donors, type Donor } from '../data/donors';
import { donorFromRow, type DonorRow } from '../lib/donors';
import { supabase } from '../lib/supabase'

export default function DonorDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [donor, setDonor] = useState<Donor | undefined>(() =>
    donors.find(d => String(d.id) === id),
  );
  const [isLoading, setIsLoading] = useState(!donor);
  const [loadError, setLoadError] = useState('');

  const [showRequestForm, setShowRequestForm] = useState(false);
  const [form, setForm] = useState({ patientName: '', hospitalName: '', unitsRequired: '', contact: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    if (donor || !id) return;
    let active = true;

    async function loadDonor() {
      const { data, error } = await supabase
        .from('donors')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (!active) return;
      if (error) setLoadError('We could not load this donor. Please try again.');
      if (data) setDonor(donorFromRow(data as DonorRow));
      setIsLoading(false);
    }

    loadDonor();
    return () => { active = false; };
  }, [donor, id]);

  if (isLoading) {
    return (
      <Layout showBack backTo="/find">
        <div className="text-center py-16 text-[#9E9E9E]">Loading donor...</div>
      </Layout>
    );
  }

  if (!donor) {
    return (
      <Layout showBack backTo="/find">
        <div className="text-center py-16 text-[#9E9E9E]">{loadError || 'Donor not found'}</div>
      </Layout>
    );
  }

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.patientName.trim()) e.patientName = 'Patient name is required';
    if (!form.hospitalName.trim()) e.hospitalName = 'Hospital name is required';
    if (!form.unitsRequired) e.unitsRequired = 'Units required';
    if (!form.contact.trim()) e.contact = 'Contact details required';
    return e;
  };

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setIsSubmitting(true);
    setSubmitError('');

    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.email) {
      setIsSubmitting(false);
      setSubmitError('Please log in before requesting blood.');
      return;
    }

    const donorId = typeof donor.id === 'string' ? donor.id : null;
    const { error } = await supabase.from('blood_requests').insert({
      requester_name: form.patientName.trim(),
      requester_email: user.email,
      donor_id: donorId,
      blood_group: donor.bloodGroup,
      message: `Hospital: ${form.hospitalName.trim()}; Units: ${form.unitsRequired.trim()}; Contact: ${form.contact.trim()}`,
      status: 'pending',
    });

    setIsSubmitting(false);
    if (error) {
      setSubmitError('We could not send your request. Please try again.');
      return;
    }
    navigate('/donation-request-success');
  };

  const inputClass = (id: string) =>
    `w-full border ${errors[id] ? 'border-[#C62828]' : 'border-[#E0E0E0]'} rounded-xl px-4 py-3 text-sm text-[#212121] placeholder-[#BDBDBD] outline-none focus:border-[#C62828] focus:ring-2 focus:ring-[#FFCDD2] bg-white`;

  return (
    <Layout showBack>
      <div className="bg-white rounded-2xl shadow-sm border border-[#E0E0E0] p-6 mt-2 mb-4">
        {/* Profile */}
        <div className="flex flex-col items-center mb-5 pb-5 border-b border-[#F5F5F5]">
          <div className="w-20 h-20 rounded-full bg-[#FFEBEE] flex items-center justify-center text-[#C62828] font-bold text-2xl mb-3">
            {donor.avatar}
          </div>
          <h2 className="text-lg font-bold text-[#212121]">{donor.name}</h2>
          <span className="bg-[#FFEBEE] text-[#C62828] text-sm font-bold px-3 py-1 rounded-full mt-1">
            Blood Group: {donor.bloodGroup}
          </span>
        </div>

        {/* Details */}
        <div className="space-y-3">
          {[
            { icon: 'location', label: 'Location', value: donor.location },
            { icon: 'phone', label: 'Phone Number', value: donor.phone },
            { icon: 'calendar', label: 'Last Donation', value: donor.lastDonation },
            { icon: 'check', label: 'Availability', value: donor.availability, isStatus: true },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#FFEBEE] flex items-center justify-center flex-shrink-0">
                {item.icon === 'location' && (
                  <svg width="14" height="14" fill="none" stroke="#C62828" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                )}
                {item.icon === 'phone' && (
                  <svg width="14" height="14" fill="none" stroke="#C62828" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                  </svg>
                )}
                {item.icon === 'calendar' && (
                  <svg width="14" height="14" fill="none" stroke="#C62828" strokeWidth="2" viewBox="0 0 24 24">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                )}
                {item.icon === 'check' && (
                  <svg width="14" height="14" fill="none" stroke={donor.availability === 'Available' ? '#2E7D32' : '#9E9E9E'} strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                )}
              </div>
              <div>
                <div className="text-xs text-[#9E9E9E]">{item.label}</div>
                {item.isStatus ? (
                  <span className={`text-sm font-semibold ${donor.availability === 'Available' ? 'text-[#2E7D32]' : 'text-[#9E9E9E]'}`}>
                    {item.value}
                  </span>
                ) : (
                  <div className="text-sm font-medium text-[#212121]">{item.value}</div>
                )}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => setShowRequestForm(true)}
          className="mt-6 w-full bg-[#C62828] hover:bg-[#B71C1C] text-white font-semibold py-3.5 rounded-xl text-sm transition-colors active:scale-[0.98]"
        >
          Request Blood
        </button>
      </div>

      {/* Request form */}
      {showRequestForm && (
        <div className="bg-white rounded-2xl shadow-sm border border-[#E0E0E0] p-6">
          <h3 className="text-base font-bold text-[#212121] mb-1">Request Blood</h3>
          <p className="text-xs text-[#9E9E9E] mb-4">Fill in the details below to send your blood request.</p>

          <form onSubmit={handleRequest} className="space-y-3">
            {[
              { id: 'patientName' as const, label: 'Patient Name', placeholder: 'Enter patient name' },
              { id: 'hospitalName' as const, label: 'Hospital Name', placeholder: 'Enter hospital name' },
              { id: 'unitsRequired' as const, label: 'Units Required', placeholder: 'Number of units' },
              { id: 'contact' as const, label: 'Contact', placeholder: 'Enter contact details' },
            ].map(f => (
              <div key={f.id}>
                <label className="block text-sm font-medium text-[#424242] mb-1.5">{f.label}</label>
                <input
                  value={form[f.id]}
                  onChange={e => { setForm(p => ({ ...p, [f.id]: e.target.value })); setErrors(p => ({ ...p, [f.id]: '' })); }}
                  placeholder={f.placeholder}
                  className={inputClass(f.id)}
                />
                {errors[f.id] && <p className="text-xs text-[#C62828] mt-1">{errors[f.id]}</p>}
              </div>
            ))}

            {submitError && <p className="text-xs text-[#C62828]">{submitError}</p>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#C62828] hover:bg-[#B71C1C] disabled:opacity-60 text-white font-semibold py-3.5 rounded-xl text-sm transition-colors active:scale-[0.98] mt-2"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Request'}
            </button>
          </form>
        </div>
      )}
    </Layout>
  );
}
