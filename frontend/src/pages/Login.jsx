import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';
import { useAuth } from './AuthContext';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'member' });
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post('/auth/register', form);

      // Save token + user in context and localStorage
      localStorage.setItem('token', data.token);
      login(data.user);

      // Redirect based on role
      navigate(data.user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      console.error('Registration failed:', err);
      alert(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center px-4">
      <h1 className="text-2xl font-bold mb-6">Register</h1>
      <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-sm">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Name"
          required
          className="w-full p-2 bg-white/10 rounded text-white"
        />
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          required
          className="w-full p-2 bg-white/10 rounded text-white"
        />
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          required
          className="w-full p-2 bg-white/10 rounded text-white"
        />
        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="w-full p-2 bg-white/10 rounded text-white"
        >
          <option value="member">Member</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit" className="w-full p-2 bg-blue-500 rounded font-bold">
          Register
        </button>
      </form>
      <p className="mt-4 text-sm">
        Already have an account?{' '}
        <span onClick={() => navigate('/login')} className="text-blue-400 cursor-pointer">
          Login
        </span>
      </p>
    </div>
  );
};

export default Register;
