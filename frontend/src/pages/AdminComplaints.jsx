import { useEffect, useState } from 'react';
import API from '../utils/api';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminComplaints = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchComplaints = async () => {
    try {
      const res = await API.get('/admin/complaints', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setComplaints(res.data);
    } catch (err) {
      console.error('Failed to fetch complaints:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteComplaint = async (id) => {
    try {
      await API.delete(`/admin/complaints/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setComplaints((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error('Failed to delete complaint:', err);
    }
  };

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchComplaints();
  }, [user]);

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-2xl font-bold mb-4">📩 Complaints Received</h1>

      {loading ? (
        <p>Loading...</p>
      ) : complaints.length === 0 ? (
        <p>No complaints submitted yet.</p>
      ) : (
        <ul className="space-y-4">
          {complaints.map((c) => (
            <li key={c._id} className="bg-white/10 p-4 rounded relative">
              <p className="text-sm text-gray-400 mb-1">📅 {new Date(c.createdAt).toLocaleString()}</p>
              <p className="font-bold">{c.user?.name} ({c.user?.email})</p>
              <p className="mt-2">{c.message}</p>
              <button
                onClick={() => deleteComplaint(c._id)}
                className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 text-sm rounded"
              >
                🗑️ Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminComplaints;
