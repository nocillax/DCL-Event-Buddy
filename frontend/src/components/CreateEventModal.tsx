'use client';

import { Dialog } from '@headlessui/react';
import { IoMdClose } from 'react-icons/io';
import { useRouter } from 'next/navigation';
import axios from '@/lib/axios';
import EventForm from '@/components/EventForm';

type CreateEventModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const CreateEventModal: React.FC<CreateEventModalProps> = ({ isOpen, onClose }) => {
  const router = useRouter();

  const handleCreate = async (formData: FormData) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('/events', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      onClose();
      router.refresh();
    } catch (err) {
      console.error('Failed to create event:', err);
      // You can improve this by passing an error handler to EventForm if needed
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed z-50 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black opacity-30" />
        <div className="relative bg-white rounded-xl w-full max-w-xl p-6 shadow-xl z-50">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <IoMdClose size={20} />
          </button>
          <h2 className="text-2xl font-medium text-eb-purple mb-6">Create New Event</h2>
          <EventForm mode="create" onSubmit={handleCreate} />
        </div>
      </div>
    </Dialog>
  );
};

export default CreateEventModal;
