'use client';

import { Dialog } from '@headlessui/react';
import { IoMdClose } from 'react-icons/io';
import { useEffect, useState } from 'react';
import axios from '@/lib/axios';
import { useRouter } from 'next/navigation';
import EventForm from '@/components/EventForm';

type EditEventModalProps = {
  id: number;
  onClose: () => void;
};

const EditEventModal: React.FC<EditEventModalProps> = ({ id, onClose }) => {
  const router = useRouter();

  const [initialValues, setInitialValues] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`/events/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const e = res.data;
        setInitialValues({
          title: e.title,
          description: e.description,
          eventDate: e.eventDate,
          startTime: e.startTime,
          endTime: e.endTime,
          location: e.location,
          maxSeats: e.maxSeats,
          tags: e.tags,
        });
      } catch {
        setError('Failed to load event');
      }
    };

    fetchEvent();
  }, [id]);

  const handleUpdate = async (formData: FormData) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`/events/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      onClose();
      window.location.reload();
    } catch (err) {
      console.error('Update failed', err);
    }
  };

  return (
    <Dialog open={true} onClose={onClose} className="fixed z-50 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black opacity-30" />
        <div className="relative bg-white rounded-xl w-full max-w-xl p-6 shadow-xl z-50">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <IoMdClose size={20} />
          </button>
          <h2 className="text-2xl font-medium text-eb-purple mb-6">Edit Event</h2>
          {error && <p className="text-red-500">{error}</p>}
          {!initialValues ? <p>Loading...</p> : (
            <EventForm mode="edit" initialValues={initialValues} onSubmit={handleUpdate} onClose={onClose}/>
          )}
        </div>
      </div>
    </Dialog>
  );
};

export default EditEventModal;
