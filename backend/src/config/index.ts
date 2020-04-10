import { config } from 'dotenv'

type EnvType = {
  test: string,
  development: string,
  production: string
}

const env: EnvType = {
  test: '.env.test',
  development: '.env.dev',
  production: '.env'
}

config({ path: env[process.env.NODE_ENV] })
