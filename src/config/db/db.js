const { Pool } = require('pg');

const pool = new Pool({
    host: 'localhost',
    port: 5432,
    database: 'scheduling_api',
    user: 'postgres',
    password: 'savi'
});

module.exports = pool;