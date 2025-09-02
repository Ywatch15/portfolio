import mongoose from 'mongoose'

const MetricSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, index: true },
    value: { type: Number, default: 0 },
  },
  { timestamps: true }
)

export default mongoose.models.Metric || mongoose.model('Metric', MetricSchema)
