import { useState } from 'react';
import { useNavigate } from 'react-router';
import Layout from '../components/Layout';
import { supabase } from '../lib/supabase';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Full name is required';
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Minimum 6 characters';
    if (!form.confirmPassword) e.confirmPassword = 'Please confirm your password';
    else if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setIsSubmitting(true);
    setSubmitError('');

    const { error } = await supabase.auth.signUp({
      email: form.email.trim(),
      password: form.password,
      options: { data: { name: form.name.trim() } },
    });

    setIsSubmitting(false);
    if (error) {
      setSubmitError(
        error.message.toLowerCase().includes('already registered')
          ? 'An account with this email already exists.'
          : error.message,
      );
      return;
    }
    navigate('/registration-success');
  };

  const fields = [
    { id: 'name' as const, label: 'Name', type: 'text', placeholder: 'Enter your full name' },
    { id: 'email' as const, label: 'Email', type: 'email', placeholder: 'Enter your email' },
    { id: 'password' as const, label: 'Password', type: 'password', placeholder: 'Create a password' },
    { id: 'confirmPassword' as const, label: 'Confirm Password', type: 'password', placeholder: 'Confirm your password' },
  ];

  return (
    <Layout showBack backTo="/login">
      <div className="bg-white rounded-2xl shadow-sm border border-[#E0E0E0] p-6 mt-2">
        <h2 className="text-xl font-bold text-[#212121] mb-1">Create Account</h2>
        <p className="text-xs text-[#9E9E9E] mb-6">Create your Blood Link account.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map(f => (
            <div key={f.id}>
              <label className="block text-sm font-medium text-[#424242] mb-1.5">{f.label}</label>
              <input
                type={f.type}
                value={form[f.id]}
                placeholder={f.placeholder}
                onChange={e => { setForm(p => ({ ...p, [f.id]: e.target.value })); setErrors(p => ({ ...p, [f.id]: '' })); }}
                className={`w-full border ${errors[f.id] ? 'border-[#C62828]' : 'border-[#E0E0E0]'} rounded-xl px-4 py-3 text-sm text-[#212121] placeholder-[#BDBDBD] outline-none focus:border-[#C62828] focus:ring-2 focus:ring-[#FFCDD2] transition-all bg-white`}
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
            {isSubmitting ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-xs text-[#9E9E9E] mt-4">
          Already have an account?{' '}
          <button
            onClick={() => navigate('/login')}
            className="text-[#C62828] font-semibold hover:underline"
          >
            Login
          </button>
        </p>
      </div>
    </Layout>
  );
}
