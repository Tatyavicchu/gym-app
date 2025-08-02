import { useLocation } from 'react-router-dom';
import qrCode from '../photos/qr.png'

const PaymentPage = () => {
  const location = useLocation();
  const plan = location.state;

  const upiId = 'yourupi@bank';

  if (!plan) return <div className="text-white p-4">❌ No plan selected</div>;

  return (
    <div className="min-h-screen bg-black text-white p-6 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">🔐 Payment for {plan.name}</h1>

      <p className="mb-2">💸Total Amount: <span className="text-green-400">{plan.price}</span></p>

      <img src={qrCode} alt="UPI QR Code" className="w-64 h-64 mb-4 border-4 border-white rounded" />

      <p className="text-white mb-1">OR Pay to UPI ID:</p>
      <p className="text-green-400 font-semibold text-lg mb-2">{upiId}</p>
      <button
        onClick={() => navigator.clipboard.writeText(upiId)}
        className="bg-white text-black px-3 py-1 rounded"
      >
        📋 Copy UPI ID
      </button>

      <p className="text-yellow-400 text-sm mt-6 text-center max-w-sm">
        ⚠️ Please keep the payment information (screenshot or UTR number) safe for future verification.
      </p>
    </div>
  );
};

export default PaymentPage;
