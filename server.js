const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Import routes
const adminRoutes = require('./routes/admin');
const complaintRoutes = require('./routes/Complaint');
const attendanceRoutes = require('./routes/attendance');
const authRoutes = require('./routes/auth');

dotenv.config();
connectDB();

const app = express();

// Allowed frontend URLs
const allowedOrigins = [
  'https://gym-app-wine-six.vercel.app',  // Vercel frontend
  'http://localhost:5173'                 // Local dev
];

// CORS configuration
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed for this origin'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// Handle preflight requests
app.options('*', cors());

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/attendance', attendanceRoutes);

// Health check route
app.get('/', (req, res) => {
  res.send('API Running...');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
