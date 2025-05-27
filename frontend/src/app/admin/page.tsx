'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from '@/lib/axios';
import Button from '@/components/Buttons';
import { FaEdit, FaEye, FaTrash } from 'react-icons/fa';
import PageContainer from '@/components/PageContainer';
import CreateEventModal from '@/components/CreateEventModal';
import EditEventModal from '@/components/EditEventModal';

interface Event {
  id: number;
  title: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  location: string;
  maxSeats: number;
  bookedSeats: number;
}

interface EventsApiResponse {
  events: Event[];
  total: number;
  page: number;
  totalPages: number;
}

const AdminDashboardPage = () => {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [adminName, setAdminName] = useState('');
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  const fetchEvents = async (pageNumber: number) => {
    setLoading(true);
    try {
      const res = await axios.get<EventsApiResponse>(
        `/events?page=${pageNumber}`
      );
      setTotalPages(res.data.totalPages);

      if (pageNumber === 1) {
        setEvents(res.data.events);
      } else {
        setEvents((prev) => {
          const newEvents = res.data.events;

          const uniqueEvents = newEvents.filter(
            (newEvent) => !prev.some((e) => e.id === newEvent.id)
          );

          return [...prev, ...uniqueEvents];
        });
      }
    } catch {
      setError('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (page < totalPages && !loading) {
      const nextPage = page + 1;
      fetchEvents(nextPage);
      setPage(nextPage);
    }
  };

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

    fetchEvents(1);
  }, [router]);

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this event?'
    );
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
    <PageContainer>
      <div className="p-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-medium text-eb-purple mt-12 ">
            Admin Dashboard
          </h2>
        </div>
        <p className="text-[#6A5A8A] mt-2">
          Manage events, view registrations, and monitor your platform.
        </p>
      </div>

      <div className="p-6 flex-grow">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-eb-purple">
            Events Management
          </h3>

          <Button
            onClick={() => setIsModalOpen(true)}
            className="px-3 py-2 font-medium text-sm"
          >
            Create Event
          </Button>
        </div>

        {error && <p className="text-red-500">{error}</p>}

        <div className="overflow-x-auto">
          {events.length === 0 ? (
            <p>No events found.</p>
          ) : (
            <table className="w-full table-auto border-collapse text-eb-purple">
              <thead>
                <tr className="bg-[#FFFFFF] border border-gray-300 text-xs text-left">
                  <th className="px-4 py-2 ">Title</th>
                  <th className="px-4 py-2 ">Date</th>
                  <th className="px-4 py-2 ">Location</th>
                  <th className="px-4 py-2 ">Registrations</th>
                  <th className="px-4 py-2 ">Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map((e) => (
                  <tr
                    key={e.id}
                    className="hover:bg-gray-50 border-b border-gray-200 text-xs"
                  >
                    <td className="px-4 py-2">{e.title}</td>
                    <td className="px-4 py-2">{e.eventDate}</td>
                    <td className="px-4 py-2">{e.location}</td>
                    <td className="px-4 py-2">
                      {e.bookedSeats} / {e.maxSeats}
                    </td>
                    <td className="px-4 py-2 text-xs flex space-x-2">
                      <button className="text-gray-600 hover:text-blue-600">
                        <FaEye />
                      </button>

                      <button
                        onClick={() => setEditId(e.id)}
                        className="text-gray-600 hover:text-blue-600"
                      >
                        <FaEdit />
                      </button>

                      <button
                        onClick={() => handleDelete(e.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {page < totalPages && (
            <div className="flex justify-center mt-4">
              <Button
                onClick={loadMore}
                className="px-3 py-2 text-xs font-semibold"
              >
                Load More
              </Button>
            </div>
          )}
        </div>
      </div>
      <CreateEventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {editId !== null && (
        <EditEventModal id={editId} onClose={() => setEditId(null)} />
      )}
    </PageContainer>
  );
};
export default AdminDashboardPage;
