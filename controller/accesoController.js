import User from "../models/User.js";
import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";

const login = async (req, res) => {
    if(req.isAuthenticated()) res.redirect('/acceso/protegida');
    return res.render('acceso/login', {tituloPagina: 'Login'});
}

const loginPost = async (req, res) => {
    const { email, password } = req.body;

    const errors = validationResult(req);

    if(!errors.isEmpty()){
        req.flash('css', 'danger');
        req.flash('mensajes', errors.array());
        return res.redirect('/acceso/login');
    }

    try {
        const user = await User.findOne({
            where: {
                email
            },
            raw: true
        });

        if(!user) throw new Error('No existe el usuario');

        bcrypt.compare(password, user.password, (err, data) => {
            if(err) throw err;

            if(data){
                req.login(user, function(err){
                    if(err) throw new Error('Error al iniciar sesión');

                    return res.redirect('/acceso/protegida');
                });
                
            }else{
                req.flash('css', 'danger');
                req.flash('mensajes', [{msg: 'Los datos ingresados son incorrectos'}]);
                return res.redirect('/acceso/login');
            }
        });

    } catch (error) {
        req.flash('css', 'danger');
        req.flash('mensajes', [{msg: error.message}]);
        return res.redirect('/acceso/login');
    }
}

const registro = (req, res) => {
    return res.render('acceso/registro', {tituloPagina: 'Registro'});
}

const registroPost = async (req, res) => {
    const {nombre, email, password, repassword} = req.body;

    const errors = validationResult(req);

    if(!errors.isEmpty()){
        req.flash('css', 'danger');
        req.flash('mensajes', errors.array());
        return res.redirect('/acceso/registro');
    }

    try {
        if(password !== repassword) throw new Error('Las contraseñas deben coincidir');

        const user = await User.findOne({
            where: {
                email
            },
            raw: true
        });

        if(user) throw new Error('El usuario ya está registrado');

        await User.create({nombre,email,password});
        req.flash('css', 'success');
        req.flash('mensajes', [{msg: 'Usuario creado correctamente'}]);
        return res.redirect('/acceso/registro');

    } catch (error) {
        req.flash('css', 'danger');
        req.flash('mensajes', [{msg: error.message}]);
        return res.redirect('/acceso/registro');
    }
}

const protegida = (req, res) => {
    return res.render('acceso/protegida', {tituloPagina: 'Ruta Protegida'});
}

const protegida2 = (req, res) => {
    return res.render('acceso/protegida2', {tituloPagina: 'Ruta Protegida'});
}

const salir = (req, res) => {
    req.logout(err => {
        if(err) return next(err);
        
        req.flash('css', 'success');
        req.flash('mensajes', [{msg: 'Sesión cerrada correctamente'}]);
        return res.redirect('/acceso/login');
    });
    
}

export {
    login,
    loginPost,
    registro,
    registroPost,
    protegida,
    protegida2,
    salir
}