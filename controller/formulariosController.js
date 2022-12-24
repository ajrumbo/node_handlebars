import { validationResult } from "express-validator";

const formularios = (req,res) => {
    return res.render('formularios/formularios',{tituloPagina: 'Formularios'});
}

const normal = (req,res) => {
    return res.render('formularios/normal',{tituloPagina: 'Formulario Normal'});
}

const normalPost = (req,res) => {
    const {nombre, correo, telefono} = req.body;//form-data
    
    const errors = validationResult(req);
    

    if(!errors.isEmpty()){
        req.flash('css', 'danger');
        req.flash('mensajes', errors.array());

        return res.redirect('/formularios/normal');
    }

    return res.send('Holi...')
}

export {
    formularios,
    normal,
    normalPost
}