import { useEffect, useState } from 'react';
import API from '../utils/api';
import { useAuth } from './AuthContext';

const ProfilePage = () => {
  const { user, setUser } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    profilePic: '',
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        profilePic: user.profilePic || '',
      });
    }
  }, [user]);

  // Handle file input (camera or gallery)
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({
        ...prev,
        profilePic: reader.result, // base64
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const res = await API.put(
        '/auth/profile',
        { ...formData },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setMessage('✅ Profile updated successfully!');
      setUser(res.data.user);
    } catch (err) {
      setMessage('❌ Failed to update profile');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-2xl font-bold mb-6">👤 Your Profile</h1>

      <div className="space-y-4 max-w-md">
        {/* Image upload */}
        <div>
          <label className="block text-sm mb-1">📷 Profile Picture</label>
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleImageUpload}
            className="w-full text-white"
          />
          {formData.profilePic && (
            <img
              src={formData.profilePic}
              alt="Profile"
              className="w-24 h-24 rounded-full mt-2 border-2 border-white"
            />
          )}
        </div>

        {/* Editable fields */}
        <div>
          <label className="block text-sm mb-1">📛 Name</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 rounded bg-white/10 text-white"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">📧 Email</label>
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 rounded bg-white/10 text-white"
          />
        </div>

        <button
          onClick={handleSubmit}
          className="bg-green-500 px-4 py-2 rounded font-bold text-black"
        >
          💾 Save Changes
        </button>

        {message && <p className="mt-3 text-yellow-400">{message}</p>}
      </div>
    </div>
  );
};

export default ProfilePage;
