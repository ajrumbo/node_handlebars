import { Router } from "express";
import { index } from "../controller/controller.js";
import { formularios, normal, normalPost, upload, uploadPost } from "../controller/formulariosController.js";
import { body } from "express-validator";
import { utiles, rest } from "../controller/utilesController.js";
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
    eliminarProducto
} from "../controller/mongoController.js";

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


//****************    utiles      *****************************/
router.get('/utiles', utiles);
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

export default router;