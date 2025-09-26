import  { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/hooks/reduxHooks";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { getReservations, cancelReservation } from "@/features/reservationSlice";
import { motion, AnimatePresence } from "framer-motion";

export default function Profile() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const { reservations = [], loading } = useAppSelector((s) => s.reservations);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedResList, setSelectedResList] = useState<any[]>([]);

  useEffect(() => {
    if (user) dispatch(getReservations());
  }, [user, dispatch]);

  const openCancelModal = (resList: any[]) => {
    setSelectedResList(resList);
    setModalOpen(true);
  };

  const confirmCancel = () => {
    if (!selectedResList.length) return;
    const reservationId = selectedResList[0].id;
    dispatch(cancelReservation({ reservationId, userId: selectedResList[0].userId }));
    setModalOpen(false);
  };

  const groupedReservations = Array.isArray(reservations)
    ? reservations.reduce((acc: any, res: any) => {
        if (!acc[res.showId]) acc[res.showId] = [];
        acc[res.showId].push(res);
        return acc;
      }, {} as Record<number, any[]>)
    : {};

  return (
    <div className="px-4 md:px-8 py-8 min-h-screen bg-yellow-50 font-serif">
      {/* User Details */}
      <Card className="max-w-3xl mx-auto mb-8 shadow-xl border-2 border-yellow-900/30 bg-yellow-50">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-yellow-900 tracking-wide">
            🎬 {user?.name}'s Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="text-yellow-900 space-y-2 text-sm md:text-base">
          <p>
            <span className="font-semibold">Email:</span> {user?.email}
          </p>
          <p>
            <span className="font-semibold">Total Reservations:</span>{" "}
            {Array.isArray(reservations) ? reservations.length : 0}
          </p>
        </CardContent>
      </Card>

      {/* Reservations */}
      <h2 className="text-2xl font-bold text-yellow-900 mb-4 text-center">My Reservations</h2>
      {loading && <p className="text-center text-yellow-900">Loading reservations...</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.keys(groupedReservations).length === 0 && !loading && (
          <p className="text-yellow-900 text-center col-span-full">No reservations yet.</p>
        )}

        {Object.entries(groupedReservations).map(([showId, resList]: any) => {
          const show = resList[0].show || {};
          const anyConfirmed = resList.some((r: any) => r.status === "CONFIRMED");

          return (
            <Card
              key={showId}
              className="bg-yellow-50 border border-yellow-900/20 shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1"
            >
              <img
                src={show.image || "https://via.placeholder.com/400x200?text=Show"}
                alt={show.title}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <CardContent className="p-4 text-yellow-900">
                <h3 className="text-xl font-semibold mb-1">{show.title}</h3>
                <p className="text-sm mb-2 line-clamp-3">{show.description}</p>
                <p className="text-sm font-medium mb-1">
                  Date: {show.startingTime ? new Date(show.startingTime).toLocaleString() : "N/A"}
                </p>
                <p className="text-sm mb-2">
                  Seats:{" "}
                  {resList.map((r: any) => (
                    <Badge key={r.id} variant="outline" className="mr-1">
                      {r.seat?.seatNo || r.seatId}
                    </Badge>
                  ))}
                </p>
                <p className="text-sm font-medium mb-2">
                  Status:{" "}
                  <Badge
                    variant={anyConfirmed ? "default" : "destructive"}
                    className="px-2 py-1"
                  >
                    {anyConfirmed ? "CONFIRMED" : "CANCELLED"}
                  </Badge>
                </p>
                <div className="flex gap-2 flex-wrap">
                  <Link to={`/shows/${show.id}`} className="flex-1">
                    <Button
                      size="sm"
                      className="w-full cursor-pointer bg-yellow-900 hover:bg-yellow-800 text-yellow-50"
                    >
                      View Show
                    </Button>
                  </Link>
                  {anyConfirmed && (
                    <Button
                      size="sm"
                      variant="destructive"
                      className="flex-1 cursor-pointer"
                      onClick={() => openCancelModal(resList)}
                    >
                      Cancel Reservation
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* --- Cancel Confirmation Modal --- */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-yellow-50 rounded-2xl shadow-2xl p-6 max-w-md w-full text-yellow-900 border-2 border-yellow-900"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <h3 className="text-xl font-bold mb-4 text-center">Cancel Reservation</h3>
              <p className="mb-6 text-center">
                Are you sure you want to cancel all confirmed reservations for this show?
              </p>
              <div className="flex justify-center gap-4">
                <Button
                  className="bg-yellow-900 cursor-pointer hover:bg-yellow-800 text-yellow-50"
                  onClick={confirmCancel}
                >
                  Yes, Cancel
                </Button>
                <Button
                  variant="outline"
                  className="border-yellow-900 cursor-pointer text-yellow-900 hover:bg-yellow-100"
                  onClick={() => setModalOpen(false)}
                >
                  No, Keep
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
