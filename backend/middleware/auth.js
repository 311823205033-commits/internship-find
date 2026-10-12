import jwt from 'jsonwebtoken';
import Student from '../models/Student.js';

export function buildToken(studentId) {
  return jwt.sign({ id: studentId }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

export async function requireAuth(req, res, next) {
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

    req.student = student;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Your session has expired. Please log in again.' });
    }

    return res.status(401).json({ message: 'Invalid authentication token.' });
  }
}
