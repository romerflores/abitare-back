import 'dotenv/config';

export const {
  PORT_MAIN = 10000,
  DB_PORT = 47865,
  DB_NAME = "railway",
  DB_HOST = "shortline.proxy.rlwy.net",
  DB_USER = "postgres",
  DB_PASSWORD = "rRzFIqQjOsyoxsqZYxCCYiIoHrXotljd",
  JWT_SECRET_KEY_ADMIN = "Vaciosinofunciona",
  JWT_SECRET_KEY_USER = "Chingadamadrepinchevariabledeentorno",
  JWT_SECRET_KEY_PERSONAL = "chingatumadrepazylara24f"
} = process.env;