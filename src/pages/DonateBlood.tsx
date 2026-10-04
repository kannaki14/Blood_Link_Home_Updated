import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import Layout from '../components/Layout';
import { bloodGroups } from '../data/donors';
import { supabase } from '../lib/supabase';

export default function DonateBlood() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: '', bloodGroup: '', age: '', phone: '', location: '', lastDonation: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    let active = true;

    async function requireSession() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!active) return;
      if (!session) {
        navigate('/login', { replace: true, state: { from: '/donate' } });
        return;
      }
      setIsCheckingAuth(false);
    }

    requireSession();
    return () => { active = false; };
  }, [navigate]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.fullName.trim()) e.fullName = 'Full name is required';
    if (!form.bloodGroup) e.bloodGroup = 'Select a blood group';
    if (!form.age) e.age = 'Age is required';
    else if (Number(form.age) < 18 || Number(form.age) > 65) e.age = 'Age must be 18–65';
    if (!form.phone.trim()) e.phone = 'Phone number is required';
    else if (!/^\+?[\d\s\-]{7,15}$/.test(form.phone)) e.phone = 'Enter a valid phone number';
    if (!form.location.trim()) e.location = 'Location is required';
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setIsSubmitting(true);
    setSubmitError('');

    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();
    const user = session?.user;

    if (sessionError) {
      console.error('Unable to read Supabase session:', sessionError);
      setIsSubmitting(false);
      setSubmitError(
        import.meta.env.DEV
          ? `Unable to read your session: ${sessionError.message}`
          : 'Unable to read your session. Please log in again.',
      );
      return;
    }

    if (!user?.email) {
      setIsSubmitting(false);
      setSubmitError('Please log in before registering as a donor.');
      return;
    }

    const donorProfile = {
      auth_user_id: user.id,
      name: form.fullName.trim(),
      email: user.email,
      phone: form.phone.trim(),
      blood_group: form.bloodGroup,
      age: Number(form.age),
      location: form.location.trim(),
      availability: 'Available',
      last_donation: form.lastDonation || null,
    };

    const { data: existingDonor, error: lookupError } = await supabase
      .from('donors')
      .select('id')
      .eq('auth_user_id', user.id)
      .maybeSingle();

    let saveError = lookupError;
    if (!saveError) {
      const result = existingDonor
        ? await supabase
            .from('donors')
            .update(donorProfile)
            .eq('id', existingDonor.id)
            .eq('auth_user_id', user.id)
        : await supabase.from('donors').insert(donorProfile);
      saveError = result.error;
    }

    setIsSubmitting(false);
    if (saveError) {
      console.error('Unable to save donor profile:', saveError);
      setSubmitError(
        import.meta.env.DEV
          ? `We could not save your donor profile: ${saveError.message}`
          : 'We could not save your donor profile. Please try again.',
      );
      return;
    }
    navigate('/donation-success');
  };

  const set = (id: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(p => ({ ...p, [id]: e.target.value }));
    setErrors(p => ({ ...p, [id]: '' }));
  };

  const inputClass = (id: string) =>
    `w-full border ${errors[id] ? 'border-[#C62828]' : 'border-[#E0E0E0]'} rounded-xl px-4 py-3 text-sm text-[#212121] placeholder-[#BDBDBD] outline-none focus:border-[#C62828] focus:ring-2 focus:ring-[#FFCDD2] transition-all bg-white`;

  if (isCheckingAuth) return null;

  return (
    <Layout showBack backTo="/home">
      <div className="bg-white rounded-2xl shadow-sm border border-[#E0E0E0] p-6 mt-2">
        <h2 className="text-xl font-bold text-[#212121] mb-1">Become a Blood Donor</h2>
        <p className="text-xs text-[#9E9E9E] mb-6">Fill in your details to register as a donor</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#424242] mb-1.5">Full Name</label>
            <input value={form.fullName} onChange={set('fullName')} placeholder="Enter your full name" className={inputClass('fullName')} />
            {errors.fullName && <p className="text-xs text-[#C62828] mt-1">{errors.fullName}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#424242] mb-1.5">Blood Group</label>
            <select value={form.bloodGroup} onChange={set('bloodGroup')} className={inputClass('bloodGroup')}>
              <option value="">Select blood group</option>
              {bloodGroups.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
            {errors.bloodGroup && <p className="text-xs text-[#C62828] mt-1">{errors.bloodGroup}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#424242] mb-1.5">Age</label>
            <input type="number" value={form.age} onChange={set('age')} placeholder="Enter your age" min={18} max={65} className={inputClass('age')} />
            {errors.age && <p className="text-xs text-[#C62828] mt-1">{errors.age}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#424242] mb-1.5">Phone Number</label>
            <input type="tel" value={form.phone} onChange={set('phone')} placeholder="Enter your phone number" className={inputClass('phone')} />
            {errors.phone && <p className="text-xs text-[#C62828] mt-1">{errors.phone}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#424242] mb-1.5">Location</label>
            <input value={form.location} onChange={set('location')} placeholder="Enter your location" className={inputClass('location')} />
            {errors.location && <p className="text-xs text-[#C62828] mt-1">{errors.location}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#424242] mb-1.5">Last Donation Date <span className="text-[#9E9E9E]">(optional)</span></label>
            <input type="date" value={form.lastDonation} onChange={set('lastDonation')} className={inputClass('lastDonation')} />
          </div>

          {submitError && <p className="text-xs text-[#C62828]">{submitError}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#C62828] hover:bg-[#B71C1C] disabled:opacity-60 text-white font-semibold py-3.5 rounded-xl text-sm transition-colors active:scale-[0.98] mt-2"
          >
            {isSubmitting ? 'Registering...' : 'Register as Donor'}
          </button>
        </form>
      </div>
    </Layout>
  );
}
