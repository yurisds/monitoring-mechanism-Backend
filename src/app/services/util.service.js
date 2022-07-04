const { Pool } = require("pg");
require('dotenv/config');

const checkDatabaseExist = async (databaseName) => {

    const credentials = {
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_USER_TEST,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
        allowExitOnIdle: true,
        max: 50,
    };

    try {
        
        const pool = new Pool(credentials);

        const now = await pool.query(`SELECT datname from pg_database where datname = '${databaseName}'; `);

        if (now.rows.length === 0) {
            return null;
        }

        return now;

    } catch (error) {
        console.log(error);
        return error;  
    }
}

function countAllOccurrences(sentence, occurrence) {

    const re = new RegExp(occurrence, 'g');
    return (sentence.current_query.toLowerCase().match(re) || []).length;

}


module.exports = {
    checkDatabaseExist,
    countAllOccurrences
}