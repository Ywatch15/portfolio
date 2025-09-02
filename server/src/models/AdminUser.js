import mongoose from 'mongoose'

const AdminUserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true, lowercase: true },
    passwordHash: { type: String, required: true },
    role: { type: String, default: 'admin' },
  },
  { timestamps: true }
)

export default mongoose.models.AdminUser || mongoose.model('AdminUser', AdminUserSchema)
