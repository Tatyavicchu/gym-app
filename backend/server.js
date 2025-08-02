const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const adminRoutes = require('./routes/admin');
const complaintRoutes = require('./routes/Complaint');
const attendanceRoutes = require('./routes/attendance');
dotenv.config();
connectDB();

const app = express();

const allowedOrigins = [
  'http://localhost:5173',           // React frontend (local dev)
  'https://your-frontend.vercel.app' // Replace with actual deployed URL
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed for this origin'));
    }
  },
  credentials: true
}));
app.use(express.json());
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', adminRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/attendance', attendanceRoutes);

// Sample Route
app.get('/', (req, res) => {
    res.send('API Running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
