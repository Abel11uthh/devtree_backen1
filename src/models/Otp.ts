import mongoose, { Schema, Document } from "mongoose";

export interface IOtp extends Document {
  user: mongoose.Types.ObjectId; // Referencia al usuario
  token: string; // Código OTP
  used: boolean; // Indica si el OTP ya fue usado
  createdAt: Date; // Fecha de creación (TTL para expiración automática)
}

const otpSchema = new Schema<IOtp>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Referencia al modelo de usuarios
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
    used: {
      type: Boolean,
      required: true,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 300, // Expiración automática después de 5 minutos (300 segundos)
    },
  },
  { timestamps: true }
);

const Otp = mongoose.model<IOtp>("Otp", otpSchema);
export default Otp;
