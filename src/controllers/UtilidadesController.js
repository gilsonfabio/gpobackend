const crypto = require('crypto');
const connection = require('../database/connection');

module.exports = {       
    
    async index (request, response) {
        const utilidades = await connection('utilidades')
        .orderBy('utlId')
        .select('utlId', 'utlDescricao', 'utlLink', 'utlImage');
    
        return response.json(utilidades);
    }, 
   
};
