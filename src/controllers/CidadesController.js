const connection = require('../database/connection');

module.exports = {       
    
    async index (request, response) {
        const cidades = await connection('cidades')
        .select('cidId', 'cidDescricao', 'cidUfId', 'cidCodIbge');
    
        return response.json(cidades);
    }, 

    async create(request, response) {
        const {cidDescricao, cidUfId, cidCodIbge} = request.body;
        const [cidId] = await connection('cidades').insert({
            cidDescricao, 
            cidUfId,
            cidCodIbge             
        });
           
        return response.json({cidId});
    },

    async updCidade(request, response) {
        let id = request.params.idCid;         
        const {cidDescricao, cidUfId, cidCodIbge} = request.body;
 
        await connection('cidades').where('cidId', id)   
        .update({
            cidDescricao, 
            cidUfId,
            cidCodIbge
        });
           
        return response.status(204).send();
    },

};
