const mysql = require('mysql2');

require('dotenv').config();

const connection = mysql
    .createConnection({
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
    })
    .promise();

// Connect to MySQL
(async () => {
    try {
        await connection.connect();
        console.log('Connected to MySQL...');
    } catch (err) {
        console.error('Error connecting to MySQL: ' + err.stack);
    }
})();

module.exports = connection;
