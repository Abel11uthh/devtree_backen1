import Otp from "../models/Otp";
import crypto from "crypto";

export const generateOtp = async (userId: string): Promise<string> => {
  const token = crypto.randomInt(100000, 999999).toString(); // Genera un OTP de 6 dígitos

  // Guarda el OTP en la base de datos
  await Otp.create({
    user: userId,
    token,
  });

  return token;
};

export const verifyOtp = async (
  userId: string,
  token: string
): Promise<boolean> => {
  const otpRecord = await Otp.findOne({ user: userId, token });

  if (!otpRecord) {
    return false; // OTP no encontrado
  }

  if (otpRecord.used) {
    return false; // OTP ya usado
  }

  // Marca el OTP como usado
  otpRecord.used = true;
  await otpRecord.save();

  return true; // OTP válido
};
