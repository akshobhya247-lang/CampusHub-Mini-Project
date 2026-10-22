import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
const router = Router();
const secret = () => { if (!process.env.JWT_SECRET) throw Object.assign(new Error('JWT_SECRET is missing from environment configuration.'), { status: 500 }); return process.env.JWT_SECRET; };
router.post('/register', async (req, res, next) => {
  try {
    const name = typeof req.body.name === 'string' ? req.body.name.trim() : '';
    const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    const password = typeof req.body.password === 'string' ? req.body.password : '';
    if (name.length < 2 || name.length > 80 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length < 8 || password.length > 128) return res.status(400).json({ error: 'Provide a name, valid email, and password of 8–128 characters.' });
    if (await User.exists({ email })) return res.status(409).json({ error: 'An account with this email already exists.' });
    const user = await User.create({ name, email, passwordHash: await bcrypt.hash(password, 12) });
    const token = jwt.sign({ sub: String(user._id), email: user.email }, secret(), { expiresIn: '2h' });
    res.status(201).json({ user: { id: String(user._id), name: user.name, email: user.email }, token });
  } catch (e) { if (e.code === 11000) return res.status(409).json({ error: 'An account with this email already exists.' }); next(e); }
});
router.post('/login', async (req, res, next) => {
  try {
    const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    const password = typeof req.body.password === 'string' ? req.body.password : '';
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) return res.status(401).json({ error: 'Invalid email or password.' });
    const token = jwt.sign({ sub: String(user._id), email: user.email }, secret(), { expiresIn: '2h' });
    res.json({ user: { id: String(user._id), name: user.name, email: user.email }, token });
  } catch (e) { next(e); }
});
router.get('/me', async (req, res) => {
  const header = req.headers.authorization || '';
  if (!header.startsWith('Bearer ')) return res.status(401).json({ error: 'Provide a Bearer token.' });
  try {
    const payload = jwt.verify(header.slice(7), secret());
    const user = await User.findById(payload.sub).select('name email');
    if (!user) return res.status(401).json({ error: 'Account not found.' });
    res.json({ user: { id: String(user._id), name: user.name, email: user.email } });
  } catch { res.status(401).json({ error: 'Invalid or expired token.' }); }
});
export default router;
