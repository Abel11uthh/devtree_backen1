"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOtp = exports.generateOtp = void 0;
const Otp_1 = __importDefault(require("../models/Otp"));
const crypto_1 = __importDefault(require("crypto"));
const generateOtp = async (userId) => {
    const token = crypto_1.default.randomInt(100000, 999999).toString(); // Genera un OTP de 6 dígitos
    // Guarda el OTP en la base de datos
    await Otp_1.default.create({
        user: userId,
        token,
    });
    return token;
};
exports.generateOtp = generateOtp;
const verifyOtp = async (userId, token) => {
    const otpRecord = await Otp_1.default.findOne({ user: userId, token });
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
exports.verifyOtp = verifyOtp;
//# sourceMappingURL=otp.js.map