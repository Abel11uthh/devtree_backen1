import mongoose from "mongoose";
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
declare const User: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser> & IUser & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, any>;
export default User;
