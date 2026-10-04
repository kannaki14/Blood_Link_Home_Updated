import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import Layout from '../components/Layout';
import { supabase } from '../lib/supabase';

interface FieldProps {
  id: 'email' | 'password';
  label: string;
  type?: string;
  placeholder: string;
  value: string;
  error?: string;
  onChange: (id: 'email' | 'password', value: string) => void;
}

function Field({
  id,
  label,
  type = 'text',
  placeholder,
  value,
  error,
  onChange,
}: FieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-[#424242] mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={e => onChange(id, e.target.value)}
        className={`w-full border ${error ? 'border-[#C62828]' : 'border-[#E0E0E0]'} rounded-xl px-4 py-3 text-sm text-[#212121] placeholder-[#BDBDBD] outline-none focus:border-[#C62828] focus:ring-2 focus:ring-[#FFCDD2] transition-all bg-white`}
      />
      {error && <p className="text-xs text-[#C62828] mt-1">{error}</p>}
    </div>
  );
}

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const validate = (email: string) => {
    const e: Record<string, string> = {};
    if (!email) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Enter a valid email';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Minimum 6 characters';
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = form.email.trim();
    const errs = validate(email);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setIsSubmitting(true);
    setSubmitError('');

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: form.password,
    });

    setIsSubmitting(false);
    if (error) {
      setSubmitError(
        error.message === 'Invalid login credentials'
          ? 'Incorrect email or password.'
          : error.message,
      );
      return;
    }

    if (!data.session) {
      setSubmitError('Login succeeded, but no session was created. Please try again.');
      return;
    }

    const destination =
      typeof location.state?.from === 'string' && location.state.from.startsWith('/')
        ? location.state.from
        : '/home';
    navigate(destination, { replace: true });
  };

  const handleFieldChange = (id: 'email' | 'password', value: string) => {
    setForm(p => ({ ...p, [id]: value }));
    setErrors(p => ({ ...p, [id]: '' }));
  };

  return (
    <Layout>
      <div className="bg-white rounded-2xl shadow-sm border border-[#E0E0E0] p-6 mt-2">
        <h2 className="text-xl font-bold text-[#212121] mb-1">Sign in to continue</h2>
        <p className="text-xs text-[#9E9E9E] mb-6">Welcome back to Blood Link</p>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <Field
            id="email"
            label="Email"
            type="email"
            placeholder="Enter your email"
            value={form.email}
            error={errors.email}
            onChange={handleFieldChange}
          />
          <Field
            id="password"
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={form.password}
            error={errors.password}
            onChange={handleFieldChange}
          />

          {submitError && <p className="text-xs text-[#C62828]">{submitError}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#C62828] hover:bg-[#B71C1C] disabled:opacity-60 text-white font-semibold py-3.5 rounded-xl text-sm transition-colors active:scale-[0.98] mt-2"
          >
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <button
          onClick={() => navigate('/forgot-password')}
          className="block w-full text-center text-sm text-[#C62828] font-medium mt-4 hover:underline"
        >
          Forgot password?
        </button>

        <p className="text-center text-xs text-[#9E9E9E] mt-4">
          Don't have an account?{' '}
          <button
            onClick={() => navigate('/register')}
            className="text-[#C62828] font-semibold hover:underline"
          >
            Register
          </button>
        </p>
      </div>
    </Layout>
  );
}
