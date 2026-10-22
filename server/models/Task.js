import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  title: { type: String, required: true, trim: true, maxlength: 120 },
  course: { type: String, default: 'General', trim: true, maxlength: 80 },
  description: { type: String, default: '', trim: true, maxlength: 500 },
  dueDate: { type: String, default: '' },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  completed: { type: Boolean, default: false },
  legacyId: { type: String, default: undefined, unique: true, sparse: true }
}, { timestamps: true, versionKey: false });

taskSchema.index({ completed:  1, dueDate: 1 });
taskSchema.index({ course: 1 });
export default mongoose.model('Task', taskSchema);
