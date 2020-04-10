export type MongoConfig = {
  host: string,
  port: string | number,
  username: string,
  password: string,
  database: string
}

const config: MongoConfig = {
  host: process.env.MONGO_URL,
  port: process.env.MONGO_PORT,
  username: process.env.MONGO_USER,
  password: process.env.MONGO_PASS,
  database: process.env.MONGO_DB,
}

export default config
