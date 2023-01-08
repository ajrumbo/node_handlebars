import { Sequelize } from "sequelize";
import conectarSQL from "../config/mySqlDB.js";
import bcrypt from "bcryptjs";

const User = conectarSQL.define('users', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: Sequelize.STRING(100)
    },
    email: {
        type: Sequelize.STRING(100)
    },
    password: {
        type: Sequelize.STRING(100)
    }
},{
    hooks: {
        async beforeCreate(user){
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(user.password, salt);
            user.password = hash;
        }
    }
});

export default User;