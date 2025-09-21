import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import { createShow } from '../features/showSlice';

export default function AdminCreateShow() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [startingTime, setStartingTime] = useState('');
  const [duration, setDuration] = useState('');
  const [price, setPrice] = useState('');
  const [rating, setRating] = useState('');
  const [language, setLanguage] = useState('');
  const [ageLimit, setAgeLimit] = useState('');
  const [backgroundImage, setBackgroundImage] = useState('');

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();

    let imageUrl = '';

    // Upload to Cloudinary if file selected
    if (imageFile) {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', imageFile);
      formData.append('upload_preset', import.meta.env.VITE_PRESET_NAME); // <-- replace with your preset

      try {
        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUD_NAME}/image/upload`,
          {
            method: 'POST',
            body: formData,
          }
        );
        const data = await res.json();
        imageUrl = data.secure_url;
      } catch (err) {
        console.error('Cloudinary upload error:', err);
        setUploading(false);
        return;
      }
      setUploading(false);
    }

    // Dispatch to backend with all fields
    await dispatch(
      createShow({
        title,
        description,
        category,
        startingTime,
        duration: duration ? parseInt(duration) : null,
        price: price ? parseFloat(price) : null,
        rating: rating ? parseFloat(rating) : null,
        language,
        ageLimit,
        backgroundImage,
        image: imageUrl,
      })
    );

    // Reset form
    setTitle('');
    setDescription('');
    setCategory('');
    setStartingTime('');
    setDuration('');
    setPrice('');
    setRating('');
    setLanguage('');
    setAgeLimit('');
    setBackgroundImage('');
    setImageFile(null);
  };

  if (!user || user.role !== 'ADMIN') return <div>Not authorized</div>;

  return (
    <form onSubmit={handle} className="max-w-md space-y-4">
      <h2 className="text-xl font-bold">Create Show</h2>

      <div>
        <label className="block">Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 w-full"
          required
        />
      </div>

      <div>
        <label className="block">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 w-full"
        />
      </div>

      <div>
        <label className="block">Category</label>
        <input
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border p-2 w-full"
        />
      </div>

      <div>
        <label className="block">Starting Time (ISO)</label>
        <input
          value={startingTime}
          onChange={(e) => setStartingTime(e.target.value)}
          className="border p-2 w-full"
          placeholder="2025-09-21T14:30:00.000Z"
        />
      </div>

      <div>
        <label className="block">Duration (minutes)</label>
        <input
          type="number"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          className="border p-2 w-full"
        />
      </div>

      <div>
        <label className="block">Price ($)</label>
        <input
          type="number"
          step="0.01"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="border p-2 w-full"
        />
      </div>

      <div>
        <label className="block">Rating</label>
        <input
          type="number"
          step="0.1"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          className="border p-2 w-full"
        />
      </div>

      <div>
        <label className="block">Language</label>
        <input
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="border p-2 w-full"
        />
      </div>

      <div>
        <label className="block">Age Limit</label>
        <input
          value={ageLimit}
          onChange={(e) => setAgeLimit(e.target.value)}
          className="border p-2 w-full"
        />
      </div>

      <div>
        <label className="block">Background Image URL (optional)</label>
        <input
          value={backgroundImage}
          onChange={(e) => setBackgroundImage(e.target.value)}
          className="border p-2 w-full"
        />
      </div>

      <div>
        <label className="block">Poster Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="border p-2 w-full"
        />
        {imageFile && (
          <p className="text-sm mt-1">Selected file: {imageFile.name}</p>
        )}
      </div>

      <button
        type="submit"
        className={`mt-4 p-2 text-white rounded ${
          uploading ? 'bg-gray-400' : 'bg-blue-600'
        }`}
        disabled={uploading}
      >
        {uploading ? 'Uploading...' : 'Create'}
      </button>
    </form>
  );
}
