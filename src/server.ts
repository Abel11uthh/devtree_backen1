import express from "express";
import cors from "cors";
import "dotenv/config";
import router from "./router";
import { connectBD } from "./config/db";
import { corsConfig } from "./config/cors";
import dotenv from "dotenv";
dotenv.config();

connectBD();

const app = express();

// cors
app.use(cors(corsConfig));
app.post("/ruta", (req, res, next) => {
  console.log(req.body); // Imprime el cuerpo de la solicitud
  next();
});

// leer datos de formularios
app.use(express.json());

app.use("/", router);

export default app;
