const util = require("../services/util.service");

const addDatabases = async (req, res) => {

    try {

        const tableHash = await util.tableHash();

        return res.status(200).json(tableHash);

    } catch (error) {
        return res.status(500).json({ error: `Ocorreu um erro: ${error.message}` });  
    }

}

const getHashs = async (req, res) => {

    try {

        const tableHash = await util.getTableHashs();

        return res.status(200).json(tableHash);

    } catch (error) {
        return res.status(500).json({ error: `Ocorreu um erro: ${error.message}` });  
    }

}

module.exports = {
    addDatabases,
    getHashs
}