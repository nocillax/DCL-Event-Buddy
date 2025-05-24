'use client';

import { useState, useEffect, useRef } from 'react';
import axios from '@/lib/axios';
import { useRouter, useParams } from 'next/navigation';

export default function EditEventPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = typeof params?.id === 'string' ? params.id : Array.isArray(params?.id) ? params.id[0] : '';
  const fileInputRef = useRef<HTMLInputElement>(null);




  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [location, setLocation] = useState('');
  const [maxSeats, setMaxSeats] = useState(1);
  const [tags, setTags] = useState('');
  const [image, setImage] = useState<File | null>(null);

  const [titleError, setTitleError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  const [dateError, setDateError] = useState('');
  const [timeError, setTimeError] = useState('');
  const [locationError, setLocationError] = useState('');
  const [seatsError, setSeatsError] = useState('');
  const [tagsError, setTagsError] = useState('');
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`/events/${eventId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const event = res.data;
        setTitle(event.title);
        setDescription(event.description);
        setEventDate(event.eventDate);
        setEventTime(event.eventTime);
        setLocation(event.location);
        setMaxSeats(event.maxSeats);
        setTags(event.tags);
      } catch (err) {
        setSubmitError('Failed to load event details');
      }
    };
    if (eventId) fetchEvent();
  }, [eventId]);

  useEffect(() => {
    setTitleError(title.trim().length < 3 ? 'Title must be at least 3 characters' : '');
  }, [title]);

  useEffect(() => {
    setDescriptionError(description.trim().length < 10 ? 'Description too short' : '');
  }, [description]);

  useEffect(() => {
    setDateError(!eventDate ? 'Date is required' : '');
  }, [eventDate]);

  useEffect(() => {
    setTimeError(!eventTime ? 'Time is required' : '');
  }, [eventTime]);

  useEffect(() => {
    setLocationError(!location.trim() ? 'Location is required' : '');
  }, [location]);

  useEffect(() => {
    setSeatsError(maxSeats < 1 ? 'At least 1 seat is required' : '');
  }, [maxSeats]);

  useEffect(() => {
    setTagsError(!tags.trim() ? 'Tags are required' : '');
  }, [tags]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    const hasError = [
      titleError,
      descriptionError,
      dateError,
      timeError,
      locationError,
      seatsError,
      tagsError
    ].some(Boolean);

    if (hasError) {
      setSubmitError('Please fix the errors above');
      return;
    }

    const formattedTime = eventTime.length === 5 ? eventTime + ':00' : eventTime;


    const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('eventDate', eventDate);
        formData.append('eventTime', formattedTime);
        formData.append('location', location);
        formData.append('maxSeats', maxSeats.toString());
        formData.append('tags', tags);
        if (image) formData.append('image', image);

        try {
        const token = localStorage.getItem('token');
        const res = await axios.patch(`/events/${eventId}`, formData, {
            headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
            },
        });
        console.log('Event updated:', res.data);
        router.push('/admin');
        } catch (err: any) {
        const msg = err?.response?.data?.message;
        setSubmitError(typeof msg === 'string' ? msg : msg?.[0] || 'Update failed');
        }
    };

  return (
    <div className="max-w-xl mx-auto mt-12 p-6 border rounded shadow-sm">
      <h1 className="text-2xl font-semibold mb-4">Edit Event</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input 
            type="text" 
            placeholder="Title" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            className="w-full border p-2 rounded text-black" 
        />
        {titleError && <p className="text-red-500 text-sm">{titleError}</p>}

        <textarea 
            placeholder="Description" 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            className="w-full border p-2 rounded text-black" 
        />
        {descriptionError && <p className="text-red-500 text-sm">{descriptionError}</p>}

        <input 
            type="date" 
            value={eventDate} 
            onChange={(e) => setEventDate(e.target.value)} 
            className="w-full border p-2 rounded text-black" 
        />
        {dateError && <p className="text-red-500 text-sm">{dateError}</p>}

        <input 
            type="time" 
            value={eventTime} 
            onChange={(e) => setEventTime(e.target.value)} 
            className="w-full border p-2 rounded text-black" 
        />
        {timeError && <p className="text-red-500 text-sm">{timeError}</p>}

        <input 
            type="text" 
            placeholder="Location" 
            value={location} 
            onChange={(e) => setLocation(e.target.value)} 
            className="w-full border p-2 rounded text-black" 
        />
        {locationError && <p className="text-red-500 text-sm">{locationError}</p>}

        <input 
            type="number" min={1} 
            placeholder="Capacity" 
            value={maxSeats} 
            onChange={(e) => setMaxSeats(Number(e.target.value))} 
            className="w-full border p-2 rounded text-black" 
        />
        {seatsError && <p className="text-red-500 text-sm">{seatsError}</p>}

        <input 
            type="text" 
            placeholder="Tags" 
            value={tags} 
            onChange={(e) => setTags(e.target.value)} 
            className="w-full border p-2 rounded text-black" 
        />
        {tagsError && <p className="text-red-500 text-sm">{tagsError}</p>}

        <div>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={(e) => setImage(e.target.files?.[0] || null)}
            className="w-full border p-2 rounded"
          />
          {image && (
            <div className="flex justify-between items-center text-sm text-gray-600 mt-1">
              <span>{image.name}</span>
              <button
                type="button"
                onClick={() => {
                    setImage(null);
                if (fileInputRef.current) 
                    fileInputRef.current.value = '';
                }}
                className="text-red-500 hover:text-red-700 font-semibold"
              >
                ✕
              </button>
            </div>
          )}
        </div>

        {submitError && <p className="text-red-600 text-sm">{submitError}</p>}

        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Update Event
        </button>
      </form>
    </div>
  );
}
