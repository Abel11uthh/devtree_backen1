"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.createAccount = void 0;
const express_validator_1 = require("express-validator");
const slug_1 = __importDefault(require("slug"));
const Users_1 = __importDefault(require("../models/Users"));
const auth_1 = require("../utils/auth");
const jwt_1 = require("../utils/jwt");
const createAccount = async (req, res) => {
    const { email, password, handle, telefono } = req.body;
    const errors = [];
    // Verificar si el email ya está registrado
    const userExists = await Users_1.default.findOne({ email });
    if (userExists) {
        errors.push({ path: "email", msg: "Un usuario con ese email ya está registrado" });
    }
    // Verificar si el handle (nombre de usuario) ya está registrado
    const slugHandle = (0, slug_1.default)(handle, '');
    const handleExists = await Users_1.default.findOne({ handle: slugHandle });
    if (handleExists) {
        errors.push({ path: "handle", msg: "Nombre de usuario no disponible" });
    }
    // Verificar si el teléfono ya está registrado
    const slugTelefono = (0, slug_1.default)(telefono, '');
    const telefonoExists = await Users_1.default.findOne({ telefono: slugTelefono });
    if (telefonoExists) {
        errors.push({ path: "telefono", msg: "Este teléfono ya está registrado" });
    }
    // Si hay errores, devolverlos todos
    if (errors.length > 0) {
        return res.status(409).json({ errors });
    }
    // Crear nuevo usuario
    const user = new Users_1.default(req.body);
    user.password = await (0, auth_1.hashPassword)(password);
    user.handle = slugHandle;
    await user.save();
    return res.status(201).json({ message: "Registro creado correctamente" });
};
exports.createAccount = createAccount;
const login = async (req, res) => {
    let errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Error de validación', errors: errors.array() });
    }
    const { email, password } = req.body;
    const user = await Users_1.default.findOne({ email });
    if (!user) {
        return res.status(404).json({ message: 'El Usuario no existe' });
    }
    const isPasswordCorrect = await (0, auth_1.checkPassword)(password, user.password);
    if (!isPasswordCorrect) {
        return res.status(401).json({ message: 'Password Incorrecto' });
    }
    const token = (0, jwt_1.generateJWT)({ id: user.id });
    return res.json({ token });
};
exports.login = login;
//# sourceMappingURL=index.js.map