declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test'
    PORT: string
    BASE_URL: string
    API_NAME: string
    MONGO_URL: string
    MONGO_PORT: string
    MONGO_USER: string
    MONGO_PASS: string
    MONGO_DB: string
    UPLOAD_TYPE: 'local'
    UPLOAD_PATH: string
    UPLOAD_SIZE: string
    SECRET: string
  }
}
