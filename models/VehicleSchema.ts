import mongoose, { Document, Schema } from 'mongoose';

interface IVehicle extends Document {
  vehicleNumber: string;
  vehicleType: 'car' | 'bike';
  userId: mongoose.Types.ObjectId;
  parkedSpot: mongoose.Types.ObjectId;
  parkedAt: Date;
}

const vehicleSchema: Schema = new Schema<IVehicle>(
  {
    vehicleNumber: {
      type: String,
      required: true,
      unique: true,
    },
    vehicleType: {
      type: String,
      enum: ['car', 'bike'],
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    parkedSpot: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ParkingSpot',
      required: true,
    },
    parkedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Vehicle = mongoose.model<IVehicle>('Vehicle', vehicleSchema);

export default Vehicle;
