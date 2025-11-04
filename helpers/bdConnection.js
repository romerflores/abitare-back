import { Pool } from "pg";

//Variables de entorno
import { DB_HOST, DB_PASSWORD, DB_PORT, DB_USER, DB_NAME} from "./config.js";

export const db_pool = new Pool({
    user: DB_USER,
    host: DB_HOST,
    password: DB_PASSWORD,
    port: DB_PORT,
    database: DB_NAME
})
