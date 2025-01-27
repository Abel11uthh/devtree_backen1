export declare const hashPassword: (password: string) => Promise<string>;
export declare const checkPassword: (enterdPassword: string, hash: string) => Promise<boolean>;
