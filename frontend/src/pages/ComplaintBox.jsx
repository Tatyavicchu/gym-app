import { useState } from 'react';
import API from '../utils/api'; // Ensure this points to axios with baseURL set
import { useAuth } from './AuthContext'; // Ensure this provides user & token

const ComplaintBox = () => {
  const [complaint, setComplaint] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth(); // access current user

  const handleSubmit = async () => {
    if (!complaint.trim()) {
      setError('Please write something first.');
      return;
    }

    try {
      await API.post(
        '/complaints',
        { message: complaint },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setComplaint('');
      setSubmitted(true);
      setError('');
      setTimeout(() => setSubmitted(false), 3000);
    } catch (err) {
      console.error(err);
      setError('Failed to submit complaint. Please try again.');
    }
  };

  if (!user || user.role !== 'member') {
    return (
      <div className="min-h-screen bg-black text-white p-4">
        <h1 className="text-2xl font-bold mb-4">🛑 Unauthorized</h1>
        <p>Only logged-in members can submit complaints.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-4 pb-20">
      <h1 className="text-2xl font-bold mb-4">📝 Complaint Box</h1>
      <textarea
        className="w-full h-40 bg-white/10 text-white p-3 rounded resize-none"
        placeholder="Write your complaint here..."
        value={complaint}
        onChange={(e) => setComplaint(e.target.value)}
      />
      <button
        onClick={handleSubmit}
        className="mt-4 bg-red-500 px-4 py-2 rounded font-bold text-black"
      >
        Submit Complaint
      </button>

      {submitted && <p className="text-green-400 mt-2">✅ Complaint submitted successfully!</p>}
      {error && <p className="text-red-400 mt-2">❌ {error}</p>}
    </div>
  );
};

export default ComplaintBox;
