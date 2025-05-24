'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from '@/lib/axios';

interface Booking {
  id: number;
  seats: number;
  createdAt: string;
  event: {
    title: string;
    eventDate: string;
    eventTime: string;
    location: string;
  };
}

export default function DashboardPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [userName, setUserName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/signin');
      return;
    }

    const fetchData = async () => {
      try {
        const res = await axios.get('/bookings/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBookings(res.data);

        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                setUserName(payload.name);
            } 
            catch {
                setUserName('User');
            }
        }
      } 
      catch (err) {
        setError('Failed to load bookings.');
      }
    };

    fetchData();
  }, [router]);

  const handleLogout = () => {
    localStorage.clear();
    router.push('/signin');
  };

    const handleCancel = async (bookingId: number) => {
        const confirmCancel = window.confirm('Are you sure you want to cancel this booking?');
        if (!confirmCancel) return;

        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            await axios.delete(`/bookings/${bookingId}`, {
            headers: { Authorization: `Bearer ${token}` },
            });
            setBookings((prev) => prev.filter((b) => b.id !== bookingId));
        } 
        catch (err) {
            alert('Failed to cancel booking.');
        }
    };


  return (
    <div className="max-w-4xl mx-auto mt-10 p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Hello, {userName}</h2>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      <h3 className="text-lg font-medium mb-4">Your Bookings</h3>

      {error && <p className="text-red-500">{error}</p>}

      {bookings.length === 0 ? (
        <p>No bookings yet.</p>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <div key={b.id} className="border rounded p-4 shadow-sm flex justify-between items-center">
              <div>
                <h4 className="text-lg font-bold">{b.event.title}</h4>
                <p>{b.event.eventDate} at {b.event.eventTime}</p>
                <p>{b.event.location}</p>
                <p className="text-sm text-gray-600">Seats booked: {b.seats}</p>
              </div>
              <button
                onClick={() => handleCancel(b.id)}
                className="ml-4 bg-red-500 hover:bg-red-600 text-sm px-3 py-1 rounded text-white"
              >
                Cancel Registration
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
