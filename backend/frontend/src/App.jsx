import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Exercise from './pages/Exercise';
import ExerciseList from './pages/ExerciseList';
import Membership from './pages/Membership';
import Complaints from './pages/ComplaintBox';
import AdminComplaints from './pages/AdminComplaints';
import Login from './pages/Login';
import Register from './pages/Register';
import BottomNav from './components/BottomNav';
import { AuthProvider } from './pages/AuthContext';
import AdminDashboard from './pages/AdminDashboard';
import PaymentPage from './pages/paymentPage';
import EditMember from './pages/EditMember';
import ProfilePage from './pages/ProfilePage';

function AppRoutes() {
  const location = useLocation();
  const hideNavbarRoutes = ['/','/login','/register'];

  return (
    <>
      <div className="min-h-screen pb-20">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/exercise" element={<Exercise />} />
          <Route path="/exercise/:category" element={<ExerciseList />} />
          <Route path="/membership" element={<Membership />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/complaints" element={<Complaints />} />
          <Route path="/admincomplaints" element={<AdminComplaints />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/edit/:id" element={<EditMember />} />
          <Route path="/admin/complaints" element={<AdminComplaints />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </div>

      {/* Show BottomNav only if not on hidden routes */}
      {!hideNavbarRoutes.includes(location.pathname) && <BottomNav />}
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
