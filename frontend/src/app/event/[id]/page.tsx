'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { FaRegCalendarAlt, FaRegClock, FaMapMarkerAlt, FaTicketAlt, FaUser, FaArrowLeft, FaChair } from 'react-icons/fa'; // You can swap with Heroicons if preferred
import PageContainer from '@/components/PageContainer';
import Button from '@/components/Buttons';
import dayjs from 'dayjs';

interface Event {
  id: number;
  title: string;
  description: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  location: string;
  imageUrl: string;
  maxSeats: number;
  bookedSeats: number;
  tags: string;
}

const EventDetailsPage = () => {
  const { id } = useParams();
  const router = useRouter();

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [seats, setSeats] = useState(1);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/events/${id}`);
        setEvent(res.data);
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const handleBooking = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/signin');
      return;
    }

    try {
      await axios.post(
        'http://localhost:3000/bookings',
        {
          eventId: event?.id,
          seats,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert('Booking successful!');
      window.location.reload(); 
    } catch (err: any) {
      alert(err.response?.data?.message || 'Booking failed!');
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!event) return <p className="text-center mt-10">Event not found</p>;

  const tags = event.tags.split(',').map((tag) => tag.trim());


  return (
    <PageContainer>
      <div className="pt-6 mt-16">
        {/* Back button */}
      <button onClick={() => router.push('/')} className="text-eb-purple flex items-center gap-2 mb-4">
        <FaArrowLeft />
        Back to event
      </button>

      {/* Event image */}
      <div className="rounded-xl overflow-hidden mb-8">
        {event.imageUrl ? (
          <img
            src={`${process.env.NEXT_PUBLIC_API_URL}${event.imageUrl}`}
            alt={event.title}
            className="w-full h-auto object-cover"
          />
        ) : (
          <div className="w-full h-64 bg-gray-100 flex items-center justify-center">
            <span className="text-gray-400">Image not available</span>
          </div>
        )}
      </div>


      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-3">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="bg-blue-100 text-[#3D3BFF] text-xs font-medium px-3 py-1 rounded-md"
          >
            • {tag}
          </span>
        ))}
      </div>

      {/* Title */}
      <h1 className="text-3xl font-semibold text-eb-purple mt-6 mb-4">{event.title}</h1>

      {/* Info Card */}
<div className="bg-[#FFFFFF] rounded-xl border border-gray-200 flex flex-wrap md:flex-nowrap justify-between items-start px-6 py-4 mb-8 shadow-sm">
  
  {/* Date (left-aligned) */}
  <div className="flex items-start gap-3 w-full md:w-1/3 mb-4 md:mb-0 justify-start">
    <FaRegCalendarAlt className="text-eb-purple mt-1" size={32} />
    <div className="flex flex-col text-sm text-gray-700">
      <span className="font-semibold">Date</span>
      <span>{new Date(event.eventDate).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })}</span>
    </div>
  </div>

  {/* Time (center-aligned) */}
  <div className="flex items-start gap-3 w-full md:w-1/3 mb-4 md:mb-0 justify-center">
    <FaRegClock className="text-eb-purple mt-1" size={32} />
    <div className="flex flex-col text-sm text-gray-700">
      <span className="font-semibold">Time</span>
      <span>
        {dayjs(`2024-01-01T${event.startTime}`).format('h:mm A')} – {dayjs(`2024-01-01T${event.endTime}`).format('h:mm A')}
      </span>
    </div>
  </div>

  {/* Location (right-aligned) */}
  <div className="flex items-start gap-3 w-full md:w-1/3 justify-end">
    <FaMapMarkerAlt className="text-eb-purple mt-1" size={32} />
    <div className="flex flex-col text-sm text-gray-700">
      <span className="font-semibold">Location</span>
      <span>{event.location}</span>
    </div>
  </div>
</div>


      {/* Seat Selection */}
<div className="bg-white border border-gray-200 rounded-xl p-6 mb-8 shadow-sm max-w-3xl mx-auto">
  <p className="font-medium text-eb-purple mb-6 text-left text-lg">Select Number of Seats</p>

  <div className="flex justify-center gap-6 mb-10 flex-wrap">
    {[1, 2, 3, 4].map((n) => (
      <button
        key={n}
        onClick={() => setSeats(n)}
        className={`flex flex-col items-center justify-center w-40 h-32 border rounded-md text-base transition-all duration-200 ${
          seats === n
            ? 'border-eb-purple bg-[#EEF0FF] text-eb-purple shadow-md'
            : 'border-gray-300 bg-white text-eb-purple hover:border-eb-purple hover:bg-[#F6F6FF]'
        }`}
      >
        <FaTicketAlt size={36} className="mb-2" />
        <span className="font-semibold text-xl">{n}</span>
        <span className="text-xs text-[#8570AD] font-semibold mt-0.5">{n === 1 ? 'Seat' : 'Seats'}</span>
      </button>
    ))}
  </div>

  <div className="flex justify-center">
    <Button
      onClick={handleBooking}
      className="px-4 py-2 text-sm font-semibold"
    >
      Book {seats} {seats === 1 ? 'Seat' : 'Seats'}
    </Button>
  </div>
</div>



      {/* Description */}
      <div className="mb-8">
        <h2 className="text-2xl font-medium text-eb-purple mb-2">About this event</h2>
        <p className="text-base text-[#8570AD] whitespace-pre-line leading-relaxed">{event.description}</p>
      </div>

      {/* Spots left */}
      <div className="flex items-center gap-2 text-xl text-[#8570AD] font-medium border-t border-[#E5E5F7] pt-6 pb-6">
        <FaChair size={28} />
        {event.maxSeats - event.bookedSeats} Spots Left
        <span className="text-gray-400 font-normal">({event.bookedSeats} registered)</span>
      </div>
      </div>
      
    </PageContainer>
  );
};

export default EventDetailsPage;
