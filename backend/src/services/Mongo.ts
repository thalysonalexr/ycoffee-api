import mongoose from 'mongoose'

import config, { MongoConfig } from '@config/mongo'

export class Mongo {
  private _urlConnection: string
  private static _instance: Mongo | null = null

  private constructor(config: MongoConfig) {
    this._urlConnection = Mongo.createUrl(config)
  }

  public static createUrl(config: MongoConfig): string {
    return `mongodb://${config.username}:${config.password}@${config.host}:${config.port}/${config.database}`;
  }

  public static getInstance(config: MongoConfig): Mongo {
    if (null === Mongo._instance) {
      Mongo._instance = new Mongo(config)
    }
    return Mongo._instance
  }

  public connect() {
    mongoose.connect(this._urlConnection, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    }).then(() => {
      console.log('Mongo database is connected...')
    }).catch(err => {
      console.log(err);
    })
  }
}

export default Mongo.getInstance(config).connect();
