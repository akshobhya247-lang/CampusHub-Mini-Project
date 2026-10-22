// Run with: mongosh "YOUR_MONGODB_URI" syllabus_demo --file syllabus-practicals/mongodb/crud-aggregation.js
// Demonstrates create/read/update/delete and an aggregation pipeline.
const tasks = db.tasks;
tasks.insertMany([
 { title: 'HTML assignment', course: 'WAD', priority: 'High', completed: false, minutes: 45 },
 { title: 'MongoDB practice', course: 'WAD', priority: 'Medium', completed: true, minutes: 60 },
 { title: 'Graph theory', course: 'Discrete Math', priority: 'Low', completed: false, minutes: 30 }
]);
print('READ:'); printjson(tasks.find({ course: 'WAD' }).toArray());
tasks.updateOne({ title: 'HTML assignment' }, { $set: { completed: true } });
print('AGGREGATION: counts by course and completion:');
printjson(tasks.aggregate([{ $group: { _id: { course: '$course', completed: '$completed' }, count: { $sum: 1 }, totalMinutes: { $sum: '$minutes' } } }, { $sort: { '_id.course': 1 } }]).toArray());
// DELETE demonstration is deliberately scoped to the sample record.
tasks.deleteOne({ title: 'Graph theory' });
