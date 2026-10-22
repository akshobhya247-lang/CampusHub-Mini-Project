# Git, Jenkins and Tomcat practical

## Git workflow
```bash
git init
git add .
git commit -m "Initial CampusHub project"
git branch -M main
git remote add origin https://github.com/USERNAME/REPOSITORY.git
git push -u origin main
```
Create a feature branch for changes (`git switch -c feature/calendar-fix`), commit focused work, then merge via a pull request. Confirm `.env` and `node_modules/` are ignored.

## Jenkins declarative pipeline (Node project)
Use `syllabus-practicals/devops/Jenkinsfile.example` as a starting point. Configure a Jenkins agent with compatible Node/npm and Git tools. The example uses Linux `sh` steps; on Windows agents replace them with `bat`. For reproducible CI, generate and commit `package-lock.json`, then change the install stage to `npm ci`.

## Apache Tomcat v8+
Tomcat hosts Java Servlet/JSP web applications packaged as WAR files. CampusHub is a Node.js/Express app and cannot be deployed directly as a WAR to Tomcat. For the syllabus Tomcat practical, create/run the supplied Java Servlet/JSP sample from the lab manual or a separate Maven web project: install a JDK, install Tomcat 8+, build a WAR, copy it to Tomcat's `webapps/`, start Tomcat, and visit `http://localhost:8080/<war-name>/`. Do not claim CampusHub is running on Tomcat.
