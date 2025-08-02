import { useState } from 'react';
import QrReader from 'react-qr-reader';
import API from '../utils/api';

const ScanQR = () => {
  const [result, setResult] = useState('');
  const [status, setStatus] = useState('');

  const handleScan = async (data) => {
    if (data && data !== result) {
      setResult(data);
      try {
        const res = await API.post(
          '/attendance/mark',
          { code: data },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        setStatus('✅ Attendance marked successfully');
      } catch (err) {
        setStatus('❌ Failed to mark attendance');
      }
    }
  };

  const handleError = (err) => {
    console.error(err);
    setStatus('❌ Error accessing camera');
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-2xl mb-4">📷 Scan QR to Mark Attendance</h1>
      <QrReader
        delay={300}
        onError={handleError}
        onScan={handleScan}
        style={{ width: '100%' }}
      />
      {status && <p className="mt-4">{status}</p>}
    </div>
  );
};

export default ScanQR;
