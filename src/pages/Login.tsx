import React, { useState } from 'react';
import { useAppDispatch } from '../hooks/reduxHooks';
import { signIn } from '../features/authSlice';
import { useNavigate } from 'react-router';

export default function Login() {
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const nav = useNavigate();
  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    const res: any = await dispatch(signIn({ email, password }));
    if (res.meta.requestStatus === 'fulfilled') {
      nav('/');
    } else {
      alert('Login failed');
    }
  };
  return (
    <form onSubmit={handle} className="max-w-md">
      <h2 className="text-xl font-bold">Login</h2>
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="border p-2 w-full mt-2" />
      <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" className="border p-2 w-full mt-2" />
      <button className="mt-4 p-2 bg-blue-600 text-white rounded">Login</button>
    </form>
  );
}