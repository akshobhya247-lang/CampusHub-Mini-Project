import 'dotenv/config';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import mongoose from 'mongoose';
import Task from '../server/models/Task.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = path.resolve(process.argv[2] || path.join(root, 'data', 'tasks.json'));
if (!process.env.MONGODB_URI) { console.error('Set MONGODB_URI in .env before migrating.'); process.exit(1); }
try {
  const parsed = JSON.parse(await fs.readFile(source, 'utf8'));
  if (!Array.isArray(parsed)) throw new Error('JSON root must be an array of tasks.');
  await mongoose.connect(process.env.MONGODB_URI);
  let inserted = 0, skipped = 0;
  for (const item of parsed) {
    const legacyId = String(item.id || '');
    if (legacyId && await Task.exists({ legacyId })) { skipped++; continue; }
    const payload = { title: item.title, course: item.course || 'General', description: item.description || '', dueDate: item.dueDate || '', priority: ['Low','Medium','High'].includes(item.priority) ? item.priority : 'Medium', completed: Boolean(item.completed), ...(legacyId ? { legacyId } : {}) };
    if (item.createdAt && !Number.isNaN(Date.parse(item.createdAt))) { payload.createdAt = new Date(item.createdAt); payload.updatedAt = new Date(item.updatedAt || item.createdAt); }
    await Task.create(payload); inserted++;
  }
  console.log(`Migration complete. Inserted ${inserted}; skipped previously migrated ${skipped}; source ${source}`);
} catch (error) { console.error(`Migration failed: ${error.message}`); process.exitCode = 1; }
finally { await mongoose.disconnect(); }
