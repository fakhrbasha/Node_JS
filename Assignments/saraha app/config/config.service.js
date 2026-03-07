import { resolve } from "node:path"
import dotenv from "dotenv";



const NODE_ENV = process.env.NODE_ENV


let NODE_PATH = {
    development: ".env.development",
    production: ".env.production"
}
dotenv.config({ path: resolve(`config/${NODE_PATH[NODE_ENV]}`) })

export const PORT = +process.env.PORT

export const SALT_ROUND = +process.env.SALT_ROUND
export const DB_URI = process.env.DB_URI
export const ACCESS_SECRET_KEY = process.env.ACCESS_SECRET_KEY
export const REFRESH_SECRET_KEY = process.env.REFRESH_SECRET_KEY
export const PREFIX = process.env.PREFIX