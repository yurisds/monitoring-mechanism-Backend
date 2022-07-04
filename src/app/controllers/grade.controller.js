const GradeService = require("../services/grade.service");


const getAllGrade = async (req, res) => {

    try {
        
        const result = await GradeService.getAllGrade();

        return res.status(200).json(result);

    } catch (error) {
        return res.status(500).json({ error: `Ocorreu um erro: ${error.message}` });  
    }

}

const getGradeByUser = async (req, res) => {

    try {
        const { dbUser } = req.params;

        const result = await GradeService.getGradeByUser(dbUser);

        if(!result) {
            return res.status(400).json({ "message": "User not found" });
        }

        return res.status(200).json(result);

    } catch (error) {
        return res.status(500).json({ error: `Ocorreu um erro: ${error.message}` });  
    }

}


module.exports = {
    getAllGrade,
    getGradeByUser
}