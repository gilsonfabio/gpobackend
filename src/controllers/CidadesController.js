const connection = require('../database/connection');

module.exports = {       
    
    async index (request, response) {
        const cidades = await connection('cidades')
        .select('cidDescricao', 'cidUfId', 'cidCodIbge');
    
        return response.json(cidades);
    }, 

    async create(request, response) {
        const {cidDescricao, cidUfId, cidCodIbge} = request.body;
        const [cidade] = await connection('cidades').insert({
            cidDescricao, 
            cidUfId,
            cidCodIbge             
        });
           
        return response.json({cidade});
    },

    async updCidade(request, response) {
        let id = request.params.idCid;         
        const {cidDescricao, cidUfId} = request.body;
        await connection('cidades').where('cidCodIbge', id)   
        .update({
            cidDescricao, 
            cidUfId            
        });
           
        return response.status(204).send();
    },

};
