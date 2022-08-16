const GradeService = require("../services/grade.service");
const util = require("../services/util.service");

const getAllGrade = async (req, res) => {

    try {
        
        const result = await GradeService.getAllGrade();

        const dbHashs = await util.getTableHashs();

        resultEvents = {};

        Object.keys(result).forEach( (e) => {

            let aux = result[e];

            const hash = util.changeDbNameToHash(e, dbHashs);

            aux.bd = hash;
            aux.nome = "CENSURED";

            resultEvents[hash] = aux
        })

        return res.status(200).json(resultEvents);

    } catch (error) {
        return res.status(500).json({ error: `Ocorreu um erro: ${error.message}` });  
    }

}

const getGradeByUser = async (req, res) => {

    try {
        let { dbUser } = req.params;

        const dbHashs = await util.getTableHashs();

        dbUser = util.changeHashToDbName(dbUser, dbHashs);

        let result = await GradeService.getGradeByUser(dbUser);

        if(!result) {
            return res.status(400).json({ "message": "User not found" });
        }

        result['bd'] = util.changeDbNameToHash(dbUser, dbHashs);
        result['nome'] = "CENSURED";

        return res.status(200).json(result);

    } catch (error) {
        return res.status(500).json({ error: `Ocorreu um erro: ${error.message}` });  
    }

}


module.exports = {
    getAllGrade,
    getGradeByUser
}