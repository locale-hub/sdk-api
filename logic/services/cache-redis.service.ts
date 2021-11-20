import redis, {RedisClient} from 'redis';
import {config} from '../../configs/config';

let client: RedisClient;

export const redisConnect = async (): Promise<boolean> => new Promise((resolve, _reject) => {
  client = redis.createClient({
    url: config.redis.uri,
  });

  client.on('connect', () => {
    resolve(true);
  });

  client.on('error', (error) => {
    console.error(error);
    resolve(false);
  });
});

export const redisGet = async <T>(key: string): Promise<T | null> => new Promise((resolve, _reject) => {
  client.get(key, (err, result) => {
    if (null !== err) {
      return resolve(null);
    }

    resolve(
      null === result ? null : JSON.parse(result) as T,
    );
  });
});
