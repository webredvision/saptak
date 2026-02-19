import mongoose from 'mongoose';

const RoboSchema = new mongoose.Schema(
  {
    softwareUser: {
      type: Boolean,
      default: true,
    },
    roboUser: {
      type: Boolean,
      default: false,
    },
    arnId: {
      type: String,
    },
    arnNumber: {
      type: String,
    },
    deskType: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const RoboModel =
  mongoose.models.robopermission || mongoose.model('robopermission', RoboSchema);

export default RoboModel;
