const index = (req,res) => {
    let nombre = "Alberth Rumbo";
    const paises = [
        {
            nombre: "Chile",
            nick: "cl"
        },
        {
            nombre: "Colombia",
            nick: "co"
        },
        {
            nombre: "Argentina",
            nick: "ar"
        },
        {
            nombre: "Perú",
            nick: "pe"
        },
        {
            nombre: "Venezuela",
            nick: "ve"
        }
    ];
    res.render('home/home',{tituloPagina: 'Index', nombre, paises});
}

export {
    index
}