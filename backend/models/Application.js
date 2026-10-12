import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
      index: true,
    },
    studentName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    jobTitle: {
      type: String,
      required: true,
      trim: true,
    },
    companyName: {
      type: String,
      required: true,
      trim: true,
    },
    applicationDate: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['Applied', 'Interview', 'Selected', 'Rejected'],
      default: 'Applied',
    },
  },
  {
    timestamps: true,
  },
);

const Application = mongoose.model('Application', applicationSchema);

export default Application;
