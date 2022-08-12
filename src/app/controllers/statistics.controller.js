const statisticsService = require("../services/statistics.service");
const eventsService = require("../services/events.service");
const dayjs = require("dayjs");

const path = require('path');
const csvWriter = require('csv-writer');

const util = require("../services/util.service");

const getAllStatistics = async (req, res) => {

    try {
        const { initialDate, finalDate, event_name } = req.query;

        if (initialDate && finalDate) {
            if(!dayjs(initialDate).isValid() || !dayjs(finalDate).isValid()){
                return res.status(400).json({ "message": "Incorrect dates" }); 
            }
        }

        const result = await eventsService.getAllEventsLogs(initialDate, finalDate, event_name);

        const extract = await statisticsService.getAllStatistics(result);

        return res.status(200).json(extract);

    } catch (error) {
        return res.status(500).json({ error: `Ocorreu um erro: ${error.message}` });  
    }

}

const generateAllStatisticsCSV = async (req, res) => {

    try {
        const { initialDate, finalDate, event_name } = req.query;

        if (initialDate && finalDate) {
            if(!dayjs(initialDate).isValid() || !dayjs(finalDate).isValid()){
                return res.status(400).json({ "message": "Incorrect dates" }); 
            }
        }

        const result = await eventsService.getAllEventsLogs(initialDate, finalDate, event_name);

        const extract = await statisticsService.getAllStatistics(result);

        let header = []

        if(extract.length > 0) {
            Object.keys(extract[0]).forEach(element => {
                header.push( {id: element, title: element })
            });
        }


        const writer = csvWriter.createObjectCsvWriter({
            path: path.resolve(__dirname, 'db_comands.csv'),
            header: header
          });

        const writeFilePromisificado = await writer.writeRecords(extract);
        
        await writeFilePromisificado

        return res.status(200).json(extract);

    } catch (error) {
        return res.status(500).json({ error: `Ocorreu um erro: ${error.message}` });  
    }

}

const getStatisticsByDatabase = async (req, res) => {

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

    const result = await eventsService.getEventsLogsByDatabase(databaseName, initialDate, finalDate, event_name);

    if (!result) {
        return res.status(400).json({ "message": "Database already exists" });
    }

    const extract = await statisticsService.getStatisticsByDatabase(result);

    return res.status(200).json(extract);

}


module.exports = {
    getAllStatistics,
    getStatisticsByDatabase,
    generateAllStatisticsCSV
}