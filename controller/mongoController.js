import Categoria from "../models/Categoria.js";
import Producto from "../models/Producto.js";
import ProductoFoto from "../models/ProductoFoto.js";
import { validationResult } from "express-validator";

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

        categoria.remove();

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

        producto.remove();

        req.flash('css', 'success');
        req.flash('mensajes', [{msg: 'Producto eliminado correctamente'}]);
        return res.redirect('/mongo/productos');
    } catch (error) {
        req.flash('css','danger');
        req.flash('mensajes', [{msg: error.message}]);
        res.redirect('/mongo/productos');
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
    eliminarProducto
}