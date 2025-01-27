import mongoose, { Schema } from "mongoose";

export interface IUser {
  handle: string;
  name: string;
  apellidoMaterno: string;
  apellidoPaterno: string;
  telefono: string;
  email: string;
  password: string;
  pregunta: string;
  respuesta: string;
}

const userSchema = new Schema({
  handle: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  apelidoMaterno: {
    type: String,
    required: false,
    trim: true,
  },
  apellidoPaterno: {
    type: String,
    required: false,
    trim: true,
  },
  telefono: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  pregunta: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  respuesta: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
});

const User = mongoose.model<IUser>("User", userSchema);
export default User;
