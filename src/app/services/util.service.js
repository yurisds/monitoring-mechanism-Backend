const { Pool } = require("pg");
require('dotenv/config');

let hashsList = {}

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

const countAllOccurrences = (sentence, occurrence) => {

    const re = new RegExp(occurrence, 'g');
    return (sentence.current_query.toLowerCase().match(re) || []).length;

}
const generateHash = (element, tableLenght, salt) => {

    const value = (element.charCodeAt() + salt) % tableLenght

    return value;

}

const addTable = ( element, databases, salt ) => {
    const hash = generateHash(element, databases.length, salt )

    if(!hashsList[hash]) {
        hashsList[hash] = element;
    } else {
        addTable( element, databases, salt + 3)
    }

}

const tableHash = async () => {

    const credentials = {
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_USER_TEST,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
        allowExitOnIdle: true,
        max: 50,
    };

    const pool = new Pool(credentials); 

    const databases = process.env.DATABASES.split(",");

    databases.forEach(element => {

        addTable(element, databases, 0)
        
    });

    const lastIndex = await pool.query(`SELECT MAX(ID) FROM monitoreddatabases`);

    const inclement = lastIndex.rows[0].max ? parseInt(lastIndex.rows[0].max) + 1 : 1;


    await Promise.all(Object.keys(hashsList).map( async element => {

        const dbAlreadyExists = await pool.query(`SELECT * FROM monitoreddatabases where db_name = '${hashsList[element]}'`);

        if (!dbAlreadyExists.rowCount) {

            await pool.query(
                `INSERT INTO monitoreddatabases (id, db_name, db_hash) values (${parseInt(element) + inclement}, '${hashsList[element]}', ${parseInt(element) + inclement} );`
            );
        }

    }));
    
    await pool.end();

    const returnHashList = hashsList;

    hashsList = {};

    return returnHashList
}

const getTableHashs = async () => {

    const credentials = {
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_USER_TEST,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
        allowExitOnIdle: true,
        max: 50,
    };

    const pool = new Pool(credentials);
    
    const dbHashs = await pool.query(`SELECT * FROM monitoreddatabases`);

    await pool.end();

    let dbAndHash = {};
    let hashAndDb = {};


    dbHashs.rows.forEach(element => {
        dbAndHash[`${element.db_name}`] =  element.db_hash
        hashAndDb[`${element.db_hash}`] =  element.db_name
    });

    const result = {
        dbAndHash,
        hashAndDb
    }

    return result;
}

const changeDbNameToHash = (db_name, dbHashs) => {

    return dbHashs.dbAndHash[db_name];

}

const changeHashToDbName = (hash, dbHashs) => {

    return dbHashs.hashAndDb[hash];

}

module.exports = {
    checkDatabaseExist,
    countAllOccurrences,
    tableHash,
    getTableHashs,
    changeDbNameToHash,
    changeHashToDbName
}