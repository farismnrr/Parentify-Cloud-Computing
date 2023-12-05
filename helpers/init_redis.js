const redis = require('redis');

// Initialize a Redis client
const redisClient = redis.createClient({
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || 6379,
    // Add other configuration options as needed
});

// Handle Redis connection events
redisClient.on('connect', () => {
    console.log('Connected to Redis');
});

redisClient.on('error', (err) => {
    console.error(`Redis connection error: ${err}`);
});

module.exports = redisClient;
