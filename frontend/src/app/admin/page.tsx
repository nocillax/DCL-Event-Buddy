'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from '@/lib/axios';

interface Event {
  id: number;
  title: string;
  eventDate: string;
  eventTime: string;
  location: string;
  maxSeats: number;
  bookedSeats: number;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [adminName, setAdminName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/signin');
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.role !== 'admin') {
        router.push('/dashboard');
        return;
      }
      setAdminName(payload.name || payload.email || 'Admin');
    } catch {
      router.push('/signin');
    }

    const fetchEvents = async () => {
      try {
        const res = await axios.get('/events');
        setEvents(res.data);
      } catch (err) {
        setError('Failed to load events');
      }
    };

    fetchEvents();
  }, [router]);

  const handleLogout = () => {
    localStorage.clear();
    router.push('/signin');
  };

  const handleEdit = (id: number) => {
    router.push(`/admin/edit/${id}`);
  };

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this event?');
    if (!confirmDelete) return;

    const token = localStorage.getItem('token');
    try {
      await axios.delete(`/events/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      alert('Failed to delete event.');
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Hello, {adminName}</h2>
        <div className="space-x-2">
          <button
            onClick={() => router.push('/admin/create')}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Create Event
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>

      <h3 className="text-lg font-medium mb-4">All Events</h3>

      {error && <p className="text-red-500">{error}</p>}

      {events.length === 0 ? (
        <p>No events found.</p>
      ) : (
        <div className="space-y-4">
          {events.map((e) => (
            <div
              key={e.id}
              className="border rounded p-4 shadow-sm flex justify-between items-center"
            >
              <div>
                <h4 className="text-lg font-bold">{e.title}</h4>
                <p>{e.eventDate} at {e.eventTime}</p>
                <p>{e.location}</p>
                <p className="text-sm text-gray-600">
                  Seats: {e.bookedSeats} / {e.maxSeats}
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(e.id)}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(e.id)}
                  className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
