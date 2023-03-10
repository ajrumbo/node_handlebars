import { Router } from "express";
import { index } from "../controller/controller.js";
import { formularios, normal, normalPost, upload, uploadPost } from "../controller/formulariosController.js";
import { home, pdf, excel, csv } from "../controller/reportesController.js";
import { body } from "express-validator";
import { utiles, mail, jwt, qr, rest } from "../controller/utilesController.js";
import { 
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
} from "../controller/mongoController.js";
import { 
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
} from "../controller/mysqlController.js";
import { login, loginPost, registro, registroPost, protegida, protegida2, salir } from "../controller/accesoController.js";
import verificarUsuario from "../middleware/verificarUsuario.js";
import { webpay, pagar, respuesta } from "../controller/webpayController.js";

const router = Router();

//****************    Inicial      *****************************/
router.get('/',index);

//****************    formularios      *****************************/
router.get('/formularios', formularios);
router.get('/formularios/normal',normal);
router.post('/formularios/normal', [
    body('nombre', 'Ingrese un nombre válido')
        .notEmpty()
        .escape()
        .trim(),
    body('correo', 'Ingrese un email válido')
        .trim()
        .isEmail()
        .normalizeEmail(),
    body('telefono', 'Ingrese un teléfono válido')
        .isMobilePhone()
],normalPost);


router.get('/formularios/upload', upload);
router.post('/formularios/upload', uploadPost);


//****************    reportes      *****************************/
router.get('/reportes', home);
router.get('/reportes/pdf', pdf);
router.get('/reportes/excel', excel);
router.get('/reportes/csv', csv);


//****************    utiles      *****************************/
router.get('/utiles', utiles);
router.get('/utiles/mail', mail);
router.get('/utiles/jwt', jwt);
router.get('/utiles/qr', qr);
router.get('/utiles/cliente-rest', rest);


//****************    Mongo - Categorías      *****************************/
router.get('/mongo', mongo);
router.get('/mongo/categorias', categorias);
router.get('/mongo/categorias/crear', crear);
router.post('/mongo/categorias/crear', [
    body('nombre', 'Ingrese un nombre válido').trim().notEmpty().escape()
], crearPost);
router.get('/mongo/categorias/editar/:id', editar);
router.post('/mongo/categorias/editar/:id', [
    body('nombre', 'Ingrese un nombre válido').trim().notEmpty().escape()
], editarPost);
router.get('/mongo/categorias/eliminar/:id', eliminar);

//****************    Mongo - Productos      *****************************/
router.get('/mongo/productos', productos);
router.get('/mongo/productos/crear', crearProducto);
router.post('/mongo/productos/crear', [
    body('nombre', 'Ingrese un nombre válido').trim().notEmpty().escape(),
    body('precio', 'El precio es obligatorio').isNumeric().notEmpty(),
    body('descripcion', 'La descripción es obligatoria').trim().notEmpty().escape()
], crearProductoPost);
router.get('/mongo/productos/editar/:id', editarProducto);
router.post('/mongo/productos/editar/:id', [
    body('nombre', 'Ingrese un nombre válido').trim().notEmpty().escape(),
    body('precio', 'El precio es obligatorio').isNumeric().notEmpty(),
    body('descripcion', 'La descripción es obligatoria').trim().notEmpty().escape()
], editarProductoPost);
router.get('/mongo/productos/eliminar/:id', eliminarProducto);

//****************    Mongo - Productos/categoria      *****************************/
router.get('/mongo/productos/categoria/:id', productoCategoria);
//****************    Mongo - Productos/fotos      *****************************/
router.get('/mongo/productos/fotos/:id', productoFotos);
router.post('/mongo/productos/fotos/:id', productoFotosPost);
router.get('/mongo/productos/fotos/eliminar/:idProducto/:idFoto', eliminarFoto);


/*********************************   MySQL   **************************************/
router.get('/mysql', mysql);
router.get('/mysql/categorias', categoriasM);
router.get('/mysql/categorias/crear', crearM);
router.post('/mysql/categorias/crear', [
    body('nombre', 'Ingrese un nombre válido').trim().notEmpty().escape()
], crearMPost);
router.get('/mysql/categorias/editar/:id', editarM);
router.post('/mysql/categorias/editar/:id', [
    body('nombre', 'Ingrese un nombre válido').trim().notEmpty().escape()
], editarMPost);
router.get('/mysql/categorias/eliminar/:id', eliminarM);

/*********************************   MySQL/Productos   **************************************/
router.get('/mysql/productos', productosM);
router.get('/mysql/productos/crear', crearMProducto);
router.post('/mysql/productos/crear', [
    body('nombre', 'Ingrese un nombre válido').trim().notEmpty().escape(),
    body('precio', 'El precio es obligatorio').isNumeric().notEmpty(),
    body('descripcion', 'La descripción es obligatoria').trim().notEmpty().escape()
], crearMProductoPost);
router.get('/mysql/productos/editar/:id', productoEditarM);
router.post('/mysql/productos/editar/:id', [
    body('nombre', 'Ingrese un nombre válido').trim().notEmpty().escape(),
    body('precio', 'El precio es obligatorio').isNumeric().notEmpty(),
    body('descripcion', 'La descripción es obligatoria').trim().notEmpty().escape()
], productoEditarMPost);
router.get('/mysql/productos/eliminar/:id', eliminarProductoM);
/*********************************   MySQL/Productos x Categoría   **************************************/
router.get('/mysql/productos/categoria/:id', productoCategoriaM);

/*********************************   MySQL/Productos Fotos   **************************************/
router.get('/mysql/productos/fotos/:id', productoFotosM);
router.post('/mysql/productos/fotos/:id', productoFotosMPost);
router.get('/mysql/productos/fotos/eliminar/:idProducto/:idFoto', eliminarFotoM);

//Acceso
router.get('/acceso/login', login);
router.post('/acceso/login', [
    body('email', 'Ingrese un correo válido')
        .trim()
        .isEmail()
        .normalizeEmail(),
    body('password', 'Ingrese una contraseña válida')
        .trim()
        .isLength({min:6})
        .escape()
], loginPost);
router.get('/acceso/registro', registro);
router.post('/acceso/registro', [
    body('email', 'Ingrese un correo válido')
        .trim()
        .isEmail()
        .normalizeEmail(),
    body('password', 'Ingrese una contraseña válida')
        .trim()
        .isLength({min:6})
        .escape(),
    body('repassword', 'Ingrese una contraseña válida')
        .trim()
        .isLength({min:6})
        .escape(),
    body('nombre', 'Ingrese un nombre válido')
        .trim()
        .escape()
        .notEmpty()
], registroPost);
router.get('/acceso/protegida', verificarUsuario, protegida);
router.get('/acceso/protegida2', verificarUsuario, protegida2);
router.get('/acceso/salir', verificarUsuario, salir);

// Webpay
router.get('/webpay', webpay);
router.get('/webpay/pagar', pagar);
router.get('/webpay/respuesta', respuesta);

export default router;