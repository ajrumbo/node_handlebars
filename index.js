import express from "express";
import dotenv from "dotenv";
import router from "./router/router.js";
import { create } from "express-handlebars";
import { calculadora, saludo, formatearNumero, selected } from "./helpers/helpersPrincipal.js";
import session from "express-session";
import csrf from "csurf";
import flash from "connect-flash";
import conectarDB from "./config/db.js";
import conectarSQL from "./config/mySqlDB.js";
import passport from "passport";


dotenv.config();


//Conexión Mongo
conectarDB();

//Conexión MySql
conectarSQL.sync().then( () => {
    console.log("Conectado MySql");
}).catch( error => {
    console.log(error.message);
});

const app = express();



app.use(session({
    secret: process.env.SECRET,
    saveUninitialized: false,
    resave: false,
    name: "secret-name",
    cookie: {
        expires: 600000
    }
}));

//se inicializa passport
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser((user, done) => done(null, {id: user.id, nombre: user.nombre}));
passport.deserializeUser(async (user, done) => {
    return done(null, user);
});
//habilitar el uso de los datos del formulario
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(csrf());
app.use(flash());

//Se declara la variable que define la extensión de los archivos de vista
const hbs = create({
    extname: '.hbs',
    partialsDir: ['./views/components'],
    helpers: {
        calculadora,
        saludo,
        formatearNumero,
        selected
    }
});
//Se declara handlebars como el motor de las vistas
app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');
//Se declara la ubicación de las vistas
app.set('views','./views');
//Se declara la ubicación de todos los recursos estáticos de la página(css, javascript, fuentes, imágenes, etc.)
app.use(express.static('./assets'));

//Se declaran las variables locales(globales) que se van a usar en todo el proyecto
app.use((req,res,next) => {
    res.locals.variable = "ola k ase?";
    res.locals.csrfToken = req.csrfToken();
    res.locals.css = req.flash("css");
    res.locals.mensajes = req.flash("mensajes");

    //Solo para trabajar con handlebars
    if(req.isAuthenticated()){
        res.locals.userId = req.user.id;
        res.locals.userName = req.user.nombre;
    }

    next();
});

app.use('/', router);

app.use((req, res) => {
    res.status(404).render('error/error');
});

app.listen(process.env.PORT, () => {
    console.log('Corriendo')
});