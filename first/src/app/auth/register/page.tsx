'use client';

import { useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';

export default function RegisterPage() {
  const { register } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await register(username, password);
      setSuccess('Registration successful! Now you can login.');
      setUsername('');
      setPassword('');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Error registering user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            className="border p-3 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
          <input
            className="border p-3 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
            placeholder="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button
            className="bg-green-500 text-white p-3 rounded hover:bg-green-600 disabled:bg-gray-400"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        {error && <p className="text-red-500 mt-3 text-center">{error}</p>}
        {success && <p className="text-green-500 mt-3 text-center">{success}</p>}
        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account? <a className="text-blue-500 hover:underline" href="/auth/login">Login</a>
        </p>
      </div>
    </div>
  );
}
