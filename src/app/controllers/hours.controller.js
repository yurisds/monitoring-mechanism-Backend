const dayjs = require("dayjs");
const resultQuery = require("../services/events.service");
const util = require("../services/util.service");


const getHoursIntervalsByDatabase = async (req, res) => {

    const { databaseName } = req.params;

    const { initialDate, finalDate, event_name } = req.query;

    if (initialDate && finalDate) {
        if(!dayjs(initialDate).isValid() || !dayjs(finalDate).isValid()){
            return res.status(400).json({ "message": "Incorrect dates" }); 
        }
    }

    const checkDatabase = await util.checkDatabaseExist(databaseName);

    if (!checkDatabase) {
        return res.status(400).json({ "message": "Database not exist" });
    }

    const result = await resultQuery.getHoursEventsLogsByDatabase(databaseName, initialDate, finalDate, event_name);

    if (!result) {
        return res.status(400).json({ "message": "Database already exists" });
    }

    const array = result.array;
    const set = new Set(array);

    const arr = Array.from(set);

    arr.sort( (a, b) => {
        if (a > b) {
            return 1;
          }
          if (a < b) {
            return -1;
          }
          return 0; 
    })

    let count = 0;
    let last = null;

    arr.forEach( (i) => {

        if(!last) {
            last = i;
            count = 1;
        }else {

            const actual = dayjs(i);
            const auxLast = dayjs(last);

            const diff = actual.diff(auxLast, "minutes", true);

            const totalHours = parseInt(diff / 60);

            if (totalHours >= 1) {
                count++;

            }
            last = i;

        }
    });

    const aux = {
        studySessions: count,
        totalRegisters: array.length,
        realRegisters: set.size,
        ...result
    }

    return res.status(200).json(aux);

}


module.exports = {
    getHoursIntervalsByDatabase
}