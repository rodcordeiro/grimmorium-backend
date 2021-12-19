import knex from 'knex';
import configuration from '../../knexfile.js';
import dotenv from 'dotenv';
dotenv.config();

// @ts-ignore
const connection = knex(configuration[String(process.env.NODE_ENV)]);

export default connection;
