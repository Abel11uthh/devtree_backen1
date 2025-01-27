import  jwt,{JwtPayload}  from 'jsonwebtoken'

export const generateJWT=(payload:JwtPayload)=>{
    const token = jwt.sign(payload,process.env.JWT_SECRET,{
        expiresIn:'180D'
    })
    return token
}

export const generatePasswordResetTokenFromLogin = (authToken: string): string => {
    try {
        // Verifica el token existente (de inicio de sesión)
        const decoded = jwt.verify(authToken, process.env.JWT_SECRET) as jwt.JwtPayload;

        // Genera un nuevo token para recuperación de contraseña con la misma información
        const resetToken = jwt.sign(
            { email: decoded.email }, // Usa información básica (como email o ID)
            process.env.JWT_SECRET,
            { expiresIn: '15m' } // Expiración corta para mayor seguridad
        );

        return resetToken;
    } catch (err) {
        throw new Error('Token inválido o expirado');
    }
};
