const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'trill',
    password: 'mysqlpassword'
})

module.exports = pool.promise();