'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from '@/lib/axios';
import Button from '@/components/Buttons';
import { jwtDecode } from 'jwt-decode';

export default function SigninPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await axios.post('/auth/login', form);
      const token = res.data.access_token;

      localStorage.setItem('token', token);             
      window.dispatchEvent(new Event('authChange'));
      const payload: any = jwtDecode(token);      

      if (payload.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    } 
    catch (err: any) {
      setError(err?.response?.data?.message || 'Login failed');
    }
  };

 return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-sm relative">
        <div className="absolute top-0 left-0 w-8 h-8 bg-[#eef0ff] rotate-45 transform -translate-x-1/2 -translate-y-1/2"></div>
        <h2 className="text-3xl font-semibold text-eb-purple mb-3">
          Sign in
        </h2>

        <p className="text-sm text-purple-700 mt-5 mb-6">
          New User?{' '}
          <a href="/signup" className="underline hover:text-purple-900">
            Create an account
          </a>
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-eb-purple mb-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="enter your email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-eb-purple mt-7 mb-1">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="enter your password"
              value={form.password}
              onChange={handleChange}
              className="w-full mb-5 px-4 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
            />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <Button type="submit" className="w-full py-2">
            Sign In
          </Button>

        </form>
      </div>
    </div>
);
}
