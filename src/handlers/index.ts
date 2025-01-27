    import { Request, Response } from "express";
    import { validationResult } from "express-validator";
    import slug from "slug";
    import User from "../models/Users";
    import { checkPassword, hashPassword } from "../utils/auth";
    import { generateJWT } from "../utils/jwt";
    export const createAccount = async (req: Request, res: Response) => {
        const { email, password, handle, telefono } = req.body;
    
        const errors: { path: string; msg: string }[] = [];
    
        // Verificar si el email ya está registrado
        const userExists = await User.findOne({ email });
        if (userExists) {
            errors.push({ path: "email", msg: "Un usuario con ese email ya está registrado" });
        }
    
        // Verificar si el handle (nombre de usuario) ya está registrado
        const slugHandle = slug(handle, '');
        const handleExists = await User.findOne({ handle: slugHandle });
        if (handleExists) {
            errors.push({ path: "handle", msg: "Nombre de usuario no disponible" });
        }
    
        // Verificar si el teléfono ya está registrado
        const slugTelefono = slug(telefono, '');
        const telefonoExists = await User.findOne({ telefono: slugTelefono });
        if (telefonoExists) {
            errors.push({ path: "telefono", msg: "Este teléfono ya está registrado" });
        }
    
        // Si hay errores, devolverlos todos
        if (errors.length > 0) {
            return res.status(409).json({ errors });
        }
    
        // Crear nuevo usuario
        const user = new User(req.body);
        user.password = await hashPassword(password);
        user.handle = slugHandle;
    
        await user.save();
        return res.status(201).json({ message: "Registro creado correctamente" });
    };
    

    export const login = async (req: Request, res: Response) => {
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: 'Error de validación', errors: errors.array() });
        }

        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'El Usuario no existe' });
        }

        const isPasswordCorrect = await checkPassword(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: 'Password Incorrecto' });
        }

        const token = generateJWT({ id: user.id });
        return res.json({ token });
    }
