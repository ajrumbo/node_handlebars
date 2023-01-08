const verificarUsuario = (req, res, next) => {
    if(req.isAuthenticated()) return next();

    req.flash('css', 'danger');
    req.flash('mensajes', [{msg: 'Debes iniciar sesión para tener acceso a este directorio'}]);
    return res.redirect('/acceso/login');
}

export default verificarUsuario;