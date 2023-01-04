import nodemailer from "nodemailer";
import jwtSimple from "jwt-simple";
import moment from "moment";
import codigoQR from "qrcode";
import axios from "axios";



const utiles = (req,res) => {
    return res.render('utiles/utiles', {tituloPagina: 'Utiles'});
}


const mail = async (req,res) => {
    const transport = nodemailer.createTransport({
        host: process.env.EHOST,
        port: process.env.EPORT,
        auth: {
            user: process.env.EUSER,
            pass: process.env.EPASS
        }
    });

    await transport.sendMail({
        from: `"Ejemplo Node" <${process.env.EUSER}>`,
        to: 'ajrumbo29@gmail.com',
        subject: 'Email de prueba',
        html: `
            <h1>Título del correo</h1>
            <p>Párrafo del correo</p>    
        `
    });

    req.flash('css', 'success');
    req.flash('mensaje', [{msg: 'Mensaje enviado correctamente'}]);
    return res.redirect('/utiles');
}

const jwt = async (req,res) => {
    let payload = {
        sub: 1,
        nombre: 'Alberth',
        correo: 'ajrumbo@hotmail.com',
        iat: moment().unix(),
        exp: moment().add(30, 'days').unix()
    };

    let token = jwtSimple.encode(payload, process.env.SECRET)
    let decoded = jwtSimple.decode(token, process.env.SECRET)

    res.send(`Token ${token} 
    
    Decodificado: ${decoded}`)
}

const qr = (req,res) => {

    const url = 'https://twitter.com/ajrumbo';

    codigoQR.toDataURL(url, (err, src) => {
        if(err) res.send('Ocurrió un error');

        return res.render('utiles/qr', { tituloPagina: 'Código QR', src });
    });
    
}

const rest = async (req,res) => {

    
    const datos = await axios('https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD');

    const envio = datos.data.Data;
    // console.log(envio)

    return res.render('utiles/rest', {tituloPagina: 'Cliente REST', envio});
}

export {
    utiles,
    mail,
    jwt,
    qr,
    rest
}