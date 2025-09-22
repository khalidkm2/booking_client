import React, { useState } from "react";
import { useAppDispatch } from "../hooks/reduxHooks";
import { signIn } from "../features/authSlice";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export default function Login() {
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    const res: any = await dispatch(signIn({ email, password }));
    if (res.meta.requestStatus === "fulfilled") {
      nav("/");
    } else {
      alert("Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-yellow-50 to-yellow-100 font-serif px-4">
      <Card className="w-full max-w-md shadow-xl border-2 border-yellow-900/30 bg-yellow-50">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-yellow-900 tracking-wide">
            🎟️ MoviePass Login
          </CardTitle>
          <CardDescription className="text-yellow-800 font-medium mt-2">
            Enter your credentials to access the showtimes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handle} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-yellow-900 mb-1">
                Email
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john.doe@example.com"
                className="border-yellow-800 focus-visible:ring-yellow-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-yellow-900 mb-1">
                Password
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="border-yellow-800 focus-visible:ring-yellow-700"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-yellow-900 hover:bg-yellow-800 text-yellow-50 font-semibold tracking-wide shadow-md"
            >
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
