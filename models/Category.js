import { Sequelize } from "sequelize";
import conectarSQL from "../config/mySqlDB.js";
import slug from "slug";

const Category = conectarSQL.define('categories', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nombre: {
            type: Sequelize.STRING(100)
        },
        slug: {
            type: Sequelize.STRING(100)
        }
    }, {
        hooks: {
            beforeCreate(category){
                category.slug = slug(category.nombre).toLowerCase();
            }
        }
    }
);


export default Category;