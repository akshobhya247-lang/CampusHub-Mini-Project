import mongoose from 'mongoose';
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 80 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 254 },
  passwordHash: { type: String, required: true }
}, { timestamps: true });
// `unique: true` on the email field creates the index; do not declare it twice.
export default mongoose.models.User || mongoose.model('User', userSchema);
