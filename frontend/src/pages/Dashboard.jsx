import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import bgImage from '../photos/homewall.jpg';
import logoImage from '../photos/logo.png'; // <-- Import your logo here
import PageLayout from '../components/PageLayout';
import { useAuth } from './AuthContext';
import API from '../utils/api';

const Dashboard = () => {
  const [attendance, setAttendance] = useState([]);
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [bmi, setBmi] = useState(null);
  const [scrollY, setScrollY] = useState(0); // track scroll for fade effect

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Redirect if not logged in
  useEffect(() => {
    if (!user) navigate('/');
  }, [user]);

  // Fetch attendance on load
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const res = await API.get('/attendance');
        const normalized = (res.data.dates || res.data.attendance || []).map(dateStr =>
          new Date(dateStr).toDateString()
        );
        setAttendance(normalized);
      } catch (err) {
        console.error('Failed to fetch attendance:', err);
      }
    };

    fetchAttendance();
  }, []);

  // Mark today's attendance
  const markAttendance = async () => {
    try {
      const res = await API.post('/attendance');
      const updated = (res.data.attendance || []).map(dateStr =>
        new Date(dateStr).toDateString()
      );
      setAttendance(updated);
    } catch (err) {
      console.error('Error marking attendance:', err);
    }
  };

  const calculateBMI = () => {
    if (!weight || !height) return;
    const h = parseFloat(height) / 100;
    const w = parseFloat(weight);
    const bmiVal = (w / (h * h)).toFixed(1);
    setBmi(bmiVal);
  };

  const getStreakInfo = () => {
    const dates = [...attendance].map(d => new Date(d)).sort((a, b) => a - b);
    let maxStreak = 0;
    let currentStreak = 0;

    const today = new Date();
    let dateCursor = new Date(today);

    while (attendance.includes(dateCursor.toDateString())) {
      currentStreak++;
      dateCursor.setDate(dateCursor.getDate() - 1);
    }

    for (let i = 0; i < dates.length; i++) {
      let streak = 1;
      let prev = dates[i];

      for (let j = i + 1; j < dates.length; j++) {
        const next = dates[j];
        const diff = (next - prev) / (1000 * 60 * 60 * 24);
        if (diff === 1) {
          streak++;
          prev = next;
        } else break;
      }

      maxStreak = Math.max(maxStreak, streak);
    }

    return { current: currentStreak, max: maxStreak };
  };

  const getMonthlyAttendance = () => {
    const now = new Date();
    return attendance.filter((d) => {
      const dt = new Date(d);
      return dt.getMonth() === now.getMonth() && dt.getFullYear() === now.getFullYear();
    }).length;
  };

  const streak = getStreakInfo();

  // Fade logo when scrolling
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const logoOpacity = Math.max(1 - scrollY / 300, 0);

  return (
    <PageLayout bgImage={bgImage}>
      {/* AAA-Fitness Logo (imported from photos folder) */}
      <img
        src={logoImage}
        alt="AAA-Fitness Logo"
        className="absolute top-4 left-4 w-35 h-35 transition-opacity duration-300"
        style={{ opacity: logoOpacity }}
      />

      {/* Profile Button */}
      <button
        className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300"
        title="Profile"
        onClick={() => navigate('/profile')}
      >
        👤
      </button>

      {/* Dashboard Content */}
      <div className="w-full max-w-3xl p-6 space-y-6 bg-black/40 text-white rounded-2xl backdrop-blur-md">
        <h1 className="text-3xl font-bold text-center">🏠 Dashboard</h1>

        {/* Attendance Section */}
        <div className="bg-white/10 p-4 rounded-2xl space-y-2">
          <h2 className="text-xl font-semibold">📅 Attendance</h2>
          <button
            onClick={markAttendance}
            disabled={attendance.includes(new Date().toDateString())}
            className={`px-4 py-2 rounded font-bold ${
              attendance.includes(new Date().toDateString())
                ? 'bg-gray-500 cursor-not-allowed'
                : 'bg-blue-500'
            }`}
          >
            Mark Today
          </button>
        </div>

        {/* Streak Info */}
        <div className="bg-white/10 p-4 rounded-2xl space-y-2">
          <p>✅ Current Streak: <span className="text-green-300 font-semibold">{streak.current} days</span></p>
          <p>🔥 Max Streak: <span className="text-yellow-400 font-semibold">{streak.max} days</span></p>
        </div>

        {/* Monthly Attendance */}
        <div className="bg-white/10 p-4 rounded-2xl space-y-2">
          <p>📆 Total Days This Month: <span className="text-purple-300 font-semibold">{getMonthlyAttendance()}</span></p>
        </div>

        {/* Last Attended */}
        <div className="bg-white/10 p-4 rounded-2xl space-y-2">
          <p>🕒 Last Attended: {
            attendance.length > 0
              ? new Date([...attendance].sort((a, b) => new Date(b) - new Date(a))[0]).toLocaleString()
              : 'N/A'
          }</p>
        </div>

        {/* BMI Calculator */}
        <div className="bg-white/10 p-4 rounded-2xl space-y-3">
          <h2 className="text-xl font-semibold">⚖️ BMI Calculator</h2>
          <div className="flex gap-3">
            <input
              type="number"
              placeholder="Weight (kg)"
              className="bg-black/30 px-3 py-1 rounded text-white w-full"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
            <input
              type="number"
              placeholder="Height (cm)"
              className="bg-black/30 px-3 py-1 rounded text-white w-full"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
            />
          </div>
          <button
            onClick={calculateBMI}
            className="bg-green-500 px-4 py-1 rounded font-bold"
          >
            Calculate
          </button>
          {bmi && <p>🔢 Your BMI: <span className="font-bold text-blue-400">{bmi}</span></p>}
        </div>

        {/* Membership Plan */}
        <div className="bg-white/10 p-4 rounded-2xl">
          <h2 className="text-xl font-semibold">💳 Membership Plan</h2>
          <p>Plan: <span className="text-green-400">3 Month Premium</span></p>
          <p>Expires On: <span className="text-red-400">Sep 10, 2025</span></p>
        </div>

        {/* Admin Panel Link */}
        {user?.role === 'admin' && (
          <button
            onClick={() => navigate('/admin')}
            className="text-sm text-blue-400 underline mt-2"
          >
            Go to Admin Panel
          </button>
        )}

        {/* Logout */}
        <div className="bg-white/10 p-4 rounded-2xl text-center">
          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="bg-red-600 px-4 py-2 rounded font-bold text-white"
          >
            Logout
          </button>
        </div>
      </div>
    </PageLayout>
  );
};

export default Dashboard;
