import React, { useState, useContext } from 'react';
import Button from '../../components/Button';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { UserContext } from '../../App';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('✅ Login successful! Redirecting...');
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        setTimeout(() => navigate('/'), 1200);
      } else {
        setMessage(data.message || '❌ Login failed');
      }
    } catch (err) {
      setMessage('⚠️ Server error');
    }
  };

  return (
    <div className="flex flex-col items-center mt-12 px-4">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Login</h2>

      <form
        className="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm flex flex-col gap-5 border border-gray-200"
        onSubmit={handleSubmit}
      >
        {/* Email Field */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">Email</label>
          <input
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={form.email}
            onChange={handleChange}
          />
        </div>

        {/* Password Field with Show/Hide */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">Password</label>
          <div className="relative">
            <input
              name="password"
              type={showPassword ? 'text' : 'password'}
              required
              placeholder="••••••••"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.password}
              onChange={handleChange}
            />
          </div>
          {/* Forgot Password Link */}
          <div className="text-right mt-2">
            <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">
              Forgot Password?
            </Link>
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
        >
          Login
        </Button>
      </form>

      {/* Message */}
      {message && (
        <div
          className={`mt-4 text-center font-medium ${
            message.includes('✅') ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {message}
        </div>
      )}

      {/* Sign Up Link */}
      <div className="mt-6 text-center">
        <span className="text-gray-600">Don't have an account?</span>
        <Link to="/signup" className="ml-2 text-blue-600 hover:underline font-medium">
          Sign Up
        </Link>
      </div>
    </div>
  );
};

export default Login;
