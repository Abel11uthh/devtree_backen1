export declare const generateOtp: (userId: string) => Promise<string>;
export declare const verifyOtp: (userId: string, token: string) => Promise<boolean>;
