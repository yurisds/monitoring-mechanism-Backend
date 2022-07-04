const resultQuery = require("../services/events.service");
const util = require("../services/util.service");
const dayjs = require("dayjs");

const getAllEventsLogs = async (req, res) => {

    try {
        
        const { initialDate, finalDate, event_name } = req.query;

        if (initialDate && finalDate) {
            if(!dayjs(initialDate).isValid() || !dayjs(finalDate).isValid()){
                return res.status(400).json({ "message": "Incorrect dates" }); 
            }
        }

        const result = await resultQuery.getAllEventsLogs(initialDate, finalDate, event_name);

        return res.status(200).json(result);

    } catch (error) {
        return res.status(500).json({ error: `Ocorreu um erro: ${error.message}` });  
    }

}

const getEventsLogsByDatabase = async (req, res) => {

    try {
        
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

        const result = await resultQuery.getEventsLogsByDatabase(databaseName, initialDate, finalDate, event_name);

        if (!result) {
            return res.status(400).json({ "message": "Database already exists" });
        }
        return res.status(200).json(result);

    } catch (error) {
        return res.status(500).json({ error: `Ocorreu um erro: ${error.message}` });  
    }
}


module.exports = {
    getAllEventsLogs,
    getEventsLogsByDatabase
}