const connection = require('../database/connection');

module.exports = {       
    
    async index (request, response) {
        const estados = await connection('estados')
        .select('ufId', 'ufDescricao');
    
        return response.json(estados);
    }, 

    async create(request, response) {
        const {ufDescricao} = request.body;
        const [ufId] = await connection('estados').insert({
            ufDescricao,                         
        });
           
        return response.json({ufId});
    },

    async updEstado(request, response) {
        let id = request.params.idUf;         
        const {ufDescricao} = request.body;
 
        await connection('estados').where('ufId', id)   
        .update({
            ufDescricao, 
        });
           
        return response.status(204).send();
    },   
    
};
