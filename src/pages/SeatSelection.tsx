import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import { fetchSeatsForShow, reserveSeat } from '../features/seatSlice';

export default function SeatSelection() {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const seats = useAppSelector((s) => s.seats.seats as any[]);
  const user = useAppSelector((s) => s.auth.user);
  const [selected, setSelected] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => { if (id){
    console.log("id",id)
    dispatch(fetchSeatsForShow(Number(id))); 
  } }, [id, dispatch]);

  console.log("swat",seats);

  const handleReserve = async () => {
    if (!selected) return alert('select seat');
    await dispatch(reserveSeat({ showId: Number(id), seatId: selected, userId: user?.id } as any));
    navigate('/reservations');
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Select Seat</h2>
      <div className="grid grid-cols-6 gap-2">
        {seats?.map((seat: any) => (
          <button
            key={seat.id}
            disabled={seat.isBooked}
            onClick={() => setSelected(seat.id)}
            className={`p-2 border rounded ${seat.isBooked ? 'opacity-50 cursor-not-allowed' : selected === seat.id ? 'bg-green-300' : ''}`}>
            {seat.seatNo}
          </button>
        ))}
      </div>
      <div className="mt-4">
        <button onClick={handleReserve} className="p-2 bg-blue-600 text-white rounded">Reserve</button>
      </div>
    </div>
  );
}