'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from '@/lib/axios';
import { FaCalendarAlt, FaChair, FaClock, FaMapMarkerAlt } from 'react-icons/fa';
import dayjs from 'dayjs';
import Button from '@/components/Buttons';
import PageContainer from '@/components/PageContainer';


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

  const BookingCard = ({ booking, onCancel }: { booking: Booking, onCancel: (id: number) => void }) => {
  const { event, id } = booking;
  const month = dayjs(event.eventDate).format('MMM').toUpperCase();
  const day = dayjs(event.eventDate).format('DD');
  const weekday = dayjs(event.eventDate).format('dddd');

  return (
  <div className="border border-gray-300 rounded-lg bg-[#FFFFFF] p-5 flex items-center justify-between">

    <div className="flex items-start space-x-6">

      <div className="flex flex-col items-start">
        <span className="text-md font-black text-blue-700 uppercase">{month}</span>
        <span className="text-4xl font-black leading-none">{day}</span>
      </div>

      <div className="flex flex-col space-y-2">

        <h2 className="text-lg font-medium text-eb-purple">
          {event.title}
        </h2>

        <div className="flex items-center text-sm text-gray-500 space-x-6">
          <div className="flex items-center space-x-1">
            <FaCalendarAlt />
            <span>{weekday}</span>
          </div>
          <div className="flex items-center space-x-1">
            <FaClock />
            <span>{event.eventTime}</span>
          </div>
          <div className="flex items-center space-x-1">
            <FaMapMarkerAlt />
            <span>{event.location}</span>
          </div>
        </div>
      </div>
    </div>

    <button
      onClick={() => onCancel(id)}
      className="px-2 py-2 bg-gradient-to-b from-red-400 to-red-600 text-white text-xs font-medium rounded-md shadow hover:opacity-90 transition-opacity"
    >
      Cancel registration
    </button>
  </div>
);


};

  return (
  <PageContainer>
    <div className="pl-6 pt-6 pr-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-eb-purple mt-12 ">Dashboard</h2>
      </div>

      <p className="text-[#6A5A8A] mt-2">Welcome back, {userName}! Here you can manage your event registrations.</p>

    </div>

    <div className="p-6 flex-grow">

      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg text-eb-purple font-medium ">My Registered Events</h3>
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
      <Button
        onClick={() => router.push('/')}
        className="px-3 py-2 text-xs"
      >
        Browse more events
      </Button>
    </div>

    </div>

  </PageContainer>
);


}