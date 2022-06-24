require('dotenv/config');
const { Pool } = require("pg");
const dayjs = require("dayjs");

const aux = process.env.DATABASES

const getEventsLogs = async (
  credentials,
  initialDate,
  finalDate,
  event_name
) => {
  const pool = new Pool(credentials);

  let now;

  if (initialDate && finalDate) {

    
    if (event_name) {
      now = await pool.query(
        `SELECT * from auditTable.tab_event_logs WHERE date_time BETWEEN '${initialDate}' AND '${finalDate}' AND event_name = '${event_name}';`
      );
    } else {
      now = await pool.query(
        `SELECT * from auditTable.tab_event_logs WHERE date_time BETWEEN '${initialDate}' AND '${finalDate}';`
      );
    }
  } else {
    if (event_name) {
      now = await pool.query(
        `SELECT * from auditTable.tab_event_logs WHERE event_name = '${event_name}';`
      );
    } else {
      now = await pool.query("SELECT * from auditTable.tab_event_logs;");
    }
  }
  
  await pool.end();

  return now;
};

const getAllEventsLogs = async (initialDate, finalDate, event_name) => {
  let result = [];

  listaux = aux.split(",");
  
  await Promise.all(
    listaux.map(async (db) => {
      let credentials = {
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: db,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
      };

      const poolResult = await getEventsLogs(
        credentials,
        initialDate,
        finalDate,
        event_name
      );

      result.push({
        database: db,
        array: poolResult.rows,
      });
    })
  );

  return result;
};

const getEventsLogsByDatabase = async (
  databaseName,
  initialDate,
  finalDate,
  event_name
) => {
  const credentials = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: databaseName,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  };

  const poolResult = await getEventsLogs(
    credentials,
    initialDate,
    finalDate,
    event_name
  );

  let array = [];

  await poolResult.rows.map((row) => {
    if (
      row.event_name !== "CREATE TRIGGER" &&
      row.event_name !== "CREATE FUNCTION" &&
      row.event_name !== "DROP FUNCTION" &&
      row.event_name !== "GRANT"
    ) {
      array.push(row);
    }
  });

  const result = {
    database: databaseName,
    array,
  };

  return result;
};

const getHoursEventsLogsByDatabase = async (
  databaseName,
  initialDate,
  finalDate,
  event_name
) => {
  const credentials = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: databaseName,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  };

  const poolResult = await getEventsLogs(
    credentials,
    initialDate,
    finalDate,
    event_name
  );

  let array = [];

  await poolResult.rows.map((row) => {
    if (
      row.event_name !== "CREATE TRIGGER" &&
      row.event_name !== "CREATE FUNCTION" &&
      row.event_name !== "DROP FUNCTION" &&
      row.event_name !== "GRANT"
    ) {
      array.push(dayjs(row.date_time).format("YYYY-MM-DDThh:mm:ss"));
    }
  });

  const result = {
    database: databaseName,
    array,
  };

  return result;
};

module.exports = {
  getAllEventsLogs,
  getEventsLogsByDatabase,
  getHoursEventsLogsByDatabase,
};
