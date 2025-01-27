import { Router } from "express";
import { body } from "express-validator";
import { createAccount, login } from "./handlers";
import { handleInputErrors } from "./middleware/validation";
import User from "./models/Users";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import { sendEmail } from "./utils/email";
import { generateOtp, verifyOtp } from "./handlers/otp";

const router = Router();

//autenticacion y registro
router.post(
  "/auth/register",
  body("name").notEmpty().withMessage("el nombre no puede ir vacio"),
  body("apellidoMaterno")
    .notEmpty()
    .withMessage("el apellido no puede ir vacio"),
  body("apellidoPaterno")
    .notEmpty()
    .withMessage("el apellido no puede ir vacio"),
  body("telefono")
    .isNumeric()
    .isLength({ min: 10, max: 10 })
    .withMessage("El teléfono debe tener maximo 10 dígitos")
    .notEmpty()
    .withMessage("El teléfono no puede ir vacío"),
  body("email").isEmail().withMessage("email no valido"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("el password es muy corto, minimo 8 caracteres")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/
    )
    .withMessage(
      "El password debe incluir al menos una letra mayúscula, una letra minúscula, un número y un carácter especial"
    ),
  body("pregunta").notEmpty().withMessage("no puede ir vacio"),
  body("respuesta").notEmpty().withMessage("no puede ir vacio"),

  handleInputErrors,
  createAccount
);

router.post(
  "/auth/login",
  body("email").isEmail().withMessage("email no valido"),
  body("password").notEmpty().withMessage("el password es obligatorio"),
  handleInputErrors,
  login
);
router.post(
  "/auth/recover-password",
  body("email").isEmail().withMessage("Email no válido"),
  body("respuesta")
    .notEmpty()
    .withMessage("La respuesta a la pregunta secreta no puede ir vacía"),
  handleInputErrors,
  async (req, res) => {
    const { email, respuesta } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      if (user.respuesta !== respuesta.toLowerCase()) {
        return res.status(400).json({
          message: "La respuesta a la pregunta secreta es incorrecta",
        });
      }

      const secretKey = process.env.JWT_SECRET as string;
      const resetToken = jwt.sign({ id: user._id }, secretKey);

      res.status(200).json({
        message:
          "Respuesta correcta. Usa el token para restablecer tu contraseña.",
        token: resetToken,
      });
    } catch (error) {
      res.status(500).json({ message: "Error del servidor", error });
    }
  }
);

// Restablecer contraseña
router.post(
  "/auth/reset-password",
  body("email").notEmpty().withMessage("El email es obligatorio"),
  body("newPassword")
    .isLength({ min: 8 })
    .withMessage("El password es muy corto, mínimo 8 caracteres")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/
    )
    .withMessage(
      "El password debe incluir al menos una letra mayúscula, una letra minúscula, un número y un carácter especial"
    ),
  handleInputErrors,
  async (req, res) => {
    const { email, newPassword } = req.body;

    try {
      // Buscar el usuario por ID
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      // Encriptar la nueva contraseña
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Actualizar la contraseña
      user.password = hashedPassword;
      await user.save();

      res
        .status(200)
        .json({ message: "Contraseña restablecida correctamente" });
    } catch (error) {
      res.status(500).json({ message: "Error del servidor", error });
    }
  }
);

// Ruta para verificar si el email existe
router.post(
  "/auth/verify-email",
  body("email").isEmail().withMessage("Email no válido"),
  handleInputErrors,
  async (req, res) => {
    const { email } = req.body;

    try {
      // Buscar al usuario por email
      const user = await User.findOne({ email });

      if (!user) {
        return res
          .status(404)
          .json({ message: "Correo no registrado en el sistema." });
      }

      res.status(200).json({ message: "Correo verificado correctamente." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error del servidor.", error });
    }
  }
);

router.post(
  "/auth/get-question",
  body("email").isEmail().withMessage("Email no válido"),
  handleInputErrors,
  async (req, res) => {
    const { email } = req.body;

    try {
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      res
        .status(200)
        .json({ pregunta: user.pregunta, respuesta: user.respuesta });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error del servidor" });
    }
  }
);

// Ruta para generar y enviar el OTP
router.post(
  "/auth/generate-otp",
  body("email").isEmail().withMessage("Email no válido"),
  handleInputErrors,
  async (req, res) => {
    const { email } = req.body;

    try {
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      const token = await generateOtp(user._id.toString()); // Genera el OTP

      // Envía el OTP al correo del usuario
      await sendEmail(email, token);

      res.status(200).json({ message: "OTP enviado al correo electrónico" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error del servidor" });
    }
  }
);

// Ruta para verificar el OTP
router.post(
  "/auth/verify-otp",
  body("email").isEmail().withMessage("Email no válido"),
  body("otp")
    .isNumeric()
    .withMessage("El OTP debe ser numérico")
    .isLength({ min: 6, max: 6 })
    .withMessage("El OTP debe tener 6 dígitos"),
  handleInputErrors,
  async (req, res) => {
    const { email, otp } = req.body;

    try {
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      const isValid = await verifyOtp(user._id.toString(), otp);

      if (!isValid) {
        return res.status(400).json({ message: "OTP inválido o expirado" });
      }

      res.status(200).json({ message: "OTP verificado correctamente" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error del servidor" });
    }
  }
);

export default router;
