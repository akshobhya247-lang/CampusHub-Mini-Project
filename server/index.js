import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import jwt from 'jsonwebtoken';
import tasksRouter from './routes/tasks.js';
import authRouter from './routes/auth.js';

const app = express();
const port = Number(process.env.PORT || 3000);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const allowedOrigins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map(value => value.trim())
  .filter(Boolean);

app.disable('x-powered-by');
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    return callback(new Error('Origin is not allowed by CORS.'));
  },
}));
app.use(express.json({ limit: '100kb' }));

app.get('/api/health', (_req, res) => {
  res.status(200).json({
    ok: true,
    app: 'CampusHub API',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

function requireDatabase(_req, res, next) {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ error: 'Database unavailable. Check MONGODB_URI and MongoDB Atlas network access.' });
  }
  next();
}

app.use('/api/auth', requireDatabase, authRouter);
app.use('/api/tasks', requireDatabase);
app.use('/api/tasks', (req, res, next) => {
  const authorization = req.headers.authorization || '';
  const jwtSecret = process.env.JWT_SECRET;
  if (!authorization.startsWith('Bearer ') || !jwtSecret) {
    return res.status(401).json({ error: 'Please log in to manage tasks.' });
  }
  try {
    const payload = jwt.verify(authorization.slice(7), jwtSecret);
    if (!payload.sub) return res.status(401).json({ error: 'Invalid session token.' });
    req.userId = payload.sub;
    next();
  } catch {
    return res.status(401).json({ error: 'Your session has expired. Please log in again.' });
  }
});
app.use('/api/tasks', tasksRouter);

if (process.env.NODE_ENV === 'production') {
  const dist = path.join(root, 'client', 'dist');
  app.use(express.static(dist));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/')) return next();
    res.sendFile(path.join(dist, 'index.html'), err => { if (err) next(err); });
  });
}

app.use((_req, res) => res.status(404).json({ error: 'Route not found.' }));
app.use((err, _req, res, next) => {
  console.error('Request error:', err.message || err);
  if (res.headersSent) return next(err);
  const status = err.status || (err.message === 'Origin is not allowed by CORS.' ? 403 : 500);
  res.status(status).json({
    error: err.name === 'SyntaxError' ? 'Invalid JSON body.' : (err.message || 'Internal server error.'),
  });
});

async function start() {
  const mongoUri = process.env.MONGODB_URI?.trim();
  if (!mongoUri) {
    console.error('ERROR: MONGODB_URI is missing. Create a root .env file using .env.example.');
    process.exitCode = 1;
    return;
  }
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32 || process.env.JWT_SECRET.includes('replace_with')) {
    console.warn('WARNING: Set JWT_SECRET to a private random string of at least 32 characters before deployment.');
  }
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 10000 });
    console.log('MongoDB connected successfully.');
    console.log(`Database: ${mongoose.connection.name}`);
    app.listen(port, '0.0.0.0', () => console.log(`CampusHub API listening on port ${port}`));
  } catch (err) {
    console.error('MongoDB connection failed.');
    console.error('Error name:', err.name);
    console.error('Error message:', err.message);
    process.exitCode = 1;
  }
}

if (process.env.NODE_ENV !== 'test') start();

export default app;
