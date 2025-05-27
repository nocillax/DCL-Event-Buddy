'use client';

import React, { useEffect, useState } from 'react';
import axios from '@/lib/axios';
import dayjs from 'dayjs';
import {
  FaCalendarAlt,
  FaChair,
  FaClock,
  FaMapMarkerAlt,
} from 'react-icons/fa';
import Button from '@/components/Buttons';
import { useRouter } from 'next/navigation';

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
  const router = useRouter();

  const [searchInput, setSearchInput] = useState('');

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
        axios.get<PaginatedResponse>(
          `/events?upcoming=true&page=${upcomingPage}&limit=${LIMIT}`
        ),
        axios.get<PaginatedResponse>(
          `/events?upcoming=false&page=${previousPage}&limit=${LIMIT}`
        ),
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

  const renderEventCard = (event: Event) => {
    const spotsLeft = event.maxSeats - event.bookedSeats;
    const month = dayjs(event.eventDate).format('MMM').toUpperCase();
    const day = dayjs(event.eventDate).format('DD');
    const startTime = dayjs(`2024-01-01T${event.startTime}`).format('h:mm');
    const endTime = dayjs(`2024-01-01T${event.endTime}`).format('h:mm A');
    const tagList = event.tags.split(',').map((tag) => tag.trim());

    return (
      <div
        key={event.id}
        onClick={() => router.push(`/event/${event.id}`)}
        className="rounded-md bg-white shadow-md transform flex flex-col cursor-pointer hover:shadow-lg transition duration-200"
        style={{ height: '470px' }}
      >
        {event.imageUrl ? (
          <img
            src={`${process.env.NEXT_PUBLIC_API_URL}${event.imageUrl}`}
            alt={event.title}
            className="h-48 w-full object-cover rounded-t-md mb-2"
          />
        ) : (
          <div className="h-48 w-full bg-gray-200 rounded-t-md mb-2 flex items-center justify-center">
            <span className="text-gray-500">Image not available</span>
          </div>
        )}

        <div className="p-4 flex-grow space-y-2">
          <div className="flex items-center">
            <div className="flex flex-col items-start">
              <span className="text-xs text-blue-700 font-extrabold">
                {month}
              </span>
              <span className="text-2xl font-black">{day}</span>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 ml-5">
              {event.title}
            </h2>
          </div>

          <p className="text-sm text-gray-700 mb-3">
            We’ll get you directly seated and inside for you to enjoy the
            conference.
          </p>

          <div className="flex items-center text-xs text-gray-500 mb-3">
            <div className="flex items-center space-x-1 mr-4">
              <FaCalendarAlt className="mr-1" />
              <span>{dayjs(event.eventDate).format('dddd')}</span>
            </div>
            <div className="flex items-center space-x-1 mr-4">
              <FaClock className="mr-1" />
              <span>
                {startTime} – {endTime}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <FaMapMarkerAlt className="mr-1" />
              <span>{event.location}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {tagList.map((tag, i) => (
              <span
                key={i}
                className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <hr className="border-eb-blue-300 mb-2 mx-3" />

        <div className="flex justify-between text-sm text-gray-700 p-4">
          <div className="flex items-center">
            <FaChair className="mr-2" />
            <span>{spotsLeft} Spots Left</span>
          </div>
          <div className="text-gray-700">
            <span>Total {event.maxSeats} Seats</span>
          </div>
        </div>
      </div>
    );
  };

  const renderPagination = (
    currentPage: number,
    totalPages: number,
    setPage: (page: number) => void
  ) => {
    const pageNumbers = [];

    // Start looping from 1 to total pages
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex justify-center items-center gap-2 mt-10">
        {pageNumbers.map((page) => (
          <button
            key={page}
            onClick={() => setPage(page)}
            className={`px-3 py-1 rounded-md ${
              page === currentPage
                ? 'bg-blue-600 text-white'
                : 'border border-gray-400 text-gray-700 hover:bg-gray-100'
            }`}
          >
            {page}
          </button>
        ))}
      </div>
    );
  };

  if (loading) return <p className="text-center">Loading events...</p>;
  if (error) return <p className="text-red-600 text-center">{error}</p>;

  return (
    <div className="container mx-auto">
      <div className="relative w-full">
        <img src="/Banner.svg" alt="Banner" className="w-full object-contain" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white">
          <div className="mt-60 flex flex-col items-center gap-2 max-w-md w-full mx-auto">
            <p className="font-bold text-gray-900">Find Your Next Event</p>

            <div className="flex gap-2 w-full">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search events"
                className="border border-gray-300 px-4 py-3 rounded-sm flex-grow focus:outline-none focus:ring-1 focus:ring-blue-400 text-gray-700"
              />
              <Button className="px-6">Search Events</Button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#FAFAFF] p-6">
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Upcoming Events
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {upcomingEvents.map(renderEventCard)}
          </div>
          {renderPagination(upcomingPage, upcomingTotalPages, setUpcomingPage)}
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Previous Events
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {previousEvents.map(renderEventCard)}
          </div>
          {renderPagination(previousPage, previousTotalPages, setPreviousPage)}
        </div>
      </div>
    </div>
  );
};

export default EventsPage;
