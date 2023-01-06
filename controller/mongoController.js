import Categoria from "../models/Categoria.js";
import Producto from "../models/Producto.js";
import ProductoFoto from "../models/ProductoFoto.js";
import { validationResult } from "express-validator";
import formidable from "formidable";
import fs from "fs";
import path from "path";

const mongo = (req, res) => {
    res.render('mongo/home', {tituloPagina: 'MongoDB'});
}

/************************        Categorías         *******************************/ 

const categorias = async (req, res) => {

    try {
        const datos = await Categoria.find().lean().sort('nombre');
        return res.render('mongo/categorias', {tituloPagina: 'MongoDB', datos});   
    } catch (error) {
        req.flash('css','danger');
        req.flash('mensajes', [{msg: error.message}]);
        res.redirect('/');
    }
}

const crear = (req, res) => {
    return res.render('mongo/crear', {tituloPagina: 'MongoDB'}); 
}

const crearPost = async (req, res) => {
    const {nombre} = req.body;

    const errors = validationResult(req);

    if(!errors.isEmpty()){
        req.flash('css', 'danger');
        req.flash('mensajes', errors.array());
        return res.redirect('/mongo/categorias/crear');
    }

    try {
        const existe = await Categoria.findOne({nombre});
        
        if(existe) throw new Error ('Ya existe esta categoría');

        const categoria = new Categoria({nombre});
        await categoria.save();
        req.flash('css', 'success');
        req.flash('mensajes', [{msg: 'Categoría creada correctamente'}]);
        return res.redirect('/mongo/categorias/crear');

    } catch (error) {
        req.flash('css','danger');
        req.flash('mensajes', [{msg: error.message}]);
        res.redirect('/mongo/categorias');
    }

}

const editar = async (req, res) => {
    const {id} = req.params;

    try {
        const categoria = await Categoria.findById(id).lean();
        
        if(!categoria) throw new Error ('No existe esta categoría');

        return res.render('mongo/editar', {tituloPagina: 'MongoDB', categoria});

    } catch (error) {
        req.flash('css','danger');
        req.flash('mensajes', [{msg: error.message}]);
        res.redirect('/mongo/categorias');
    }

    
}

const editarPost = async (req, res) => {
    const {id} = req.params;

    const {nombre} = req.body;

    const errors = validationResult(req);

    if(!errors.isEmpty()){
        req.flash('css', 'danger');
        req.flash('mensajes', errors.array());
        return res.redirect('/mongo/categorias/crear');
    }

    try {
        const categoria = await Categoria.findOne({nombre});
        
        if(categoria) throw new Error ('Ya existe esta categoría');
        // await categoria.updateOne({nombre});

        await Categoria.findByIdAndUpdate(id, {nombre});
        req.flash('css', 'success');
        req.flash('mensajes', [{msg: 'Categoría editada correctamente'}]);
        return res.redirect('/mongo/categorias');
    } catch (error) {
        req.flash('css','danger');
        req.flash('mensajes', [{msg: error.message}]);
        res.redirect('/mongo/categorias');
    }
}

const eliminar = async (req, res) => {
    const {id} = req.params;

    try {
        const categoria = await Categoria.findById(id);
        
        if(!categoria) throw new Error ('No existe esta categoría');

        await categoria.remove();

        req.flash('css', 'success');
        req.flash('mensajes', [{msg: 'Categoría eliminada correctamente'}]);
        return res.redirect('/mongo/categorias');
    } catch (error) {
        req.flash('css','danger');
        req.flash('mensajes', [{msg: error.message}]);
        res.redirect('/mongo/categorias');
    }
}

/************************        Productos         *******************************/ 
const productos = async (req, res) => {
    try {
        // const datos = await Producto.find().lean().sort('nombre');

        // const datos = await Producto.aggregate(
        //     [
        //         {
        //             $lookup: {
        //                 from: "categorias",
        //                 localField: "categoria_id",
        //                 foreignField: "_id",
        //                 as: "categoria"
        //             }
        //         },
        //         {
        //             $unwind: "$categoria"
        //         }
        //     ]
        // );

        const datos = await Producto.find().populate('categoria_id').lean().sort('nombre');

        return res.render('mongo/productos', {tituloPagina: 'MongoDB', datos});   
    } catch (error) {
        req.flash('css','danger');
        req.flash('mensajes', [{msg: error.message}]);
        res.redirect('/');
    }
}

const crearProducto = async (req, res) => {
    const categoria = await Categoria.find().lean().sort('nombre');
    return res.render('mongo/crearProducto', {tituloPagina: 'MongoDB', categoria}); 
}

const crearProductoPost = async (req, res) => {
    const {nombre,precio,descripcion,categoria_id} = req.body;

    const errors = validationResult(req);

    if(!errors.isEmpty()){
        req.flash('css', 'danger');
        req.flash('mensajes', errors.array());
        return res.redirect('/mongo/categorias/crear');
    }

    try {
        const existe = await Producto.findOne({nombre});
        
        if(existe) throw new Error ('Ya existe este producto');

        const producto = new Producto({nombre, precio, descripcion, categoria_id});
        await producto.save();
        req.flash('css', 'success');
        req.flash('mensajes', [{msg: 'Producto creado correctamente'}]);
        return res.redirect('/mongo/productos');

    } catch (error) {
        req.flash('css','danger');
        req.flash('mensajes', [{msg: error.message}]);
        res.redirect('/mongo/productos');
    }
    
}

const editarProducto = async (req, res) => {
    const {id} = req.params;
    const categoria = await Categoria.find().lean().sort('nombre');
    try {
        const producto = await Producto.findById(id).lean();
        
        if(!producto) throw new Error ('No existe este producto');

        const categoriaProducto = producto.categoria_id.toString();

        return res.render('mongo/editarProducto', {tituloPagina: 'MongoDB', producto, categoria, categoriaProducto});

    } catch (error) {
        req.flash('css','danger');
        req.flash('mensajes', [{msg: error.message}]);
        res.redirect('/mongo/categorias');
    }
}

const editarProductoPost = async (req, res) => {
    const {id} = req.params;
    const {nombre,precio,descripcion,categoria_id} = req.body; 

    const producto = await Producto.findById(id);
        
    if(!producto) throw new Error ('No existe este producto');

    try {
        await producto.updateOne({nombre, precio, descripcion, categoria_id});

        req.flash('css', 'success');
        req.flash('mensajes', [{msg: 'Producto editado correctamente'}]);
        return res.redirect('/mongo/productos');
    } catch (error) {
        req.flash('css','danger');
        req.flash('mensajes', [{msg: error.message}]);
        res.redirect('/mongo/productos');
    }

}

const eliminarProducto = async (req, res) => {
    const {id} = req.params;

    try {
        const producto = await Producto.findById(id);
        
        if(!producto) throw new Error ('No existe este Producto');

        await await producto.remove();

        req.flash('css', 'success');
        req.flash('mensajes', [{msg: 'Producto eliminado correctamente'}]);
        return res.redirect('/mongo/productos');
    } catch (error) {
        req.flash('css','danger');
        req.flash('mensajes', [{msg: error.message}]);
        res.redirect('/mongo/productos');
    }
}

const productoCategoria = async (req, res) => {
    const {id} = req.params;

    try {

        const datos = await Producto.find({categoria_id: id}).populate('categoria_id').lean().sort('nombre');
        
        const categoriaNombre = datos[0].categoria_id.nombre;

        if(!datos) throw new Error ('No existen productos para esta categoría');
        
        return res.render('mongo/productosCategoria',{tituloPagina: 'MongoDB', datos, categoriaNombre});
    } catch (error) {
        req.flash('css','danger');
        req.flash('mensajes', [{msg: error.message}]);
        res.redirect('/mongo/productos');
    }

}

const productoFotos = async (req, res) => {
    const {id} = req.params;

    try {
        const producto = await Producto.findById(id).lean();
        
        if(!producto) throw new Error ('No existe este Producto');

        const fotos = await ProductoFoto.find({producto_id: id}).lean();
        
        return res.render('mongo/productoFotos',{tituloPagina: 'MongoDB', producto, fotos});
    } catch (error) {
        req.flash('css','danger');
        req.flash('mensajes', [{msg: error.message}]);
        res.redirect('/mongo/productos');
    }
    
}

const productoFotosPost = async (req, res) => {
    const {id} = req.params;
    const form = new formidable.IncomingForm();
    form.maxFileSize = 100 * 1024 * 1024; //10Mb
    try {
        const producto = await Producto.findById(id).lean();
        
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

                const foto = new ProductoFoto({
                    producto_id: id,
                    nombre: `${nombre_final}`
                });

                await foto.save();

                req.flash('css', 'success');
                req.flash('mensajes', [{msg: 'Foto cargada correctamente'}]);
                return res.redirect(`/mongo/productos/fotos/${id}`);
            } catch (error) {
                req.flash('css', 'danger');
                req.flash('mensajes', [{msg: error.message}]);
                return res.redirect(`/mongo/productos/fotos/${id}`);
            }
        });

    } catch (error) {
        req.flash('css','danger');
        req.flash('mensajes', [{msg: error.message}]);
        res.redirect('/mongo/productos');
    }
}

const eliminarFoto = async (req, res) => {
    const {idProducto,idFoto} = req.params;

    try {
        const foto = await ProductoFoto.findOne({_id: idFoto, producto_id: idProducto});
        
        if(!foto) throw new Error ('No existe la foto');

        //Borramos el archivo 
        fs.unlinkSync(`./assets/uploads/producto/${foto.nombre}`);


        await foto.remove();
        req.flash('css', 'success');
        req.flash('mensajes', [{msg: 'Foto eliminada correctamente'}]);
        return res.redirect(`/mongo/productos/fotos/${idProducto}`);
    } catch (error) {
        req.flash('css','danger');
        req.flash('mensajes', [{msg: error.message}]);
        return res.redirect(`/mongo/productos/fotos/${idProducto}`);
    }
    
}


export {
    mongo,
    categorias,
    crear,
    crearPost,
    editar,
    editarPost,
    eliminar,
    productos,
    crearProducto,
    crearProductoPost,
    editarProducto,
    editarProductoPost,
    eliminarProducto,
    productoCategoria,
    productoFotos,
    productoFotosPost,
    eliminarFoto
}