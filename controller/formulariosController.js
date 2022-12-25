import { dir } from "console";
import { validationResult } from "express-validator";
import formidable from "formidable";
import fs, { truncateSync } from "fs";
import path from "path";
import { threadId } from "worker_threads";

const formularios = (req,res) => {
    return res.render('formularios/formularios',{tituloPagina: 'Formularios'});
}

const normal = (req,res) => {
    return res.render('formularios/normal',{tituloPagina: 'Formulario Normal'});
}

const normalPost = (req,res) => {
    const {nombre, correo, telefono} = req.body;//form-data
    
    console.log(req.body)

    const errors = validationResult(req);
    

    if(!errors.isEmpty()){
        req.flash('css', 'danger');
        req.flash('mensajes', errors.array());

        return res.redirect('/formularios/normal');
    }

    return res.send('Holi...')
}

const upload = (req,res) => {
    return res.render('formularios/upload',{tituloPagina: 'Formulario Upload'});
}

const uploadPost = (req,res) => {

    const form = new formidable.IncomingForm();
    form.maxFileSize = 100 * 1024 * 1024; //10Mb

    form.parse(req, async (err, fields, files) => {
        try {
            if(err) throw new Error ('Se produjo un error: ' + err);
            
            const file = files.foto;

            if(file.originalFilename === '') throw new Error ('No se cargó ninguna imagen');

            const imageTypes = [
                'image/jpeg',
                'image/png',
                'image/gif'
            ];

            if(!imageTypes.includes(file.mimetype)) throw new Error ('Formato de archivo no válido. Cargar imagen JPG|PNG|GIF');

            if(file.size > form.maxFileSize) throw new Error ('Tamaño máximo del archivo superado (10MB)');

            let unix = Math.round(+new Date() / 1000);

            switch (file.mimetype){
                case 'image/jpeg':
                    nombre_final = unix + '.jpg';
                    break;
                case 'image/png':
                    nombre_final = unix + '.png';
                    break;
                case 'image/gif':
                    nombre_final = unix + '.gif';
                    break;
            }

            const dirFile = path.join(`../assets/uploads/udemy/${nombre_final}`);

            fs.copyFile(file.filepath, dirFile, function(err){
                if(err) throw err;
            });

            req.flash('css', 'success');
            req.flash('mensaje', [{msg: 'Foto cargada correctamente'}]);
            return res.redirect('/formularios/upload');
        } catch (error) {
            req.flash('css', 'error');
            req.flash('mensaje', [{msg: error.message}]);
            return res.redirect('/formularios/upload');
        }
    });
}

export {
    formularios,
    normal,
    normalPost,
    upload,
    uploadPost
}