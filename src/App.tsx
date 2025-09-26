import  { useEffect } from 'react';
import Navbar from './components/Navbar';
import AppRoutes from './routes/AppRoutes';
import { useAppDispatch } from './hooks/reduxHooks';
import { loadUserFromToken } from './features/authSlice';
import { AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router';

export default function App() {
  const dispatch = useAppDispatch();
  const location = useLocation();

  useEffect(() => {
    dispatch(loadUserFromToken());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Navbar />
      <AnimatePresence mode="wait">
        <AppRoutes key={location.pathname} />
      </AnimatePresence>
    </div>
  );
}
