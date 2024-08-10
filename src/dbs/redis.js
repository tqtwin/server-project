const redis = require('redis');

const CONNECTION_STRING = process.env.REDIS_URL || 'rediss://red-cqquc9ogph6c738flg8g:tM81sZZ20oGNuJEjHbDOvEUuXpSbIFlP@oregon-redis.render.com:6379';
const connectRedis = () => {
    const client = redis.createClient({
        url: CONNECTION_STRING
    });

    client.connect().then(() => {
        console.log('Connected to Redis');
    }).catch((error) => {
        console.log(error);
    });

    return client;
}

module.exports = connectRedis();