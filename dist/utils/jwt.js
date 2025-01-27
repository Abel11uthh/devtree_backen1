"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePasswordResetTokenFromLogin = exports.generateJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateJWT = (payload) => {
    const token = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '180D'
    });
    return token;
};
exports.generateJWT = generateJWT;
const generatePasswordResetTokenFromLogin = (authToken) => {
    try {
        // Verifica el token existente (de inicio de sesión)
        const decoded = jsonwebtoken_1.default.verify(authToken, process.env.JWT_SECRET);
        // Genera un nuevo token para recuperación de contraseña con la misma información
        const resetToken = jsonwebtoken_1.default.sign({ email: decoded.email }, // Usa información básica (como email o ID)
        process.env.JWT_SECRET, { expiresIn: '15m' } // Expiración corta para mayor seguridad
        );
        return resetToken;
    }
    catch (err) {
        throw new Error('Token inválido o expirado');
    }
};
exports.generatePasswordResetTokenFromLogin = generatePasswordResetTokenFromLogin;
//# sourceMappingURL=jwt.js.map