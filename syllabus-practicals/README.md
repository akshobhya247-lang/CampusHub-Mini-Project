# Full Stack Development syllabus practicals

These standalone examples complement CampusHub; they are teaching/demo scripts and are not all wired into the production UI.

## Node.js practicals
- `node/core-http.js`: core modules, HTTP server, URL parsing, safe HTML response.
- `node/files-events.js`: filesystem read/write and EventEmitter.
- `node/upload-server.js`: multipart upload using Multer, with size/type checks.
- `node/send-email.js`: Nodemailer SMTP example; requires SMTP environment variables.

## MongoDB practicals
- `mongodb/crud-aggregation.js`: CRUD and aggregation examples using the CampusHub `tasks` collection.
- `mongodb/relationships.js`: one-to-one and many-to-many modelling examples.

## DevOps
See `devops/GIT-JENKINS-TOMCAT.md` for Git workflow, a Jenkins pipeline example and Tomcat deployment notes. CampusHub itself is a Node/Express app, not a Java WAR; Tomcat is demonstrated as a separate syllabus practical.

## Security
Never commit `.env`, credentials, SMTP passwords or Atlas connection strings. Do not use real student data in demos. Validate inputs and restrict upload types/sizes.
