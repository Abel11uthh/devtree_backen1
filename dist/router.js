"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const handlers_1 = require("./handlers");
const router = (0, express_1.Router)();
//autenticacion y registro 
router.post('/auth/register', (0, express_validator_1.body)('name')
    .notEmpty()
    .withMessage('el nombre no puede ir vacio'), (0, express_validator_1.body)('email')
    .isEmail()
    .withMessage('email no valido'), (0, express_validator_1.body)('password')
    .isLength({ min: 8 })
    .withMessage('el password es muy corto, minimo 8 caracteres'), handlers_1.createAccount);
router.post('/auth/login', (0, express_validator_1.body)('email')
    .isEmail()
    .withMessage('email no valido'), (0, express_validator_1.body)('password')
    .notEmpty()
    .withMessage('el password es obligatorio'), handlers_1.login);
exports.default = router;
//# sourceMappingURL=router.js.map