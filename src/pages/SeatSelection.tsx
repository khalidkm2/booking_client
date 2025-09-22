import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import { fetchSeatsForShow, reserveSeat } from "../features/seatSlice";
import { Button } from "@/components/ui/button";

export default function SeatSelection() {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const seats = useAppSelector((s) => s.seats.seats as any[]);
  const user = useAppSelector((s) => s.auth.user);
  const [selected, setSelected] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      dispatch(fetchSeatsForShow(Number(id)));
    }
  }, [id, dispatch]);

  const handleReserve = async () => {
    if (!selected) return alert("Please select a seat");
    await dispatch(
      reserveSeat({ showId: Number(id), seatId: selected, userId: user?.id } as any)
    );
    navigate("/reservations");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-yellow-50 to-yellow-100 font-serif ">
      <h2 className="text-2xl md:text-3xl font-bold text-yellow-900 mb-6 tracking-wide text-center">
        🎬 Select Your Seat
      </h2>

      {/* Screen */}
      <div className="w-full max-w-2xl h-6 bg-yellow-900/80 text-yellow-50 text-center rounded-t-lg shadow-md mb-8 flex items-center justify-center text-sm md:text-base">
        SCREEN
      </div>

      {/* Seats Grid (scrollable on small screens) */}
      <div className="overflow-x-auto">
        <div className="grid grid-cols-10 gap-2 sm:gap-3 bg-yellow-50 border-2 border-yellow-900/40 p-4 sm:p-6 rounded-2xl shadow-xl min-w-[28rem] sm:min-w-[32rem]">
          {seats?.map((seat: any) => (
            <button
              key={seat.id}
              disabled={seat.isBooked}
              onClick={() => setSelected(seat.id)}
              className={`
                w-8 h-8 sm:w-12 sm:h-12 rounded-md border-2 font-semibold text-xs sm:text-sm
                transition-transform transform hover:scale-105
                ${
                  seat.isBooked
                    ? "bg-gray-300 border-gray-400 text-gray-500 cursor-not-allowed"
                    : selected === seat.id
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

      {/* Legend */}
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

      {/* Reserve Button */}
      <div className="mt-8">
        <Button
          onClick={handleReserve}
          disabled={!selected}
          className="px-6 sm:px-8 py-2 sm:py-3 bg-yellow-900 hover:bg-yellow-800 text-yellow-50 rounded-lg shadow-lg font-semibold tracking-wide disabled:opacity-50"
        >
          🎟️ Reserve Seat
        </Button>
      </div>
    </div>
  );
}
