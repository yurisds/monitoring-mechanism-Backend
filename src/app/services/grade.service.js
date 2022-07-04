require('dotenv/config');
const {GoogleSpreadsheet} = require("google-spreadsheet")

const getAllGrade = async () => {

    try {
        
        const doc = new GoogleSpreadsheet(process.env.Spreadsheet_id);
        await doc.useServiceAccountAuth({
        client_email: process.env.client_email,
        private_key: process.env.private_key,
        });
    
        await doc.loadInfo()

        const sheet = doc.sheetsByIndex[0]; 
        
        const rows = await sheet.getRows();

        let array = {};

        rows.map( (row) => {

            let obj = {
                nome: row.nome,
                bd: row.BD,
                matrícula: row.matrícula,
                quizzes: row["nota quizzzes (15%)"],
                prova1: row["Prova 1 (35%)"],
                prova2: row["Prova 2 (35%)"],
                media: row["média geral"],
                provaFinal: row["nota final"],
                notaFinal: row["média final"],
            }

            array[row.BD] = obj;

        })

        return array;

    } catch (error) {
        throw new Error(error.message);
    }
};


const getGradeByUser = async (dbUser) => {
    try {
        
        const rows = await getAllGrade();
        return rows[dbUser];

    } catch (error) {
        throw new Error(error.message);
    }

}

module.exports = {
    getAllGrade,
    getGradeByUser
}