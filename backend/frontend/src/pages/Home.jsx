import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from './AuthContext';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-700 via-blue-700 to-indigo-800 text-white">
      <div className="w-full max-w-md p-8 bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl text-center space-y-6">
        <h1 className="text-3xl font-bold">🏋️ Welcome to <br/><span className='text-red-500'>AAA-FITNESS </span>Club</h1>
        <p className="text-gray-200">Track your fitness, attendance, and goals.</p>
        <div className="flex justify-center gap-4">
          <Link to="/login">
            <button className="bg-blue-500 px-4 py-2 rounded font-bold hover:bg-blue-600">Login</button>
          </Link>
          <Link to="/register">
            <button className="bg-green-500 px-4 py-2 rounded font-bold hover:bg-green-600">Register</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
