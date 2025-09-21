// src/pages/Register.tsx
import React, { useState } from 'react';
import { useAppDispatch } from '../hooks/reduxHooks';
import { signUp } from '../features/authSlice';
import { useNavigate } from 'react-router';

export default function Register() {
  const dispatch = useAppDispatch();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const nav = useNavigate();
  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    const res: any = await dispatch(signUp({ name, email, password }));
    if (res.meta.requestStatus === 'fulfilled') {
      alert('Registered');
      nav('/login');
    } else alert('Error');
  };
  return (
    <form onSubmit={handle} className="max-w-md">
      <h2 className="text-xl font-bold">Register</h2>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="border p-2 w-full mt-2" />
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="border p-2 w-full mt-2" />
      <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" className="border p-2 w-full mt-2" />
      <button className="mt-4 p-2 bg-green-600 text-white rounded">Register</button>
    </form>
  );
}
