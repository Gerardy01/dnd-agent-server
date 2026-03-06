import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(
    process.env.DB_NAME?.toString() || "",
    process.env.DB_USER?.toString() || "",
    process.env.DB_PASSWORD?.toString() || "",
    {
        host: process.env.DB_HOST?.toString() || "",
        port: Number(process.env.DB_PORT),
        dialect: 'postgres',
        logging: false,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000,
        },
    }
);

export default sequelize;