// import React from 'react';
import { Routes, Route, useLocation } from 'react-router';
import { motion } from 'framer-motion';
import ShowList from '../pages/ShowList';
import ShowDetails from '../pages/ShowDetails';
import AdminCreateShow from '../pages/AdminCreateShow';
import SeatSelection from '../pages/SeatSelection';
import Checkout from '../pages/Checkout';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Profile from '../pages/Profile';
import ProtectedRoute from '../components/ProtectedRoute';
import Admin from '@/pages/Admin';

export default function AppRoutes() {
  const location = useLocation();

  const pageTransition = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
  };

  return (
    <Routes location={location} key={location.pathname}>
      <Route path="/" element={<motion.div {...pageTransition}><ShowList /></motion.div>} />
      <Route path="/shows" element={<motion.div {...pageTransition}><ShowList /></motion.div>} />
      <Route path="/shows/:id" element={<motion.div {...pageTransition}><ShowDetails /></motion.div>} />
      <Route path="/shows/:id/seats" element={<motion.div {...pageTransition}><SeatSelection /></motion.div>} />
      <Route path="/checkout" element={
        <ProtectedRoute>
          <motion.div {...pageTransition}><Checkout /></motion.div>
        </ProtectedRoute>
      } />
      <Route path="/admin/create-show" element={
        <ProtectedRoute adminOnly={true}>
          <motion.div {...pageTransition}><AdminCreateShow /></motion.div>
        </ProtectedRoute>
      } />
      <Route path="/admin/dashboard" element={
        <ProtectedRoute adminOnly={true}>
          <motion.div {...pageTransition}><Admin /></motion.div>
        </ProtectedRoute>
      } />
      <Route path="/login" element={<motion.div {...pageTransition}><Login /></motion.div>} />
      <Route path="/register" element={<motion.div {...pageTransition}><Register /></motion.div>} />
      <Route path="/profile" element={
        <ProtectedRoute>
          <motion.div {...pageTransition}><Profile /></motion.div>
        </ProtectedRoute>
      } />
    </Routes>
  );
}
