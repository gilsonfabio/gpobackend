const crypto = require('crypto');
const connection = require('../database/connection');

module.exports = {       
    
    async index (request, response) {
        const tipdenuncias = await connection('tipdenuncias')
        .orderBy('tdeId')
        .select('tdeId', 'tdeDescricao');
    
        return response.json(tipdenuncias);
    }, 
   
};
