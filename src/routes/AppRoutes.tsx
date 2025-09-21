import React from 'react';
import { Routes, Route } from 'react-router';
import ShowList from '../pages/ShowList';
import ShowDetails from '../pages/ShowDetails';
import AdminCreateShow from '../pages/AdminCreateShow';
import SeatSelection from '../pages/SeatSelection';
import Checkout from '../pages/Checkout';
import MyReservations from '../pages/MyReservations';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Profile from '../pages/Profile';
import ProtectedRoute from '../components/ProtectedRoute';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<ShowList />} />
      <Route path="/shows" element={<ShowList />} />
      <Route path="/shows/:id" element={<ShowDetails />} />
      <Route path="/shows/:id/seats" element={<SeatSelection />} />
      <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
      <Route path="/reservations" element={<ProtectedRoute><MyReservations /></ProtectedRoute>} />
      <Route path="/admin/create-show" element={<ProtectedRoute adminOnly={true}><AdminCreateShow /></ProtectedRoute>} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
    </Routes>
  );
}