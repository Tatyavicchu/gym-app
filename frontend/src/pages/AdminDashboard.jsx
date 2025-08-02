import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import API from '../utils/api';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }

    fetchUsers();
  }, [user]);

  const fetchUsers = async () => {
    try {
      const res = await API.get('/admin/all-users', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setUsers(res.data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this member?')) return;

    try {
      await API.delete(`/admin/delete-member/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setUsers(users.filter(u => u._id !== id));
    } catch (err) {
      console.error('Failed to delete user:', err);
      alert('Failed to delete user');
    }
  };

  const handleEdit = (userId) => {
    navigate(`/admin/edit/${userId}`);
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">👑 Admin Dashboard</h1>
        <button onClick={() => { logout(); navigate('/'); }} className="bg-red-500 px-4 py-2 rounded">Logout</button>
      </div>

      <h2 className="text-xl font-semibold mb-2">👥 All Members</h2>
      <div className="overflow-auto">
        <table className="w-full bg-white/10 rounded text-sm">
          <thead className="bg-white/20">
            <tr>
              <th className="p-2">Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Plan</th>
              <th>Plan Start</th>
              <th>Plan End</th>
              <th>Join Date</th>
              <th>Attendance</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id} className="text-center border-t border-white/10">
                <td className="p-2">{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>{u.plan?.name || 'N/A'}</td>
                <td>{u.plan?.start ? new Date(u.plan.start).toDateString() : 'N/A'}</td>
                <td>{u.plan?.end ? new Date(u.plan.end).toDateString() : 'N/A'}</td>
                <td>{u.joinDate ? new Date(u.joinDate).toDateString() : 'N/A'}</td>
                <td>{u.attendance?.length || 0}</td>
                <td className="space-x-2">
                  <button
                    onClick={() => handleEdit(u._id)}
                    className="bg-yellow-500 text-black px-2 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(u._id)}
                    className="bg-red-600 px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
  onClick={() => navigate('/admin/complaints')}
  className="bg-yellow-500 px-4 py-2 rounded text-black font-bold"
>
  📝 View Complaints
</button>
    </div>
  );
};

export default AdminDashboard;
