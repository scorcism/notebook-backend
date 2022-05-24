const mysql = require('mysql');

const db = mysql.createConnection({
    // user:"root",
    // host :"localhost",
    // password:"root",
    // database:"notebook"
    user: "sql6494804",
    host: "sql6.freemysqlhosting.net",
    password: "TUHqKfTTZe",
    database: "sql6494804"
})


module.exports = db;