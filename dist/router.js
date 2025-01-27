"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const handlers_1 = require("./handlers");
const validation_1 = require("./middleware/validation");
const Users_1 = __importDefault(require("./models/Users"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const email_1 = require("./utils/email");
const otp_1 = require("./handlers/otp");
const router = (0, express_1.Router)();
//autenticacion y registro
router.post("/auth/register", (0, express_validator_1.body)("name").notEmpty().withMessage("el nombre no puede ir vacio"), (0, express_validator_1.body)("apellidoMaterno")
    .notEmpty()
    .withMessage("el apellido no puede ir vacio"), (0, express_validator_1.body)("apellidoPaterno")
    .notEmpty()
    .withMessage("el apellido no puede ir vacio"), (0, express_validator_1.body)("telefono")
    .isNumeric()
    .isLength({ min: 10, max: 10 })
    .withMessage("El teléfono debe tener maximo 10 dígitos")
    .notEmpty()
    .withMessage("El teléfono no puede ir vacío"), (0, express_validator_1.body)("email").isEmail().withMessage("email no valido"), (0, express_validator_1.body)("password")
    .isLength({ min: 8 })
    .withMessage("el password es muy corto, minimo 8 caracteres")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
    .withMessage("El password debe incluir al menos una letra mayúscula, una letra minúscula, un número y un carácter especial"), (0, express_validator_1.body)("pregunta").notEmpty().withMessage("no puede ir vacio"), (0, express_validator_1.body)("respuesta").notEmpty().withMessage("no puede ir vacio"), validation_1.handleInputErrors, handlers_1.createAccount);
router.post("/auth/login", (0, express_validator_1.body)("email").isEmail().withMessage("email no valido"), (0, express_validator_1.body)("password").notEmpty().withMessage("el password es obligatorio"), validation_1.handleInputErrors, handlers_1.login);
router.post("/auth/recover-password", (0, express_validator_1.body)("email").isEmail().withMessage("Email no válido"), (0, express_validator_1.body)("respuesta")
    .notEmpty()
    .withMessage("La respuesta a la pregunta secreta no puede ir vacía"), validation_1.handleInputErrors, async (req, res) => {
    const { email, respuesta } = req.body;
    try {
        const user = await Users_1.default.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        if (user.respuesta !== respuesta.toLowerCase()) {
            return res.status(400).json({
                message: "La respuesta a la pregunta secreta es incorrecta",
            });
        }
        const secretKey = process.env.JWT_SECRET;
        const resetToken = jsonwebtoken_1.default.sign({ id: user._id }, secretKey);
        res.status(200).json({
            message: "Respuesta correcta. Usa el token para restablecer tu contraseña.",
            token: resetToken,
        });
    }
    catch (error) {
        res.status(500).json({ message: "Error del servidor", error });
    }
});
// Restablecer contraseña
router.post("/auth/reset-password", (0, express_validator_1.body)("email").notEmpty().withMessage("El email es obligatorio"), (0, express_validator_1.body)("newPassword")
    .isLength({ min: 8 })
    .withMessage("El password es muy corto, mínimo 8 caracteres")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
    .withMessage("El password debe incluir al menos una letra mayúscula, una letra minúscula, un número y un carácter especial"), validation_1.handleInputErrors, async (req, res) => {
    const { email, newPassword } = req.body;
    try {
        // Buscar el usuario por ID
        const user = await Users_1.default.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        // Encriptar la nueva contraseña
        const hashedPassword = await bcrypt_1.default.hash(newPassword, 10);
        // Actualizar la contraseña
        user.password = hashedPassword;
        await user.save();
        res
            .status(200)
            .json({ message: "Contraseña restablecida correctamente" });
    }
    catch (error) {
        res.status(500).json({ message: "Error del servidor", error });
    }
});
// Ruta para verificar si el email existe
router.post("/auth/verify-email", (0, express_validator_1.body)("email").isEmail().withMessage("Email no válido"), validation_1.handleInputErrors, async (req, res) => {
    const { email } = req.body;
    try {
        // Buscar al usuario por email
        const user = await Users_1.default.findOne({ email });
        if (!user) {
            return res
                .status(404)
                .json({ message: "Correo no registrado en el sistema." });
        }
        res.status(200).json({ message: "Correo verificado correctamente." });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error del servidor.", error });
    }
});
router.post("/auth/get-question", (0, express_validator_1.body)("email").isEmail().withMessage("Email no válido"), validation_1.handleInputErrors, async (req, res) => {
    const { email } = req.body;
    try {
        const user = await Users_1.default.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        res
            .status(200)
            .json({ pregunta: user.pregunta, respuesta: user.respuesta });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error del servidor" });
    }
});
// Ruta para generar y enviar el OTP
router.post("/auth/generate-otp", (0, express_validator_1.body)("email").isEmail().withMessage("Email no válido"), validation_1.handleInputErrors, async (req, res) => {
    const { email } = req.body;
    try {
        const user = await Users_1.default.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        const token = await (0, otp_1.generateOtp)(user._id.toString()); // Genera el OTP
        // Envía el OTP al correo del usuario
        await (0, email_1.sendEmail)(email, token);
        res.status(200).json({ message: "OTP enviado al correo electrónico" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error del servidor" });
    }
});
// Ruta para verificar el OTP
router.post("/auth/verify-otp", (0, express_validator_1.body)("email").isEmail().withMessage("Email no válido"), (0, express_validator_1.body)("otp")
    .isNumeric()
    .withMessage("El OTP debe ser numérico")
    .isLength({ min: 6, max: 6 })
    .withMessage("El OTP debe tener 6 dígitos"), validation_1.handleInputErrors, async (req, res) => {
    const { email, otp } = req.body;
    try {
        const user = await Users_1.default.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        const isValid = await (0, otp_1.verifyOtp)(user._id.toString(), otp);
        if (!isValid) {
            return res.status(400).json({ message: "OTP inválido o expirado" });
        }
        res.status(200).json({ message: "OTP verificado correctamente" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error del servidor" });
    }
});
exports.default = router;
//# sourceMappingURL=router.js.map