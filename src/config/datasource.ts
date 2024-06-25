import knex from 'knex';
import dotenv from "dotenv";
dotenv.config();

const {
    DB_USER: user,
    DB_PWD: pass,
    DB_NAME: dbName,
    DB_SCHEMA: dbSchema,
    DB_HOST: dbHost,
    //DB_PORT: dbPort
} = process.env;

const datasource = knex({
    client: 'pg',
    connection: {
        host: dbHost,
        user: user,
        password: pass,
        database: dbName,
    },
});

export default datasource
