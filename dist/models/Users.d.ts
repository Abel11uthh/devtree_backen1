import mongoose from 'mongoose';
export interface IUser {
    name: string;
    email: string;
    password: string;
}
declare const User: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser> & IUser & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, any>;
export default User;
