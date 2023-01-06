import { Sequelize } from "sequelize";

const conectarSQL = new Sequelize('node_udemy','root','root1234',
    {
        host: 'localhost',
        dialect: 'mysql',
        port: '3306',
        logging: false,
        define: {
            timestamps: false
        },
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
);


export default conectarSQL;