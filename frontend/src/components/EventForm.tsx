'use client';

import { useEffect, useRef, useState } from 'react';
import Button from './Buttons';

type EventFormProps = {
  mode: 'create' | 'edit';
  initialValues?: Partial<EventFormData>;
  onSubmit: (formData: FormData) => Promise<void>;
  onClose?: () => void; // <-- Add this line!
};


type EventFormData = {
  title: string;
  description: string;
  eventDate: string;
  eventTime: string;
  location: string;
  maxSeats: number;
  tags: string;
  image: File | null;
};

const EventForm: React.FC<EventFormProps> = ({ mode, initialValues = {}, onSubmit, onClose }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const [title, setTitle] = useState(initialValues.title || '');
  const [description, setDescription] = useState(initialValues.description || '');
  const [eventDate, setEventDate] = useState(initialValues.eventDate || '');
  const [eventTime, setEventTime] = useState(initialValues.eventTime || '');
  const [location, setLocation] = useState(initialValues.location || '');
  const [maxSeats, setMaxSeats] = useState(initialValues.maxSeats || 1);
  const [tags, setTags] = useState(initialValues.tags || '');
  const [image, setImage] = useState<File | null>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState('');

  const validate = () => {
    const e: Record<string, string> = {};
    if (title.trim().length < 3) e.title = 'Title must be at least 3 characters';
    if (description.trim().length < 10) e.description = 'Description too short';
    if (!eventDate) e.eventDate = 'Date is required';
    if (!eventTime) e.eventTime = 'Time is required';
    if (!location.trim()) e.location = 'Location is required';
    if (maxSeats < 1) e.maxSeats = 'At least 1 seat is required';
    if (!tags.trim()) e.tags = 'Tags are required';
    return e;
  };

  useEffect(() => {
    setErrors(validate());
  }, [title, description, eventDate, eventTime, location, maxSeats, tags]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    setTouched({
      title: true,
      description: true,
      eventDate: true,
      eventTime: true,
      location: true,
      maxSeats: true,
      tags: true,
    });

    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      setSubmitError('Please fill all fields correctly.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('eventDate', eventDate);
    formData.append('eventTime', eventTime.length === 5 ? `${eventTime}:00` : eventTime);
    formData.append('location', location);
    formData.append('maxSeats', maxSeats.toString());
    formData.append('tags', tags);
    if (image) formData.append('image', image);

    await onSubmit(formData);
  };

  const handleImageBrowse = () => {
    fileInputRef.current?.click();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-eb-purple text-sm">
      <div>
        <label className="block font-medium mb-1">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={() => setTouched((prev) => ({ ...prev, title: true }))}
          className="w-full border rounded-md px-3 py-2"
        />
        {touched.title && errors.title && <p className="text-red-500">{errors.title}</p>}
      </div>

      <div>
        <label className="block font-medium mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onBlur={() => setTouched((prev) => ({ ...prev, description: true }))}
          className="w-full border rounded-md px-3 py-2"
          rows={3}
        />
        {touched.description && errors.description && <p className="text-red-500">{errors.description}</p>}
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block font-medium mb-1">Date</label>
          <input
            type="date"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            onBlur={() => setTouched((prev) => ({ ...prev, eventDate: true }))}
            className="w-full border rounded-md px-3 py-2"
          />
          {touched.eventDate && errors.eventDate && <p className="text-red-500">{errors.eventDate}</p>}
        </div>

        <div className="flex-1">
          <label className="block font-medium mb-1">Time</label>
          <input
            type="time"
            value={eventTime}
            onChange={(e) => setEventTime(e.target.value)}
            onBlur={() => setTouched((prev) => ({ ...prev, eventTime: true }))}
            className="w-full border rounded-md px-3 py-2"
          />
          {touched.eventTime && errors.eventTime && <p className="text-red-500">{errors.eventTime}</p>}
        </div>
      </div>

      <div>
        <label className="block font-medium mb-1">Event Location</label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          onBlur={() => setTouched((prev) => ({ ...prev, location: true }))}
          className="w-full border rounded-md px-3 py-2"
        />
        {touched.location && errors.location && <p className="text-red-500">{errors.location}</p>}
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block font-medium mb-1">Capacity</label>
          <input
            type="number"
            min={1}
            value={maxSeats}
            onChange={(e) => setMaxSeats(Number(e.target.value))}
            onBlur={() => setTouched((prev) => ({ ...prev, maxSeats: true }))}
            className="w-full border rounded-md px-3 py-2"
          />
          {touched.maxSeats && errors.maxSeats && <p className="text-red-500">{errors.maxSeats}</p>}
        </div>

        <div className="flex-1">
          <label className="block font-medium mb-1">Tags</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            onBlur={() => setTouched((prev) => ({ ...prev, tags: true }))}
            className="w-full border rounded-md px-3 py-2"
          />
          {touched.tags && errors.tags && <p className="text-red-500">{errors.tags}</p>}
        </div>
      </div>

      <div>
        <label className="block font-medium mb-2">Image</label>
        <div className="flex items-center gap-4">
          <div onClick={handleImageBrowse} className="rounded-full cursor-pointer">
            <img src="/Upload.svg" alt="Upload" />
          </div>
          <div className="text-sm">
            Drag or <span className="text-blue-600 underline cursor-pointer" onClick={handleImageBrowse}>upload</span> the picture
            <br />
            <span className="text-gray-500">Max. 5MB | JPG, PNG</span>
          </div>
          <button
            type="button"
            onClick={handleImageBrowse}
            className="ml-auto bg-blue-50 px-3 py-2 rounded-lg text-xs text-blue-600 border-2 border-blue-100 hover:bg-blue-100 shadow-sm"
          >
            Browse
          </button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={(e) => setImage(e.target.files?.[0] || null)}
            className="hidden"
          />
        </div>
        {image && (
          <div className="flex justify-between items-center text-sm text-gray-600 mt-1">
            <span>{image.name}</span>
            <button
              type="button"
              onClick={() => {
                setImage(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
              className="text-red-500 hover:text-red-700 font-semibold"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {submitError && <p className="text-red-600 text-sm">{submitError}</p>}

      <div className="flex justify-end gap-4 pt-4">
        <button
            type="button"
            onClick={() => onClose?.()} // make it safe for CreateEventModal too
            className="text-gray-500 hover:text-gray-700 text-sm font-medium"
        >
            Cancel
        </button>
        <Button type="submit" className="text-white px-4 py-2 text-sm">
            {mode === 'edit' ? 'Update Event' : 'Create Event'}
        </Button>
        </div>

    </form>
  );
};

export default EventForm;
