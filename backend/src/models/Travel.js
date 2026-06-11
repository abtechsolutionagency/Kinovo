import mongoose from 'mongoose';

const travelSchema = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    destinationId: { type: String, required: true, trim: true, lowercase: true },
    destinationName: { type: String, default: '', trim: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    image: { type: String, default: '' },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    status: {
      type: String,
      enum: ['planned', 'ongoing', 'completed', 'cancelled'],
      default: 'planned',
    },
    travelStyle: { type: String, default: '' },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

travelSchema.index({ createdBy: 1, startDate: -1 });
travelSchema.index({ destinationId: 1, startDate: -1 });
travelSchema.index({ published: 1, startDate: 1 });

travelSchema.methods.toJSON = function () {
  const creator = this.createdBy?.toDiscoverJSON?.() || null;
  const createdById = this.createdBy?._id?.toString() || this.createdBy?.toString();

  return {
    id: this._id.toString(),
    destinationId: this.destinationId,
    destinationName: this.destinationName,
    title: this.title,
    description: this.description,
    image: this.image,
    startDate: this.startDate?.toISOString?.()?.split('T')[0] || null,
    endDate: this.endDate?.toISOString?.()?.split('T')[0] || null,
    status: this.status,
    travelStyle: this.travelStyle,
    published: this.published,
    createdBy: creator || createdById,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

export const Travel = mongoose.models.Travel || mongoose.model('Travel', travelSchema);
