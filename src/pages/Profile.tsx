import React from 'react';
import { useAppSelector } from '../hooks/reduxHooks';

export default function Profile() {
  const user = useAppSelector((s) => s.auth.user);
  if (!user) return <div>Not logged in</div>;
  return (
    <div>
      <h2 className="text-xl font-bold">Profile</h2>
      <p>{user.name}</p>
      <p>{user.email}</p>
      <p>Role: {user.role}</p>
    </div>
  );
}