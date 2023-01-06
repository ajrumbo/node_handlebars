import Category from "../models/Category.js";
import Product from "../models/Product.js";
import ProductPhoto from "../models/ProductPhoto.js";
import { validationResult } from "express-validator";

const mysql = (req, res) => {
    res.render('mysql/home', {tituloPagina: 'MySQL'})
}

const categoriasM = async (req, res) => {
    try {
        let datos = await Category.findAll({ 
            raw: true,
            order: [['id', 'asc']]
        });
        
        res.render('mysql/categorias', {tituloPagina: 'MySQL', datos});
    } catch (error) {
        req.flash('css','danger');
        req.flash('mensajes', [{msg: error.message}]);
        return res.redirect('/mysql/categorias');
    }
    
}

const crearM = (req, res) => {
    return res.render('mysql/crear', {tituloPagina: 'MySQL'}); 
}

const crearMPost = async (req, res) => {
    const {nombre} = req.body;

    const errors = validationResult(req);

    if(!errors.isEmpty()){
        req.flash('css', 'danger');
        req.flash('mensajes', errors.array());
        return res.redirect('/mysql/categorias/crear');
    }

    try {
        const categoria = await Category.findOne({ 
            raw: true,
            where: { nombre },
            order: [['id', 'asc']]
        });
        
        if (categoria) throw new Error('La categoría ya existe');

        await Category.create({nombre});
        req.flash('css', 'success');
        req.flash('mensajes', [{msg: 'Categoría creada correctamente'}]);
        return res.redirect('/mysql/categorias/crear');

    } catch (error) {
        req.flash('css','danger');
        req.flash('mensajes', [{msg: error.message}]);
        return res.redirect('/mysql/categorias/crear');
    }
}

export {
    mysql,
    categoriasM,
    crearM,
    crearMPost
}