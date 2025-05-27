'use client';

import { useEffect, useRef, useState } from 'react';
import Button from './Buttons';
import dayjs from 'dayjs';

type EventFormProps = {
  mode: 'create' | 'edit';
  initialValues?: Partial<EventFormData>;
  onSubmit: (formData: FormData) => Promise<void>;
  onClose?: () => void;
};

type EventFormData = {
  title: string;
  description: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  location: string;
  maxSeats: number;
  tags: string;
  image: File | null;
};

const EventForm: React.FC<EventFormProps> = ({
  mode,
  initialValues = {},
  onSubmit,
  onClose,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const [showTimePicker, setShowTimePicker] = useState(false);

  const [title, setTitle] = useState(initialValues.title || '');
  const [description, setDescription] = useState(
    initialValues.description || ''
  );
  const [eventDate, setEventDate] = useState(initialValues.eventDate || '');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [timeRangeDisplay, setTimeRangeDisplay] = useState('');
  const [location, setLocation] = useState(initialValues.location || '');
  const [maxSeats, setMaxSeats] = useState(initialValues.maxSeats || 1);
  const [tags, setTags] = useState(initialValues.tags || '');
  const [image, setImage] = useState<File | null>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState('');

  const validate = () => {
    const e: Record<string, string> = {};
    if (title.trim().length < 3)
      e.title = 'Title must be at least 3 characters';
    if (description.trim().length < 10) e.description = 'Description too short';
    if (!eventDate) e.eventDate = 'Date is required';
    if (!startTime) e.startTime = 'Start time is required';
    if (!endTime) e.endTime = 'End time is required';
    if (!location.trim()) e.location = 'Location is required';
    if (maxSeats < 1) e.maxSeats = 'At least 1 seat is required';
    if (!tags.trim()) e.tags = 'Tags are required';
    return e;
  };

  useEffect(() => {
    setErrors(validate());
  }, [
    title,
    description,
    eventDate,
    startTime,
    endTime,
    location,
    maxSeats,
    tags,
  ]);

  useEffect(() => {
    if (mode === 'edit' && initialValues.startTime && initialValues.endTime) {
      const st = initialValues.startTime.slice(0, 5); // e.g., "09:00"
      const et = initialValues.endTime.slice(0, 5);

      setStartTime(st);
      setEndTime(et);

      const formattedStart = dayjs(`2024-01-01T${st}`).format('hh:mm A');
      const formattedEnd = dayjs(`2024-01-01T${et}`).format('hh:mm A');

      setTimeRangeDisplay(`${formattedStart} – ${formattedEnd}`);
    }
  }, [initialValues, mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    setTouched({
      title: true,
      description: true,
      eventDate: true,
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
    formData.append(
      'startTime',
      startTime.length === 5 ? `${startTime}:00` : startTime
    );
    formData.append(
      'endTime',
      endTime.length === 5 ? `${endTime}:00` : endTime
    );
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
        {touched.title && errors.title && (
          <p className="text-red-500">{errors.title}</p>
        )}
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
        {touched.description && errors.description && (
          <p className="text-red-500">{errors.description}</p>
        )}
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
          {touched.eventDate && errors.eventDate && (
            <p className="text-red-500">{errors.eventDate}</p>
          )}
        </div>

        <div className="flex-1">
          <label className="block font-medium mb-1">Time</label>
          <input
            type="text"
            readOnly
            value={timeRangeDisplay}
            placeholder="e.g. 09:00 AM – 11:00 AM"
            onClick={() => setShowTimePicker(true)}
            className="w-full border rounded-md px-3 py-2 cursor-pointer"
          />

          {showTimePicker && (
            <div className="absolute z-50 bg-white border rounded p-4 mt-2 shadow-md w-72">
              <div className="mb-2">
                <label className="text-sm font-medium">Start Time</label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full border px-2 py-1 mt-1 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="text-sm font-medium">End Time</label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full border px-2 py-1 mt-1 rounded"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowTimePicker(false)}
                  className="text-sm px-4 py-1 rounded border"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const parsedStart = dayjs(
                      `2024-01-01T${startTime}`,
                      'YYYY-MM-DDTHH:mm'
                    );
                    const parsedEnd = dayjs(
                      `2024-01-01T${endTime}`,
                      'YYYY-MM-DDTHH:mm'
                    );

                    const formattedStart = parsedStart.format('hh:mm A');
                    const formattedEnd = parsedEnd.format('hh:mm A');

                    setTimeRangeDisplay(`${formattedStart} – ${formattedEnd}`);
                    setShowTimePicker(false);
                  }}
                  disabled={!startTime || !endTime}
                >
                  Set Time
                </button>
              </div>
            </div>
          )}
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
        {touched.location && errors.location && (
          <p className="text-red-500">{errors.location}</p>
        )}
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
          {touched.maxSeats && errors.maxSeats && (
            <p className="text-red-500">{errors.maxSeats}</p>
          )}
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
          {touched.tags && errors.tags && (
            <p className="text-red-500">{errors.tags}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block font-medium mb-2">Image</label>
        <div className="flex items-center gap-4">
          <div
            onClick={handleImageBrowse}
            className="rounded-full cursor-pointer"
          >
            <img src="/Upload.svg" alt="Upload" />
          </div>
          <div className="text-sm">
            Drag or{' '}
            <span
              className="text-blue-600 underline cursor-pointer"
              onClick={handleImageBrowse}
            >
              upload
            </span>{' '}
            the picture
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
        {onClose && (
          <button
            type="button"
            onClick={() => onClose()}
            className="text-gray-500 hover:text-gray-700 text-sm font-medium"
          >
            Cancel
          </button>
        )}
        <Button type="submit" className="text-white px-4 py-2 text-sm">
          {mode === 'edit' ? 'Update Event' : 'Create Event'}
        </Button>
      </div>
    </form>
  );
};

export default EventForm;
