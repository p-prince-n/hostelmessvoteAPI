import mongoose from 'mongoose';

const voteSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem', required: true },
  voteDate: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

voteSchema.index({ student: 1, voteDate: 1 }, { unique: true });

export default mongoose.model('Vote', voteSchema);