import { JwtPayload } from 'jsonwebtoken';
export declare const generateJWT: (payload: JwtPayload) => string;
export declare const generatePasswordResetTokenFromLogin: (authToken: string) => string;
