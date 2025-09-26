import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import { fetchSeatsForShow, reserveSeats } from "../features/seatSlice";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export default function SeatSelection() {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const seats = useAppSelector((s) => s.seats.seats as any[]);
  const user = useAppSelector((s) => s.auth.user);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) dispatch(fetchSeatsForShow(Number(id)));
  }, [id, dispatch]);

  const toggleSeat = (seatId: number) => {
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter((id) => id !== seatId));
    } else {
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  const handleReserve = async () => {
    if (selectedSeats.length === 0) return alert("Please select at least one seat");
    setLoading(true); // ⬅️ start loading
    try {
      await dispatch(
        reserveSeats({ showId: Number(id), seatIds: selectedSeats, userId: user?.id } as any)
      );
      navigate("/profile");
    } catch (err) {
      console.error(err);
      alert("Failed to reserve seats. Please try again.");
    } finally {
      setLoading(false); // ⬅️ stop loading
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-yellow-50 to-yellow-100 font-serif">
      {/* --- Loading Overlay --- */}
      <AnimatePresence>
        {loading && (
          <motion.div
            className="absolute inset-0 bg-black/40 z-50 flex justify-center items-center text-white text-xl font-bold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            exit={{ opacity: 0 }}
          >
            Reserving Seats...
          </motion.div>
        )}
      </AnimatePresence>

      <h2 className="text-2xl md:text-3xl font-bold text-yellow-900 mb-6 tracking-wide text-center">
        🎬 Select Your Seats
      </h2>

      <div className="w-full max-w-2xl h-6 bg-yellow-900/80 text-yellow-50 text-center rounded-t-lg shadow-md mb-8 flex items-center justify-center text-sm md:text-base">
        SCREEN
      </div>

      <div className="overflow-x-auto">
        <div className="grid grid-cols-10 gap-2 sm:gap-3 bg-yellow-50 border-2 border-yellow-900/40 p-4 sm:p-6 rounded-2xl shadow-xl min-w-[28rem] sm:min-w-[32rem]">
          {seats?.map((seat) => (
            <button
              key={seat.id}
              disabled={seat.isBooked || loading} // ⬅️ prevent clicks while loading
              onClick={() => toggleSeat(seat.id)}
              className={`
                w-8 h-8 sm:w-12 sm:h-12 rounded-md border-2 font-semibold text-xs sm:text-sm
                transition-transform transform hover:scale-105
                ${
                  seat.isBooked
                    ? "bg-gray-300 border-gray-400 text-gray-500 cursor-not-allowed"
                    : selectedSeats.includes(seat.id)
                    ? "bg-yellow-600 border-yellow-800 text-yellow-50 shadow-lg"
                    : "bg-yellow-100 border-yellow-600 text-yellow-900 hover:bg-yellow-200"
                }
              `}
            >
              {seat.seatNo}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mt-6 text-xs sm:text-sm text-yellow-900 justify-center">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 sm:w-5 sm:h-5 bg-yellow-600 border border-yellow-800 rounded"></div>
          Selected
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 sm:w-5 sm:h-5 bg-yellow-100 border border-yellow-600 rounded"></div>
          Available
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 sm:w-5 sm:h-5 bg-gray-300 border border-gray-400 rounded"></div>
          Booked
        </div>
      </div>

      <div className="mt-8">
        <Button
          onClick={handleReserve}
          disabled={selectedSeats.length === 0 || loading} // ⬅️ disable button while loading
          className="px-6 sm:px-8 cursor-pointer py-2 sm:py-3 bg-yellow-900 hover:bg-yellow-800 text-yellow-50 rounded-lg shadow-lg font-semibold tracking-wide disabled:opacity-50"
        >
          {loading ? "🎟️ Reserving..." : `🎟️ Reserve Seats (${selectedSeats.length})`}
        </Button>
      </div>
    </div>
  );
}
