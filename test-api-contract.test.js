import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
const root = process.cwd();
test('React frontend entry and required views exist', () => {
  for (const file of ['client/src/main.jsx','client/src/App.jsx','client/src/components/Sidebar.jsx','client/src/components/TaskForm.jsx','client/src/components/TaskList.jsx','client/src/components/Calendar.jsx','client/src/services/api.js']) assert.ok(fs.existsSync(path.join(root,file)), `${file} should exist`);
  const app = fs.readFileSync(path.join(root,'client/src/App.jsx'),'utf8');
  for (const view of ['Dashboard','TasksView','Calendar','Courses','Analytics','Settings']) assert.ok(app.includes(view), `${view} view should be present`);
});
test('Express API exposes CRUD routes and Mongoose model', () => {
  const routes = fs.readFileSync(path.join(root,'server/routes/tasks.js'),'utf8');
  for (const route of [/router\.get\('\/'/, /router\.post\('\/'/, /router\.patch\('\/:id'/, /router\.delete\('\/:id'/]) assert.ok(route.test(routes), `missing ${route}`);
  assert.ok(fs.existsSync(path.join(root,'server/models/Task.js')));
  assert.ok(fs.readFileSync(path.join(root,'server/index.js'),'utf8').includes("app.use('/api/tasks', tasksRouter)"));
});
test('Mongo migration is safe to rerun and legacy source is retained', () => {
  const migration = fs.readFileSync(path.join(root,'scripts/migrate-json-to-mongodb.js'),'utf8');
  assert.ok(migration.includes('legacyId'));
  assert.ok(migration.includes('Task.exists'));
  assert.ok(fs.existsSync(path.join(root,'data/tasks.json')));
});

test('MongoDB setup guidance and health check are documented', () => {
  const envExample = fs.readFileSync(path.join(root,'.env.example'),'utf8');
  const readme = fs.readFileSync(path.join(root,'README.md'),'utf8');
  const guide = fs.readFileSync(path.join(root,'docs/MONGODB-CONNECTION-TROUBLESHOOTING.md'),'utf8');
  const server = fs.readFileSync(path.join(root,'server/index.js'),'utf8');
  assert.ok(envExample.includes('MONGODB_URI='));
  assert.ok(readme.includes('URL-encode'));
  assert.ok(guide.includes('%40'));
  assert.ok(server.includes("app.get('/api/health'"));
});
test('syllabus practical examples and authentication API are included', async () => {
  const fs = await import('node:fs');
  for (const file of [
    'server/routes/auth.js',
    'server/models/User.js',
    'syllabus-practicals/node/core-http.js',
    'syllabus-practicals/node/files-events.js',
    'syllabus-practicals/node/upload-server.js',
    'syllabus-practicals/node/send-email.js',
    'syllabus-practicals/mongodb/crud-aggregation.js',
    'syllabus-practicals/mongodb/relationships.js',
    'syllabus-practicals/devops/GIT-JENKINS-TOMCAT.md'
  ]) assert.ok(fs.existsSync(new URL(file, import.meta.url)), `Missing ${file}`);
  const auth = fs.readFileSync(new URL('server/routes/auth.js', import.meta.url), 'utf8');
  assert.match(auth, /bcrypt\.hash/);
  assert.match(auth, /jwt\.sign/);
});
