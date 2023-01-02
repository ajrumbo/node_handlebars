
import axios from "axios";



const utiles = (req,res) => {
    return res.render('utiles/utiles', {tituloPagina: 'Utiles'});
}

const rest = async (req,res) => {

    
    const datos = await axios('https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD');

    const envio = datos.data.Data;
    // console.log(envio)

    return res.render('utiles/rest', {tituloPagina: 'Cliente REST', envio});
}

export {
    utiles,
    rest
}