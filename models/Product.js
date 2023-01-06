import { Sequelize } from "sequelize";
import conectarSQL from "./config/mySqlDB.js";
import slug from "slug";
import Category from "./Category.js";

const Product = conectarSQL.define('products', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: Sequelize.STRING(100)
    },
    precio: {
        type: Sequelize.INTEGER(11)
    },
    descripcion: {
        type: Sequelize.TEXT('long')
    },
    slug: {
        type: Sequelize.STRING(100)
    }
}, {
    hooks: {
        beforeCreate(product){
            product.slug = slug(product.nombre).toLowerCase();
        }
    }
});

Product.belongsTo(Category, {foreignKey: 'idCategoria'});

export default Product;