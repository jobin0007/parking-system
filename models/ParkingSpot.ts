import mongoose, { Document, Schema } from 'mongoose';

interface IParkingSpot extends Document {
  location: string;
  vehicleType: 'car' | 'bike';
  isAvailable: boolean;
  rate: {
    firstHour: number;
    additionalHour: number;
  };
}

const parkingSpotSchema: Schema = new Schema<IParkingSpot>(
  {
    location: {
      type: String,
      required: true,
    },
    vehicleType: {
      type: String,
      enum: ['car', 'bike'],
      required: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    rate: {
      firstHour: { type: Number },
      additionalHour: { type: Number },
    },
  },
  { timestamps: true }
);

const ParkingSpot = mongoose.model<IParkingSpot>('ParkingSpot', parkingSpotSchema);

export default ParkingSpot;
