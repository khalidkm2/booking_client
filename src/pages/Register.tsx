// src/pages/Register.tsx
import React, { useState } from "react"
import { useAppDispatch } from "../hooks/reduxHooks"
import { signUp } from "../features/authSlice"
import { useNavigate } from "react-router"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { motion } from "framer-motion"

export default function Register() {
  const dispatch = useAppDispatch()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [loading, setLoading] = useState(false)
  const nav = useNavigate()

  const handle = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)
    setLoading(true)

    const res: any = await dispatch(signUp({ name, email, password }))
    setLoading(false)

    if (res.meta.requestStatus === "fulfilled") {
      setMessage({ type: "success", text: "🎉 Registered successfully!" })
      setTimeout(() => nav("/login"), 1500)
    } else {
      setMessage({
        type: "error",
        text: "⚠️ Registration failed. Please check your details and try again.",
      })
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-yellow-50 to-yellow-100 font-serif px-4">
      <Card className="w-full max-w-md shadow-xl border-2 border-yellow-900/30 bg-yellow-50">
        {/* Header */}
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-yellow-900 tracking-wide">
            🎬 Create Account
          </CardTitle>
          <CardDescription className="text-yellow-800 font-medium mt-2">
            Join us to book your favorite movie seats
          </CardDescription>
        </CardHeader>

        {/* Form */}
        <CardContent>
          <form onSubmit={handle} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-yellow-900 mb-1">
                Full Name
              </label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="border-yellow-800 focus-visible:ring-yellow-700"
                required
              />
            </div>
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
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-yellow-900 mb-1">
                Password
              </label>
              <Input
                type=""
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="border-yellow-800 focus-visible:ring-yellow-700"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full cursor-pointer bg-yellow-900 hover:bg-yellow-800 text-yellow-50 font-semibold tracking-wide shadow-md flex items-center justify-center"
            >
              {loading ? (
                <motion.div
                  className="h-5 w-5 border-2 border-yellow-50 border-t-transparent rounded-full animate-spin"
                  aria-label="loading"
                />
              ) : (
                "Register"
              )}
            </Button>

            {message && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-4 p-3 rounded-xl text-center text-sm font-medium shadow-md border 
                ${
                  message.type === "success"
                    ? "bg-green-100 border-green-700 text-green-900"
                    : "bg-red-100 border-red-700 text-red-900"
                }`}
              >
                {message.text}
              </motion.div>
            )}

            <p className="text-center text-sm text-yellow-800 mt-3">
              Already have an account?{" "}
              <span
                onClick={() => nav("/login")}
                className="text-yellow-900 font-semibold hover:underline cursor-pointer"
              >
                Login here
              </span>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
