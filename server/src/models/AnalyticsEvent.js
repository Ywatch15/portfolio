import mongoose from 'mongoose'

const AnalyticsEventSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['visit', 'pageview', 'cta'], required: true },
    path: { type: String },
    ua: { type: String },
    ipHash: { type: String },
    meta: { type: Object },
  },
  { timestamps: true }
)

export default mongoose.models.AnalyticsEvent || mongoose.model('AnalyticsEvent', AnalyticsEventSchema)
