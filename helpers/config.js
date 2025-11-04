import 'dotenv/config';

export const {
  PORT_MAIN = 10000,
  DB_PORT = 5432,
  DB_NAME = "db_multifamiliar",
  DB_HOST = "localhost",
  DB_USER = "romerproblem",
  DB_PASSWORD = "romerproblem",
  JWT_SECRET_KEY_ADMIN = "Vaciosinofunciona",
  JWT_SECRET_KEY_USER = "Chingadamadrepinchevariabledeentorno",
  JWT_SECRET_KEY_PERSONAL = "chingatumadrepazylara24f"
} = process.env;