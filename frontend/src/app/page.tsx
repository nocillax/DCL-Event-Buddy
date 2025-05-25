// src/app/events/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import { FaCalendarAlt, FaChair, FaClock, FaMapMarkerAlt, FaTags, FaUsers } from 'react-icons/fa';

interface Event {
  id: number;
  title: string;
  description: string;
  eventDate: string;
  eventTime: string;
  location: string;
  imageUrl: string;
  maxSeats: number;
  bookedSeats: number;
  tags: string;
  createdAt: string;
  updatedAt: string;
}

interface PaginatedResponse {
  events: Event[];
  total: number;
  page: number;
  totalPages: number;
}

const EventsPage = () => {
  const [search, setSearch] = useState('');

  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [previousEvents, setPreviousEvents] = useState<Event[]>([]);

  const [upcomingPage, setUpcomingPage] = useState(1);
  const [previousPage, setPreviousPage] = useState(1);

  const [upcomingTotalPages, setUpcomingTotalPages] = useState(1);
  const [previousTotalPages, setPreviousTotalPages] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const LIMIT = 6;

  const fetchPaginatedEvents = async () => {
    setLoading(true);
    try {
      const [upcomingRes, previousRes] = await Promise.all([
        axios.get<PaginatedResponse>(`http://localhost:3000/events?upcoming=true&page=${upcomingPage}&limit=${LIMIT}`),
        axios.get<PaginatedResponse>(`http://localhost:3000/events?upcoming=false&page=${previousPage}&limit=${LIMIT}`),
      ]);

      setUpcomingEvents(upcomingRes.data.events);
      setUpcomingTotalPages(upcomingRes.data.totalPages);

      setPreviousEvents(previousRes.data.events);
      setPreviousTotalPages(previousRes.data.totalPages);

    } catch (err: any) {
      setError('Failed to load events');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaginatedEvents();
  }, [upcomingPage, previousPage]);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const res = await axios.get<Event[]>(`http://localhost:3000/events/search?query=${search}`);
      setUpcomingEvents(res.data); 
      setPreviousEvents([]);
    } catch (err) {
      setError('Failed to search events');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

const renderEventCard = (event: Event) => {
  const spotsLeft = event.maxSeats - event.bookedSeats;
  const month = dayjs(event.eventDate).format('MMM').toUpperCase(); // e.g. "APR"
  const day = dayjs(event.eventDate).format('DD'); // e.g. "14"
  const eventTime = dayjs(`${event.eventDate} ${event.eventTime}`).format('h:mm A'); // Formatting time
  const tagList = event.tags.split(',').map((tag) => tag.trim());

  return (
    <div key={event.id} className="border border-gray-300 rounded-lg bg-white shadow-lg transition transform hover:scale-105" style={{ width: '400px', height: '470px' }}>
      {/* Conditionally render image if imageUrl is valid */}
      {event.imageUrl ? (
        <img src={event.imageUrl} alt={event.title} className="h-48 w-full object-cover rounded-t-lg mb-4" />
      ) : (
        <div className="h-48 w-full bg-gray-200 rounded-t-lg mb-4 flex items-center justify-center">
          <span className="text-gray-500">Image not available</span>
        </div>
      )}

      <div className="p-4 space-y-2">
        <div className="flex items-center">
          <div className="flex flex-col items-start text-gray-600">
            <span className="text-xs font-bold">{month}</span>
            <span className="text-2xl font-bold">{day}</span>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 ml-5">
            {event.title}
          </h2>
        </div>

        <p className="text-gray-700 mb-3">We’ll get you directly seated and inside for you to enjoy the conference.</p>
        
        <div className="flex items-center text-gray-500 mb-3 space-x-4">
          <FaCalendarAlt className="mr-1" />
          <span>{dayjs(event.eventDate).format('dddd')}</span>
          <FaClock className="mr-1" />
          <span>{eventTime}</span>
          <FaMapMarkerAlt className="mr-1" />
          <span>{event.location}</span>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {tagList.map((tag, i) => (
            <span key={i} className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs">{tag}</span>
          ))}
        </div>
        
        {/* Divider Line */}
        <hr className="border-gray-300 mb-4" />

        {/* Spots Left and Total Seats layout */}
        <div className="flex justify-between text-gray-700">
          <div className="flex items-center">
            <FaChair className="mr-2" />
            <span>{spotsLeft} Spots Left</span>
          </div>
          <div className="text-gray-700">
            <span>Total {event.maxSeats} Seats</span>
          </div>
        </div>
      </div>
    </div>
  );
};

  const renderPagination = (page: number, totalPages: number, setPage: (page: number) => void) => (
    <div className="flex justify-center items-center gap-2 my-4">
      <button
        onClick={() => setPage(Math.max(1, page - 1))}
        className="px-4 py-2 bg-gray-300 rounded text-gray-700 hover:bg-gray-400 transition"
        disabled={page <= 1}
      >
        Previous
      </button>
      <span className="text-lg text-gray-600">Page {page} of {totalPages}</span>
      <button
        onClick={() => setPage(Math.min(totalPages, page + 1))}
        className="px-4 py-2 bg-gray-300 rounded text-gray-700 hover:bg-gray-400 transition"
        disabled={page >= totalPages}
      >
        Next
      </button>
    </div>
  );

  if (loading) return <p className="text-center">Loading events...</p>;
  if (error) return <p className="text-red-600 text-center">{error}</p>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">Browse Events</h1>

      <div className="flex mb-8 gap-2 justify-center">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search events..."
          className="border border-gray-300 px-4 py-2 rounded w-full focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Search
        </button>
      </div>

      <div className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Upcoming Events</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingEvents.map(renderEventCard)}
        </div>
        {renderPagination(upcomingPage, upcomingTotalPages, setUpcomingPage)}
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Previous Events</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {previousEvents.map(renderEventCard)}
        </div>
        {renderPagination(previousPage, previousTotalPages, setPreviousPage)}
      </div>
    </div>
  );
};

export default EventsPage;