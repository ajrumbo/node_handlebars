import { Router } from "express";
import { index } from "../controller/controller.js";
import { formularios, normal, normalPost } from "../controller/formulariosController.js";
import { body } from "express-validator";

const router = Router();

router.get('/',index);
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

export default router;