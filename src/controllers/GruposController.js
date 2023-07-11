const connection = require('../database/connection');

module.exports = {       
    
    async index (request, response) {
        const grupos = await connection('grupos')
        .select('grpId', 'grpDescricao', 'grpCandidato');
    
        return response.json(grupos);
    }, 

    async create(request, response) {
        const {grpDescricao, grpCandidato} = request.body;
        const [grpId] = await connection('grupos').insert({
            grpDescricao, 
            grpCandidato           
        });
           
        return response.json({grpId});
    },

    async updGrupo(request, response) {
        let id = request.params.idGrp;         
        const {grpDescricao, grpCandidato} = request.body;
 
        await connection('grupos').where('grpId', id)   
        .update({
            grpDescricao, 
            grpCandidato
        });
           
        return response.status(204).send();
    },

};
