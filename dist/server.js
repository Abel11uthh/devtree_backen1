"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
require("dotenv/config");
const router_1 = __importDefault(require("./router"));
const db_1 = require("./config/db");
const cors_2 = require("./config/cors");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
(0, db_1.connectBD)();
const app = (0, express_1.default)();
// cors
app.use((0, cors_1.default)(cors_2.corsConfig));
app.post("/ruta", (req, res, next) => {
    console.log(req.body); // Imprime el cuerpo de la solicitud
    next();
});
// leer datos de formularios
app.use(express_1.default.json());
app.use("/", router_1.default);
exports.default = app;
//# sourceMappingURL=server.js.map