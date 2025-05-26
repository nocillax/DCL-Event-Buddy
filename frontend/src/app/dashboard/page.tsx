'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from '@/lib/axios';
import { FaCalendarAlt, FaChair, FaClock, FaMapMarkerAlt, FaSignOutAlt } from 'react-icons/fa';
import dayjs from 'dayjs';


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
          } catch {
            setUserName('User');
          }
        }
      } catch {
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
    } catch {
      alert('Failed to cancel booking.');
    }
  };

  const navigateToHome = () => {
    router.push('/');
  };

  const BookingCard = ({ booking, onCancel }: { booking: Booking, onCancel: (id: number) => void }) => {
  const { event, seats, id } = booking;
  const month = dayjs(event.eventDate).format('MMM').toUpperCase();
  const day = dayjs(event.eventDate).format('DD');
  const weekday = dayjs(event.eventDate).format('dddd');

  return (
  <div className="border border-gray-300 rounded-md bg-white shadow-lg transition transform flex items-center justify-between p-4">
    <div className="flex flex-col space-y-2">
      <div className="flex items-center">
        <div className="flex flex-col items-start">
          <span className="text-xs text-blue-700 font-extrabold">{month}</span>
          <span className="text-2xl font-black">{day}</span>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 ml-5">
          {event.title}
        </h2>
      </div>

      <div className="flex items-center text-sm text-gray-500">
        <div className="flex items-center space-x-1 mr-4">
          <FaCalendarAlt className="mr-1" />
          <span>{weekday}</span>
        </div>
        <div className="flex items-center space-x-1 mr-4">
          <FaClock className="mr-1" />
          <span>{event.eventTime}</span>
        </div>
        <div className="flex items-center space-x-1">
          <FaMapMarkerAlt className="mr-1" />
          <span>{event.location}</span>
        </div>
      </div>

      <div className="flex items-center text-sm text-gray-600">
        <FaChair className="mr-2" />
        <span>{seats} seat{seats > 1 ? "s" : ""} booked</span>
      </div>
    </div>

    <button
      onClick={() => onCancel(id)}
      className="ml-6 bg-red-500 hover:bg-red-600 text-sm px-4 py-2 rounded-lg text-white self-center"
    >
      Cancel registration
    </button>
  </div>
);

};

  return (
  <div className="flex flex-col h-screen mx-16 bg-white">
    <div className="pl-6 pt-6 pr-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-eb-purple mt-12 ">Dashboard</h2>
        <div className="flex items-center space-x-4">
          <span className="text-gray-700">Hello, {userName}</span>
          <button 
            onClick={handleLogout}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Logout
          </button>

        </div>
      </div>

      <p className="text-gray-600 mt-2">Welcome back, {userName}! Here you can manage your event registrations.</p>

    </div>

    <div className="p-6 flex-grow">

      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium mb-2">My Registered Events</h3>
      </div>

      
    {error && <p className="text-red-500">{error}</p>}

    {bookings.length === 0 ? (
      <p>No bookings yet.</p>
    ) : (
      <div className="space-y-4">
        {bookings.map((b) => (
          <BookingCard key={b.id} booking={b} onCancel={handleCancel} />
        ))}
      </div>
    )}

    <div className="mt-6 text-center">
      <button
        onClick={navigateToHome}
        className="bg-[#4f9dc3] text-white px-4 py-2 rounded-lg hover:bg-[#3b7da0]"
      >
        Browse more events
      </button>
    </div>

    </div>

  </div>
);


}