import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { MongoMemoryServer } from 'mongodb-memory-server';
import authRoutes from './routes/auth.js';
import applicationRoutes from './routes/applications.js';

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 5000;
const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

app.use(
  cors({
    origin: function (origin, callback) {
      const allowedOrigins = new Set([
        clientUrl,
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        'http://localhost:5174',
        'http://127.0.0.1:5174',
      ]);

      if (!origin || allowedOrigins.has(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error('CORS policy rejected the origin.'));
    },
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Student Job Tracker API is running.' });
});

app.use('/api/auth', authRoutes);
app.use('/api/applications', applicationRoutes);

app.use((error, req, res, next) => {
  console.error('Unhandled server error:', error);
  res.status(500).json({ message: 'Something went wrong on the server.' });
});

async function startServer() {
  let mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/student-job-tracker';

  if (process.env.USE_MEMORY_DB === 'true') {
    const memoryServer = await MongoMemoryServer.create();
    mongoUri = memoryServer.getUri();
    console.log('Using in-memory MongoDB for local development.');
  }

  try {
    await mongoose.connect(mongoUri);
    console.log(`Connected to MongoDB: ${mongoUri}`);
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
}

startServer();
