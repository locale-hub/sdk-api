import {app} from './app';
import {config} from './configs/config';
import {configSchema} from './data/others/config.model';
import {validateObject} from './logic/middlewares/validateObject.middleware';
import {redisConnect} from './logic/services/cache-redis.service';

const validateConfig = async (): Promise<void> => {
  const isConfigValid = await validateObject(configSchema, config);
  if (!isConfigValid) {
    throw new Error('Configuration is not valid');
  }
};

const validateRedisConnection = async (): Promise<void> => {
  const isConnected = await redisConnect();
  if (!isConnected) {
    throw new Error('Connexion failure with Redis.');
  }
};

const startApp = async (): Promise<void> => {
  await validateConfig();
  await validateRedisConnection();
};

startApp()
  .then(() => {
    const port = config.app.port || 3001;
    app.listen(port, function() {
      console.log(`SDK API is listening on port ${port}!`);
    });
  })
  .catch((error: Error) => {
    console.error('Something wrong happened...');
    console.error(error);
  });
