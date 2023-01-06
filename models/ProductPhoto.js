import { Sequelize } from "sequelize";
import conectarSQL from "./config/mySqlDB.js";
import Product from "./Product.js";

const ProductPhoto = conectarSQL.define('productPhotos', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: Sequelize.STRING(100)
    }
});

ProductPhoto.belongsTo(Product, {foreignKey: 'idProducto'});

export default ProductPhoto;