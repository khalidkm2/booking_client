import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import { fetchShow } from '../features/showSlice';

export default function ShowDetails() {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const show = useAppSelector((s) => s.shows.shows.find((x: any) => x.id === Number(id)));
  useEffect(() => { if (id) dispatch(fetchShow(Number(id))); }, [id, dispatch]);
  if (!show) return <div>Loading...</div>;
  return (
    <div>
      <h1 className="text-2xl font-bold">{show.title}</h1>
      <p>Starts: {new Date(show.startingTime).toLocaleString()}</p>
      <Link to={`/shows/${show.id}/seats`} className="mt-4 inline-block">Select Seats</Link>
    </div>
  );
}