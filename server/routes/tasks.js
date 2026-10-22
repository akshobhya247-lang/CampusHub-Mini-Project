import { Router } from 'express';
import mongoose from 'mongoose';
import Task from '../models/Task.js';

const router = Router();
const priorities = ['Low', 'Medium', 'High'];
function validate(payload, partial = false) {
  const errors = {};
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return { body: 'Request body must be a JSON object.' };
  }
  if (!partial || Object.hasOwn(payload, 'title')) {
    if (typeof payload.title !== 'string' || !payload.title.trim() || payload.title.trim().length > 120) errors.title = 'Title is required and must be 120 characters or fewer.';
  }
  if (Object.hasOwn(payload, 'course') && (typeof payload.course !== 'string' || payload.course.trim().length > 80)) errors.course = 'Course must be 80 characters or fewer.';
  if (Object.hasOwn(payload, 'description') && (typeof payload.description !== 'string' || payload.description.length > 500)) errors.description = 'Notes must be 500 characters or fewer.';
  if (Object.hasOwn(payload, 'dueDate') && payload.dueDate !== '') {
    const value = payload.dueDate;
    const match = typeof value === 'string' ? /^(\d{4})-(\d{2})-(\d{2})$/.exec(value) : null;
    const validDate = match && (() => {
      const date = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])));
      return date.getUTCFullYear() === Number(match[1]) && date.getUTCMonth() === Number(match[2]) - 1 && date.getUTCDate() === Number(match[3]);
    })();
    if (!validDate) errors.dueDate = 'Due date must be a valid YYYY-MM-DD date.';
  }
  if (Object.hasOwn(payload, 'priority') && !priorities.includes(payload.priority)) errors.priority = 'Priority must be Low, Medium, or High.';
  if (Object.hasOwn(payload, 'completed') && typeof payload.completed !== 'boolean') errors.completed = 'Completed must be true or false.';
  if (Object.hasOwn(payload, 'description') && typeof payload.description !== 'string') errors.description = 'Notes must be text.';
  return errors;
}
const toPlain = doc => { const obj = doc.toObject ? doc.toObject() : doc; return { ...obj, id: String(obj._id ?? obj.id), _id: undefined, __v: undefined }; };

router.get('/', async (req, res, next) => {
  try {
    const filter = { userId: req.userId };
    if (req.query.status === 'active') filter.completed = false;
    if (req.query.status === 'completed') filter.completed = true;
    const tasks = await Task.find(filter).sort({ dueDate: 1, createdAt: -1 }).lean();
    res.json(tasks.map(t => ({ ...t, id: String(t._id), _id: undefined })));
  } catch (e) { next(e); }
});
router.post('/', async (req, res, next) => {
  try {
    const errors = validate(req.body);
    if (Object.keys(errors).length) return res.status(400).json({ error: 'Validation failed.', details: errors });
    const task = await Task.create({ title: req.body.title.trim(), course: (req.body.course || 'General').trim() || 'General', description: (req.body.description || '').trim(), dueDate: req.body.dueDate || '', priority: req.body.priority || 'Medium', completed: req.body.completed ?? false, userId: req.userId });
    res.status(201).json(toPlain(task));
  } catch (e) { next(e); }
});
router.get('/:id', async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ error: 'Invalid task ID.' });
    const task = await Task.findOne({ _id: req.params.id, userId: req.userId }); if (!task) return res.status(404).json({ error: 'Task not found.' });
    res.json(toPlain(task));
  } catch (e) { next(e); }
});
router.patch('/:id', async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ error: 'Invalid task ID.' });
    const allowed = ['title', 'course', 'description', 'dueDate', 'priority', 'completed'];
    const patch = Object.fromEntries(Object.entries(req.body).filter(([k]) => allowed.includes(k)));
    if (!Object.keys(patch).length) return res.status(400).json({ error: 'Provide at least one supported field to update.' });
    const errors = validate(patch, true); if (Object.keys(errors).length) return res.status(400).json({ error: 'Validation failed.', details: errors });
    if (patch.title) patch.title = patch.title.trim(); if (patch.course !== undefined) patch.course = patch.course.trim() || 'General'; if (patch.description !== undefined) patch.description = patch.description.trim();
    const task = await Task.findOneAndUpdate({ _id: req.params.id, userId: req.userId }, { $set: patch }, { new: true, runValidators: true });
    if (!task) return res.status(404).json({ error: 'Task not found.' }); res.json(toPlain(task));
  } catch (e) { next(e); }
});
router.delete('/:id', async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ error: 'Invalid task ID.' });
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.userId }); if (!task) return res.status(404).json({ error: 'Task not found.' });
    res.json({ deleted: true, task: toPlain(task) });
  } catch (e) { next(e); }
});
export default router;
