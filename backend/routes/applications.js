import express from 'express';
import Application from '../models/Application.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.use(requireAuth);

router.get('/', async (req, res) => {
  const applications = await Application.find({ student: req.student._id }).sort({ createdAt: -1 });

  return res.status(200).json({
    applications: applications.map((application) => ({
      id: application._id.toString(),
      studentName: application.studentName,
      email: application.email,
      jobTitle: application.jobTitle,
      companyName: application.companyName,
      applicationDate: application.applicationDate,
      status: application.status,
      createdAt: application.createdAt,
    })),
  });
});

router.post('/', async (req, res) => {
  const { jobTitle, companyName, applicationDate, status, studentName, email } = req.body ?? {};

  if (!jobTitle || !companyName || !applicationDate || !status) {
    return res.status(400).json({ message: 'Job title, company, date, and status are required.' });
  }

  const application = await Application.create({
    student: req.student._id,
    studentName: (studentName || req.student.name || '').trim() || req.student.name,
    email: (email || req.student.email || '').trim().toLowerCase() || req.student.email,
    jobTitle: jobTitle.trim(),
    companyName: companyName.trim(),
    applicationDate,
    status,
  });

  return res.status(201).json({
    message: 'Application saved successfully.',
    application: {
      id: application._id.toString(),
      studentName: application.studentName,
      email: application.email,
      jobTitle: application.jobTitle,
      companyName: application.companyName,
      applicationDate: application.applicationDate,
      status: application.status,
      createdAt: application.createdAt,
    },
  });
});

router.delete('/:id', async (req, res) => {
  const application = await Application.findById(req.params.id);

  if (!application) {
    return res.status(404).json({ message: 'Application not found.' });
  }

  if (!application.student.equals(req.student._id)) {
    return res.status(403).json({ message: 'You can only delete your own applications.' });
  }

  await application.deleteOne();

  return res.status(200).json({ message: 'Application deleted successfully.' });
});

export default router;
