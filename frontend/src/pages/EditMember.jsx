// src/pages/EditMember.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../utils/api';

const EditMember = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [planName, setPlanName] = useState('');
  const [planStart, setPlanStart] = useState('');
  const [planEnd, setPlanEnd] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await API.get(`/admin/user/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setUser(res.data);
        setName(res.data.name);
        setPlanName(res.data.plan?.name || '');
        setPlanStart(res.data.plan?.start?.slice(0, 10) || '');
        setPlanEnd(res.data.plan?.end?.slice(0, 10) || '');
      } catch (err) {
        console.error('Error fetching user:', err);
      }
    };

    fetchUser();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/admin/update-member/${id}`, {
        name,
        planName,
        planStart,
        planEnd,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      });

      alert('Member updated successfully!');
      navigate('/admin/dashboard');
    } catch (err) {
      console.error('Error updating user:', err);
      alert('Update failed!');
    }
  };

  if (!user) return <div className="p-6 text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-2xl font-bold mb-4">✏️ Edit Member</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 rounded bg-white/10"
          required
        />
        <select
          value={planName}
          onChange={(e) => setPlanName(e.target.value)}
          className="w-full p-2 rounded bg-white/10"
          required
        >
          <option value="">Select Plan</option>
          <option value="1 Month">1 Month</option>
          <option value="3 Month">3 Month</option>
          <option value="6 Month">6 Month</option>
          <option value="12 Month">12 Month</option>
        </select>
        <input
          type="date"
          value={planStart}
          onChange={(e) => setPlanStart(e.target.value)}
          className="w-full p-2 rounded bg-white/10"
          required
        />
        <input
          type="date"
          value={planEnd}
          onChange={(e) => setPlanEnd(e.target.value)}
          className="w-full p-2 rounded bg-white/10"
          required
        />
        <button
          type="submit"
          className="bg-green-500 px-4 py-2 rounded font-bold"
        >
          Update Member
        </button>
      </form>
    </div>
  );
};

export default EditMember;
