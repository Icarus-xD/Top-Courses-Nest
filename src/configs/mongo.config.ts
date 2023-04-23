import { ConfigService } from "@nestjs/config";
import { TypegooseModuleOptions } from "nestjs-typegoose";

const getMongoUri = (configService: ConfigService) => {
  const login = configService.get('MONGO_LOGIN');
  const password = configService.get('MONGO_PASSWORD');
  const host = configService.get('MONGO_HOST');
  const port = configService.get('MONGO_PORT');
  const authDb = configService.get('MONGO_AUTHDATABASE');

  // console.log(`mongodb://${login}:${password}@${host}:${port}/?authSource=${authDb}`);
  return `mongodb://${host}:${port}`;
  // return configService.get('MONGO_URI');
};

const getMongoOptions = (): Partial<TypegooseModuleOptions> => ({});

export const getMongoConfig = async (
  configService: ConfigService,
): Promise<TypegooseModuleOptions> => {
  return {
    uri: getMongoUri(configService),
    // ...getMongoOptions(),
  };
}; 