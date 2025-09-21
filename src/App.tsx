import React from 'react';
import Navbar from './components/Navbar';
import AppRoutes from './routes/AppRoutes';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Navbar />
      <main className="p-4">
        <AppRoutes />
      </main>
    </div>
  );
}