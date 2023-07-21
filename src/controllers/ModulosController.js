const connection = require('../database/connection');

module.exports = {       
    
    async index (request, response) {
        const modulos = await connection('modulos')
        .orderBy('modId')
        .select('modId', 'modDescricao');
    
        return response.json(modulos);
    }, 

    async iteModulos (request, response) {
        let id = request.params.idMod;
        const itens = await connection('modItens')
        .where('iteModId', id)
        .select('*');
    
        return response.json(itens);
    },    
};

