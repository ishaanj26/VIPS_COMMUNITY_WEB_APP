import { useState } from 'react';
import Button from '../../components/Button';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('✅ Signup successful! Redirecting to login...');
        if (data.user) {
          localStorage.setItem('userId', data.user.id);
        }
        setTimeout(() => navigate('/login'), 1200);
      } else {
        setMessage(data.message || '❌ Signup failed');
      }
    } catch (err) {
      setMessage('⚠️ Server error');
    }
  };

  return (
    <div className="flex flex-col items-center mt-12 px-4">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Sign Up</h2>

      <form
        className="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm flex flex-col gap-5 border border-gray-200"
        onSubmit={handleSubmit}
      >
        {/* Name Field */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">Name</label>
          <input
            name="name"
            type="text"
            required
            placeholder="John Doe"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={form.name}
            onChange={handleChange}
          />
        </div>

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
              type="password"
              required
              placeholder="••••••••"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.password}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
        >
          Sign Up
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

      {/* Login Link */}
      <div className="mt-6 text-center">
        <span className="text-gray-600">Already have an account?</span>
        <Link to="/login" className="ml-2 text-blue-600 hover:underline font-medium">
          Login
        </Link>
      </div>
    </div>
  );
};

export default Signup;
