// MongoDB modelling examples for mongosh. Run against a disposable database.
// ONE-TO-ONE: embed profile in user when it is always read together.
db.users.insertOne({ username: 'demo_student', profile: { displayName: 'Demo Student', semester: 3 } });
// MANY-TO-MANY: a course has many students and a student can join many courses.
// Use a join collection to make the relationship explicit and attach enrollment metadata.
db.enrollments.insertMany([
 { studentUsername: 'demo_student', courseCode: 'WAD', enrolledAt: new Date() },
 { studentUsername: 'demo_student', courseCode: 'DBMS', enrolledAt: new Date() }
]);
print('Student courses:'); printjson(db.enrollments.find({ studentUsername: 'demo_student' }).toArray());
