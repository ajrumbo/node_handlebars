import axios from "axios";

const webpay = (req, res) => {
    return res.render('webpay/webpay',{tituloPagina: 'Webpay Transbank'})
}

const pagar = async (req, res) => {
    
    const data = {
        "buy_order": "ordenCompra12345678",
        "session_id": "sesion1234557545",
        "amount": 10000,
        "return_url": "http://localhost:4000/webpay/respuesta"
    }
    
    const headers = { "Content-Type": "application/json", "Tbk-Api-Key-Id": process.env.WEBPAY_ID, "Tbk-Api-Key-Secret": process.env.WEBPAY_SECRET }
    

    const respuesta = await axios.post(process.env.WEBPAY_URL, data, {headers});
    const datos = respuesta.data;
    return res.render('webpay/pagar',{tituloPagina: 'Webpay Transbank', datos});
}

const respuesta = async (req, res) => {
    const { token_ws } = req.query;
    
    const headers = { "Content-Type": "application/json", "Tbk-Api-Key-Id": process.env.WEBPAY_ID, "Tbk-Api-Key-Secret": process.env.WEBPAY_SECRET }

    const respuesta = await axios.put(`${process.env.WEBPAY_URL}/${token_ws}`, {}, {headers});
    const datos = respuesta.data;
    
    return res.render('webpay/respuesta',{tituloPagina: 'Webpay Transbank', datos, token_ws});

}


export {
    webpay,
    pagar,
    respuesta
}