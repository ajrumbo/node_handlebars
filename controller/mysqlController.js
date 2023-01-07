import Category from "../models/Category.js";
import Product from "../models/Product.js";
import ProductPhoto from "../models/ProductPhoto.js";
import { validationResult } from "express-validator";
import slugs from "slug";
import { Op } from "sequelize";
import formidable from "formidable";
import fs from "fs";
import path from "path";

const mysql = (req, res) => {
    res.render('mysql/home', {tituloPagina: 'MySQL'})
}

/********************************       Categorías      ************************************/

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

const editarM = async (req, res) => {
    const {id} = req.params;
    
    try {
        const categoria = await Category.findOne({ 
            raw: true,
            where: { id },
            order: [['id', 'asc']]
        });
        
        if (!categoria) throw new Error('La categoría no existe');

        return res.render('mysql/editar', {tituloPagina: 'MySQL', categoria});
    } catch (error) {
        req.flash('css','danger');
        req.flash('mensajes', [{msg: error.message}]);
        return res.redirect('/mysql/categorias');
    }
}

const editarMPost = async (req, res) => {
    const {id} = req.params;
    const {nombre} = req.body;

    const errors = validationResult(req);

    if(!errors.isEmpty()){
        req.flash('css', 'danger');
        req.flash('mensajes', errors.array());
        return res.redirect('/mysql/categorias');
    }

    try {
        const categoria = await Category.findOne({ 
            raw: true,
            where: { nombre },
            order: [['id', 'asc']]
        });
        
        if (categoria) throw new Error('La categoría ya existe');

        const slug = slugs(nombre);

        await Category.update({ nombre, slug }, {
            where: {
              id
            }
          });

        req.flash('css', 'success');
        req.flash('mensajes', [{msg: 'Categoría editada correctamente'}]);
        return res.redirect('/mysql/categorias');
    } catch (error) {
        req.flash('css','danger');
        req.flash('mensajes', [{msg: error.message}]);
        return res.redirect('/mysql/categorias');
    }
}

const eliminarM = async (req, res) => {
    const {id} = req.params;

    try {
        const categoria = await Category.findOne({ 
            raw: true,
            where: { id },
            order: [['id', 'asc']]
        });
        
        if (!categoria) throw new Error('La categoría no existe');

        

        await Category.destroy({
            where: {
              id
            }
        });

        req.flash('css', 'success');
        req.flash('mensajes', [{msg: 'Categoría eliminada correctamente'}]);
        return res.redirect('/mysql/categorias');
    } catch (error) {
        req.flash('css','danger');
        req.flash('mensajes', [{msg: error.message}]);
        return res.redirect('/mysql/categorias');
    }
}

/********************************       productos      ************************************/
const productosM = async (req, res) => {
    try {
        let datos = await Product.findAll({ 
            raw: true,
            order: [['id', 'asc']],
            include: {all: true, nester: true}
        });
        
        res.render('mysql/productos', {tituloPagina: 'MySQL', datos});
    } catch (error) {
        req.flash('css','danger');
        req.flash('mensajes', [{msg: error.message}]);
        return res.redirect('/mysql/productos');
    }
}

const crearMProducto = async (req, res) => {
    try {
        let categoria = await Category.findAll({ 
            raw: true,
            order: [['id', 'asc']]
        });
        
        return res.render('mysql/crearProducto', {tituloPagina: 'MySQL', categoria});
    } catch (error) {
        req.flash('css','danger');
        req.flash('mensajes', [{msg: error.message}]);
        return res.redirect('/mysql/productos');
    }
    
}

const crearMProductoPost = async (req, res) => {
    const {nombre, idCategoria, precio, descripcion} = req.body;

    const errors = validationResult(req);

    if(!errors.isEmpty()){
        req.flash('css', 'danger');
        req.flash('mensajes', errors.array());
        return res.redirect('/mysql/productos/crear');
    }

    try {
        const producto = await Product.findOne({ 
            raw: true,
            where: { nombre },
            order: [['id', 'asc']]
        });
        
        if (producto) throw new Error('El producto ya existe');

        await Product.create({nombre,idCategoria,precio,descripcion});
        req.flash('css', 'success');
        req.flash('mensajes', [{msg: 'Producto creado correctamente'}]);
        return res.redirect('/mysql/productos/crear');
    } catch (error) {
        req.flash('css','danger');
        req.flash('mensajes', [{msg: error.message}]);
        return res.redirect('/mysql/productos/crear');
    }
}

const productoCategoriaM = async (req, res) => {

    const {id} = req.params;

    try {
        const categoria = await Category.findOne({ 
            raw: true,
            where: { id },
            order: [['id', 'asc']]
        });
        
        if (!categoria) throw new Error('La categoría no existe');

        const categoriaNombre = categoria.nombre;

        const datos = await Product.findAll({ 
            raw: true,
            where: {idCategoria: id},
            order: [['id', 'asc']],
            include: {all: true, nester: true}
        });
        
        res.render('mysql/productosCategoria', {tituloPagina: 'MySQL', datos, categoriaNombre});
    } catch (error) {
        req.flash('css','danger');
        req.flash('mensajes', [{msg: error.message}]);
        return res.redirect('/mysql/productos');
    }
}

const productoEditarM = async (req, res) => {
    const {id} = req.params;

    try {

        let categoria = await Category.findAll({ 
            raw: true,
            order: [['id', 'asc']]
        });
        

        const producto = await Product.findOne({ 
            raw: true,
            where: {id},
            order: [['id', 'asc']],
            include: {all: true, nester: true}
        });

        if(!producto) throw new Error('El producto no existe');

        const categoriaProducto = producto['category.id'];
        
        return res.render('mysql/editarProducto', {tituloPagina: 'MySQL', producto, categoriaProducto, categoria});
    } catch (error) {
        req.flash('css','danger');
        req.flash('mensajes', [{msg: error.message}]);
        return res.redirect('/mysql/productos');
    }
}

const productoEditarMPost = async (req, res) => {
    const {id} = req.params;

    const {nombre, idCategoria, precio, descripcion} = req.body;

    const errors = validationResult(req);

    if(!errors.isEmpty()){
        req.flash('css', 'danger');
        req.flash('mensajes', errors.array());
        return res.redirect(`/mysql/productos/editar/${id}`);
    }

    try {
        
        const producto = await Product.findOne({ 
            raw: true,
            where: {
                nombre,
                id: {
                    [Op.ne]: id
                }
            },
            order: [['id', 'asc']]
        });
        

        if (producto) throw new Error('El producto ya existe');

        const slug = slugs(nombre);
        await Product.update({ nombre,idCategoria,precio,descripcion,slug }, {
            where: {
                id
            }
          });
        req.flash('css', 'success');
        req.flash('mensajes', [{msg: 'Producto editado correctamente'}]);
        return res.redirect('/mysql/productos');
    } catch (error) {
        req.flash('css','danger');
        req.flash('mensajes', [{msg: error.message}]);
        return res.redirect(`/mysql/productos/editar/${id}`);
    }
}

const eliminarProductoM = async (req, res) => {
    const {id} = req.params;

    try {
        const producto = await Product.findOne({ 
            raw: true,
            where: { id },
            order: [['id', 'asc']]
        });
        
        if (!producto) throw new Error('El producto no existe');

        await Product.destroy({
            where: {
              id
            }
        });

        req.flash('css', 'success');
        req.flash('mensajes', [{msg: 'Producto eliminado correctamente'}]);
        return res.redirect('/mysql/productos');

    } catch (error) {
        req.flash('css','danger');
        req.flash('mensajes', [{msg: error.message}]);
        return res.redirect('/mysql/productos');
    }
}

const productoFotosM = async (req, res) => {
    const {id} = req.params;

    try {
        const producto = await Product.findOne({ 
            raw: true,
            where: { id },
            order: [['id', 'asc']]
        });
        
        if(!producto) throw new Error ('No existe este Producto');

        const fotos = await ProductPhoto.findAll({ 
            raw: true,
            order: [['id', 'asc']],
            include: {all: true, nester: true}
        });

        
        
        return res.render('mysql/productoFotos',{tituloPagina: 'MySQL', producto, fotos});
    } catch (error) {
        req.flash('css','danger');
        req.flash('mensajes', [{msg: error.message}]);
        res.redirect('/mysql/productos');
    }
}

const productoFotosMPost = async (req, res) => {
    const {id} = req.params;
    const form = new formidable.IncomingForm();

    form.maxFileSize = 100 * 1024 * 1024; //10Mb
    try {

        const producto = await Product.findOne({ 
            raw: true,
            where: { id },
            order: [['id', 'asc']]
        });
        
        if(!producto) throw new Error ('No existe este Producto');


        form.parse(req, async (err, fields, files) => {
            try {
                
                if(err) {
                    throw new Error ('Se produjo un error: ' + err);
                }
                
                const file = files.foto;

                if(file.originalFilename === '') {
                    throw new Error ('No se cargó ninguna imagen');
                }

                const imageTypes = [
                    'image/jpeg',
                    'image/png',
                    'image/gif'
                ];

                if(!imageTypes.includes(file.mimetype)) {
                    throw new Error ('Formato de archivo no válido. Cargar imagen JPG|PNG|GIF');
                }

                if(file.size > 100 * 1024 * 1024) {
                    throw new Error ('Tamaño máximo del archivo superado (10MB)');
                }
                
                let unix = Math.round(+new Date() / 1000);
                let nombre_final;

                switch (file.mimetype){
                    case "image/jpeg":
                        nombre_final = `${unix}.jpg`;
                        break;
                    case "image/png":
                        nombre_final = `${unix}.png`;
                        break;
                    case "image/gif":
                        nombre_final = `${unix}.gif`;
                        break;
                }

                const dirFile = path.join(`./assets/uploads/producto/${nombre_final}`);


                fs.copyFile(file.filepath, dirFile, function(err){
                    if(err) throw err;
                });

                await ProductPhoto.create({nombre: nombre_final,idProducto: id});

                req.flash('css', 'success');
                req.flash('mensajes', [{msg: 'Foto cargada correctamente'}]);
                return res.redirect(`/mysql/productos/fotos/${id}`);
            } catch (error) {
                req.flash('css', 'danger');
                req.flash('mensajes', [{msg: error.message}]);
                return res.redirect(`/mysql/productos/fotos/${id}`);
            }
        });

    } catch (error) {
        req.flash('css','danger');
        req.flash('mensajes', [{msg: error.message}]);
        res.redirect('/mysql/productos');
    }
}

const eliminarFotoM = async (req, res) => {
    const {idProducto,idFoto} = req.params;

    console.log(idProducto,idFoto)
    try {
        const foto = await ProductPhoto.findOne({ 
            raw: true,
            where: { id: idFoto, idProducto },
            order: [['id', 'asc']]
        });

        
        if(!foto) throw new Error ('No existe la foto');

        //Borramos el archivo 
        fs.unlinkSync(`./assets/uploads/producto/${foto.nombre}`);


        await ProductPhoto.destroy({
            where: {
                id: idFoto,
                idProducto
            }
        });
        req.flash('css', 'success');
        req.flash('mensajes', [{msg: 'Foto eliminada correctamente'}]);
        return res.redirect(`/mysql/productos/fotos/${idProducto}`);
    } catch (error) {
        req.flash('css','danger');
        req.flash('mensajes', [{msg: error.message}]);
        return res.redirect(`/mysql/productos/fotos/${idProducto}`);
    }
}


export {
    mysql,
    categoriasM,
    crearM,
    crearMPost,
    editarM,
    editarMPost,
    eliminarM,
    productosM,
    crearMProducto,
    crearMProductoPost,
    productoCategoriaM,
    productoEditarM,
    productoEditarMPost,
    eliminarProductoM,
    productoFotosM,
    productoFotosMPost,
    eliminarFotoM
}