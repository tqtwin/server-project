const redis = require('redis');

const CONNECTION_STRING = process.env.REDIS_URL || 'redis://localhost:6379';

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