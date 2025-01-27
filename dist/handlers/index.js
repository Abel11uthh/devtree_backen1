"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.createAccount = void 0;
const express_validator_1 = require("express-validator");
const Users_1 = __importDefault(require("../models/Users"));
const auth_1 = require("../utils/auth");
// Registrar la cuenta
const createAccount = async (req, res) => {
    const { email, password } = req.body;
    // Verificar si el usuario ya existe
    const userExists = await Users_1.default.findOne({ email });
    if (userExists) {
        res.status(409).json({ error: "Un usuario con ese mail ya está registrado" });
        return;
    }
    // Crear el nuevo usuario
    const user = new Users_1.default(req.body);
    user.password = await (0, auth_1.hashPassword)(password);
    await user.save();
    res.status(201).send("Registro creado correctamente");
};
exports.createAccount = createAccount;
// Iniciar sesión
const login = async (req, res) => {
    // Validar errores en la solicitud
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    const { email, password } = req.body;
    // Verificar si el usuario está registrado
    const user = await Users_1.default.findOne({ email });
    if (!user) {
        res.status(404).json({ error: "El usuario no existe" });
        return;
    }
    // Verificar la contraseña
    const isPasswordCorrect = (0, auth_1.checkPassword)(password, user.password);
    if (!isPasswordCorrect) {
        res.status(401).json({ error: "Contraseña incorrecta" });
        return;
    }
    // Devolver un mensaje de éxito
    res.status(200).json({ message: "Inicio de sesión exitoso" });
};
exports.login = login;
//# sourceMappingURL=index.js.map