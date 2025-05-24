'use client';

import { useState, useEffect } from 'react';
import axios from '@/lib/axios';
import { useRouter } from 'next/navigation';
import Button from '@/components/Buttons';

export default function SignupPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    const newErrors = { ...errors };

    if (touched.name) {
      newErrors.name = form.name.trim().length < 3 ? 'Name must be at least 3 characters' : '';
    }

    if (touched.email) {
      if (!form.email.trim()) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Invalid email format';
      else newErrors.email = '';
    }

    if (touched.password) {
      newErrors.password = form.password.length < 6 ? 'Password must be at least 6 characters' : '';
    }

    setErrors(newErrors);
  }, [form, touched]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');

    if (Object.values(errors).some((error) => error)) {
      setServerError('Please input valid information.');
      return;
    }

    try {
      const res = await axios.post('/auth/signup', form);
      console.log('Signup successful:', res.data);
      router.push('/signin');
    } 
    catch (err: any) {
      const msg = err?.response?.data?.message;

      if (Array.isArray(msg)) {
        setServerError(msg.join(', '));
      } else {
        setServerError(msg || 'Signup failed');
      }
    }
  };

  return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-sm relative">
          <div className="absolute top-0 left-0 w-8 h-8 bg-[#eef0ff] rotate-45 transform -translate-x-1/2 -translate-y-1/2"></div>
            <h2 className="text-3xl font-semibold text-eb-purple mb-3">
              Sign Up
            </h2>

            <p className="text-sm text-eb-purple mt-5 mb-6">
              Already have an account?{' '}
              <a href="/signin" className="underline hover:text-purple-900">
                Sign in
              </a>
            </p>


          <form onSubmit={handleSubmit} className="space-y-4">

            <div> 
              <label htmlFor="name" className="block text-sm font-medium text-eb-purple mb-1">
                Full Name
              </label>
              <input
                type="text"
                placeholder="e.g. John Doe"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                onBlur={() => setTouched({ ...touched, name: true })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-eb-purple mb-1">
                Email
              </label>
              <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                onBlur={() => setTouched({ ...touched, email: true })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-eb-purple mt-1 mb-1">
                Password
              </label>
              <input
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                onBlur={() => setTouched({ ...touched, password: true })}
                className="w-full border p-2 rounded text-black"
              />
              {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
            </div>

            <div>
              {serverError && <p className="text-red-600 text-sm">{serverError}</p>}
            </div>
            
            
            <Button type="submit" className="w-full">
              Sign Up
            </Button>

          </form>
    
        </div>
        
      </div>
  );
}
