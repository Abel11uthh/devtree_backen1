import mongoose, { Document } from "mongoose";
export interface IOtp extends Document {
    user: mongoose.Types.ObjectId;
    token: string;
    used: boolean;
    createdAt: Date;
}
declare const Otp: mongoose.Model<IOtp, {}, {}, {}, mongoose.Document<unknown, {}, IOtp> & IOtp & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default Otp;
