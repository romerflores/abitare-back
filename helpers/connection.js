/* const { Sequelize } = require('sequelize');
require('dotenv').config(); */

import { Sequelize } from 'sequelize';
import 'dotenv/config.js';


export const sequelize = new Sequelize(
process.env.DB_NAME || 'db_multifamiliar',
process.env.DB_USER || 'romerproblem',
process.env.DB_PASSWORD ? String(process.env.DB_PASSWORD) : "romerproblem",
{
host: process.env.DB_HOST || 'localhost',
port: process.env.DB_PORT || 5432,
dialect: 'postgres',
logging: false // cambiar a true para ver queries
}
);

