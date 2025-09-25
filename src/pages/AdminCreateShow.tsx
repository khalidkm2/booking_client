import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import { createShow } from '../features/showSlice';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let imageUrl = '';

    // Upload to Cloudinary if file selected
    if (imageFile) {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', imageFile);
      formData.append('upload_preset', import.meta.env.VITE_PRESET_NAME);

      try {
        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUD_NAME}/image/upload`,
          { method: 'POST', body: formData }
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

    // Convert datetime-local to ISO string for backend
    const startingTimeISO = startingTime ? new Date(startingTime).toISOString() : null;
    if(!startingTimeISO){
      return false
    }

    await dispatch(
      createShow({
        title,
        description,
        category,
        startingTime: startingTimeISO,
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
    <div className="px-4 md:px-8 py-8 min-h-screen bg-yellow-50 font-serif flex justify-center">
      <Card className="max-w-xl w-full shadow-xl border-2 border-yellow-900/30 bg-yellow-50">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-yellow-900 text-center">
            Create New Show
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-semibold mb-1">Title</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border p-2 w-full rounded"
                required
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border p-2 w-full rounded"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Category</label>
              <input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="border p-2 w-full rounded"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Starting Time</label>
              <input
                type="datetime-local"
                value={startingTime}
                onChange={(e) => setStartingTime(e.target.value)}
                className="border p-2 w-full rounded"
                required
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Duration (minutes)</label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="border p-2 w-full rounded"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Price ($)</label>
              <input
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="border p-2 w-full rounded"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Rating</label>
              <input
                type="number"
                step="0.1"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                className="border p-2 w-full rounded"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Language</label>
              <input
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="border p-2 w-full rounded"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Age Limit</label>
              <input
                value={ageLimit}
                onChange={(e) => setAgeLimit(e.target.value)}
                className="border p-2 w-full rounded"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Background Image URL</label>
              <input
                value={backgroundImage}
                onChange={(e) => setBackgroundImage(e.target.value)}
                className="border p-2 w-full rounded"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Poster Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="border p-2 w-full rounded"
              />
              {imageFile && <p className="text-sm mt-1">Selected file: {imageFile.name}</p>}
            </div>

            <Button type="submit" disabled={uploading} className={`w-full ${uploading ? 'bg-gray-400' : 'bg-yellow-900'}`}>
              {uploading ? 'Uploading...' : 'Create Show'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
