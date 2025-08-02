import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Membership = () => {
  const navigate = useNavigate(); 

  const [plan, setPlan] = useState({
    name: '3 Month Premium',
    start: '2025-06-01',
    end: '2025-09-01',
  });

  const [remainingDays, setRemainingDays] = useState(0);

  useEffect(() => {
    const today = new Date();
    const end = new Date(plan.end);
    const diff = Math.max(0, Math.ceil((end - today) / (1000 * 60 * 60 * 24)));
    setRemainingDays(diff);
  }, [plan]);

  const availablePlans = [
    { name: '1 Month Basic', price: '₹700', end: '2025-08-10' },
    { name: '3 Month Premium', price: '₹2000', end: '2025-10-10' },
    { name: '6 Month Elite', price: '₹4000', end: '2025-12-10' },
  ];

  const upgradePlan = (newPlan) => {
    // Navigate to payment page with selected plan
    navigate('/payment', { state: newPlan });
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 pb-20">
      <h1 className="text-2xl font-bold mb-4">💳 Membership</h1>

      {/* Current Plan */}
      <div className="bg-white/10 p-4 rounded mb-6">
        <h2 className="text-lg font-semibold">Your Plan</h2>
        <p>Plan: <span className="text-green-400 font-bold">{plan.name}</span></p>
        <p>Valid Till: <span className="text-red-400">{plan.end}</span></p>
        <p>📅 Days Remaining: <span className="text-blue-400 font-semibold">{remainingDays} days</span></p>
      </div>

      {/* Upgrade Options */}
      <h2 className="text-lg font-semibold mb-3">Available Plans</h2>
      <div className="space-y-4">
        {availablePlans.map((p) => (
          <div key={p.name} className="bg-white/10 p-4 rounded flex justify-between items-center">
            <div>
              <p className="font-bold text-white">{p.name}</p>
              <p className="text-gray-400">{p.price}</p>
            </div>
            <button
              onClick={() => upgradePlan(p)}
              className="bg-green-500 px-3 py-1 rounded font-bold text-black"
            >
              Select
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Membership;
