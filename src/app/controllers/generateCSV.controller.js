const statisticsService = require("../services/statistics.service");
const eventsService = require("../services/events.service");
const GradeService = require("../services/grade.service");
const dayjs = require("dayjs");
const path = require('path');
const csvWriter = require('csv-writer');

const util = require("../services/util.service");

const generateAllDataCSV = async (req, res) => {

    try {
        const { initialDate, finalDate, event_name } = req.query;

        if (initialDate && finalDate) {
            if(!dayjs(initialDate).isValid() || !dayjs(finalDate).isValid()){
                return res.status(400).json({ "message": "Incorrect dates" }); 
            }
        }

        const result = await eventsService.getAllEventsLogs(initialDate, finalDate, event_name);
      
        const extract = await statisticsService.getAllStatistics(result);

        const grade = await GradeService.getAllGrade();

        const dbHashs = await util.getTableHashs();

        const extractResult = extract.map((e) => {

            if(grade[e.db_name]) {
                e = {
                    ...e,
                    ...grade[e.db_name]
                }

                const dbHash =  util.changeDbNameToHash(e.db_name, dbHashs);
                e['db_name'] = dbHash;
                e['bd'] = dbHash;
                e['nome'] = "CENSURED";
            }

            return e;
        })


        let header = []

        if(extractResult.length > 0) {
            Object.keys(extractResult[0]).forEach(element => {
                header.push( {id: element, title: element })
            });
        }


        const writer = csvWriter.createObjectCsvWriter({
            path: path.resolve(__dirname, 'database.csv'),
            header: header
          });

        const writeFilePromisificado = await writer.writeRecords(extractResult);
        
        await writeFilePromisificado

        return res.status(200).json(extractResult);

    } catch (error) {
        return res.status(500).json({ error: `Ocorreu um erro: ${error.message}` });  
    }

}

module.exports = {
    generateAllDataCSV,
}