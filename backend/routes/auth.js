import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Student from '../models/Student.js';
import { buildToken } from '../middleware/auth.js';

const router = express.Router();

const cookieOptions = {
  httpOnly: true,
  sameSite: 'lax',
  secure: false,
  path: '/',
};

if (process.env.NODE_ENV === 'production') {
  cookieOptions.sameSite = 'none';
  cookieOptions.secure = true;
}

function safeStudent(student) {
  return {
    id: student._id.toString(),
    name: student.name,
    email: student.email,
    createdAt: student.createdAt,
  };
}

router.post('/register', async (req, res) => {
  const { name, email, password, confirmPassword } = req.body ?? {};

  if (!name || !email || !password || !confirmPassword) {
    return res.status(400).json({ message: 'Name, email, password, and confirm password are required.' });
  }

  if (typeof name !== 'string' || !name.trim()) {
    return res.status(400).json({ message: 'Full name is required.' });
  }

  if (typeof email !== 'string' || !email.trim()) {
    return res.status(400).json({ message: 'Email is required.' });
  }

  if (password.length < 8) {
    return res.status(400).json({ message: 'Password must be at least 8 characters long.' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match.' });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const existingStudent = await Student.findOne({ email: normalizedEmail });

  if (existingStudent) {
    return res.status(409).json({ message: 'An account with this email already exists.' });
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const student = await Student.create({
    name: name.trim(),
    email: normalizedEmail,
    passwordHash,
  });

  const token = buildToken(student._id);
  res.cookie('token', token, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });

  return res.status(201).json({
    message: 'Registration successful.',
    student: safeStudent(student),
  });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body ?? {};

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const student = await Student.findOne({ email: normalizedEmail });

  if (!student) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  const isValid = await bcrypt.compare(password, student.passwordHash);

  if (!isValid) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  const token = buildToken(student._id);
  res.cookie('token', token, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });

  return res.status(200).json({
    message: 'Login successful.',
    student: safeStudent(student),
  });
});

router.get('/me', async (req, res) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ message: 'Authentication required.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const student = await Student.findById(decoded.id).select('-passwordHash');

    if (!student) {
      return res.status(401).json({ message: 'Session expired or invalid.' });
    }

    return res.status(200).json({ student: safeStudent(student) });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Your session has expired. Please log in again.' });
    }

    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
});

router.post('/logout', (req, res) => {
  res.clearCookie('token', cookieOptions);
  return res.status(200).json({ message: 'Logout successful.' });
});

export default router;
