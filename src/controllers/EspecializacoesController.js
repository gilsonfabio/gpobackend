const crypto = require('crypto');
const connection = require('../database/connection');

module.exports = {       
    
    async index (request, response) {
        const especializacoes = await connection('especializacoes')
        .orderBy('espId')
        .select('espId', 'espDescricao');
    
        return response.json(especializacoes);
    }, 
   
};
