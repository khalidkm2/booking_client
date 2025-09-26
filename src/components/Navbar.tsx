import React from "react";
import { logout } from "@/features/authSlice";
import { Link, useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserCircle } from "lucide-react";

export default function Navbar() {
  const user = useAppSelector((s) => s.auth.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <nav className="w-full bg-yellow-50 border-b-2 border-yellow-900/20 shadow-md sticky top-0 z-50 font-serif">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Main Links */}
          <div className="flex items-center space-x-6">
            <Link
              to={"/"}
              className="text-2xl cursor-pointer font-extrabold text-yellow-900 hover:text-yellow-800 transition tracking-wide"
            >
              🎬 MoviePass
            </Link>
            {/* {user?.role !== "ADMIN" && ( */}
              <Link
                to="/shows"
                className="text-yellow-900 cursor-pointer hover:text-yellow-700 transition font-medium"
              >
                Shows
              </Link>
            {/* )} */}
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex cursor-pointer items-center gap-2 border-yellow-900 text-yellow-900 hover:bg-yellow-100"
                  >
                    <UserCircle className="w-5 h-5" />
                    {user.name}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48 bg-yellow-50 border-yellow-900/20">
                  <DropdownMenuLabel className="text-yellow-900 font-bold">
                    My Account
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-yellow-900/20" />

                  {/* Profile link for non-admin */}
                  {user.role !== "ADMIN" && (
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="w-full cursor-pointer text-yellow-900">
                        Profile
                      </Link>
                    </DropdownMenuItem>
                  )}

                  {/* Admin dashboard link for admins */}
                  {user.role === "ADMIN" && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin/create-show" className="w-full cursor-pointer text-yellow-900 font-semibold">
                        Add Show
                      </Link>
                    </DropdownMenuItem>
                  )}
                  {user.role === "ADMIN" && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin/dashboard" className="w-full cursor-pointer text-yellow-900 font-semibold">
                        Admin Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuSeparator className="bg-yellow-900/20" />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer font-medium">
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-yellow-900 hover:text-yellow-700 cursor-pointer transition font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-yellow-900 hover:text-yellow-700 cursor-pointer transition font-medium"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
