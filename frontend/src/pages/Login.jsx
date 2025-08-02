import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api'; // Use centralized API instance
import { useAuth } from './AuthContext';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // No need for /api prefix; api.js already includes it
      const res = await API.post('/auth/login', {
        email: form.email,
        password: form.password
      });

      if (res.data.token && res.data.user) {
        login(res.data.user);
        localStorage.setItem('token', res.data.token);

        if (res.data.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      } else {
        alert('Invalid login response');
      }
    } catch (err) {
      console.error('Login failed:', err);
      alert('Login failed. Check email or password.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 text-white flex flex-col justify-center items-center px-4">
      <h1 className="text-2xl font-bold mb-6">Login</h1>
      <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-sm bg-white/10 p-6 rounded-xl backdrop-blur">
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full p-2 bg-black/30 rounded text-white"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          className="w-full p-2 bg-black/30 rounded text-white"
        />
        <button type="submit" className="w-full p-2 bg-blue-500 rounded font-bold">
          Login
        </button>
      </form>
      <p className="mt-4 text-sm">
        Don't have an account?{' '}
        <span onClick={() => navigate('/register')} className="text-blue-400 cursor-pointer">
          Register
        </span>
      </p>
    </div>
  );
};

export default Login;
