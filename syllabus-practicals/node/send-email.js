import nodemailer from 'nodemailer';
const required = ['SMTP_HOST','SMTP_PORT','SMTP_USER','SMTP_PASS','MAIL_TO'];
const missing = required.filter(key => !process.env[key]);
if (missing.length) { console.error(`Set these environment variables first: ${missing.join(', ')}`); process.exit(1); }
const transporter = nodemailer.createTransport({ host: process.env.SMTP_HOST, port: Number(process.env.SMTP_PORT), secure: Number(process.env.SMTP_PORT) === 465, auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } });
await transporter.sendMail({ from: process.env.SMTP_USER, to: process.env.MAIL_TO, subject: 'CampusHub email practical', text: 'This is a test email sent by the Node.js Nodemailer practical.' });
console.log('Email sent successfully.');
