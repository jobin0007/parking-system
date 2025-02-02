import mongoose, { Schema, Document } from "mongoose";

export interface IBooking extends Document {
  userId: mongoose.Types.ObjectId;
  parkingSpotId: mongoose.Types.ObjectId;
  vehicleNumber: string;
  startTime: Date;
  endTime?: Date;
  totalFee?: number;
}

const bookingSchema = new Schema<IBooking>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  parkingSpotId: { type: Schema.Types.ObjectId, ref: "ParkingSpot", required: true },
  vehicleNumber: { type: String, required: true },
  startTime: { type: Date, default: Date.now },
  endTime: { type: Date },
  totalFee: { type: Number },
});


const Booking = mongoose.model<IBooking>("Booking", bookingSchema);
 export default Booking