import React from 'react';
import { logout } from "@/features/authSlice";
import { Link } from "react-router";
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import { Button } from "@/components/ui/button"; // Shadcn Button

export default function Navbar() {
  const user = useAppSelector((s) => s.auth.user);
  const dispatch = useAppDispatch();

  return (
    <nav className="w-full bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Main Links */}
          <div className="flex items-center space-x-6">
            <Link to="/" className="text-2xl font-extrabold text-indigo-600 hover:text-indigo-500 transition">
              ShowBooking
            </Link>
            <Link
              to="/shows"
              className="text-gray-700 hover:text-indigo-600 transition font-medium"
            >
              Shows
            </Link>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link
                  to="/profile"
                  className="text-gray-700 hover:text-indigo-600 transition font-medium"
                >
                  {user.name}
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => dispatch(logout())}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-indigo-600 transition font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-gray-700 hover:text-indigo-600 transition font-medium"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Admin Link */}
          {user?.role === 'ADMIN' && (
            <div className="ml-6">
              <Link
                to="/admin/create-show"
                className="text-white bg-indigo-600 hover:bg-indigo-500 px-3 py-1 rounded-md text-sm font-semibold transition"
              >
                Admin
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
