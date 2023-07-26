const connection = require('../database/connection');
const { param } = require('../routes');

module.exports = {       
    
    async index (request, response) {
        const candidato = await connection('candidatos')
        .select('*');
    
        return response.json(candidato);
    },    

    async searchCandidato (request, response) {
        let key = request.params.candidato;

        //console.log(key);

        const candidato = await connection('candidatos')
        .where('canKey', key)
        .select('*');
    
        //console.log(candidato)

        return response.json(candidato);
    },    
};