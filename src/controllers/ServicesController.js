const crypto = require('crypto');
const connection = require('../database/connection');

module.exports = {       
    
    async index (request, response) {
        const services = await connection('services')
        .orderBy('srvId')
        .select('srvId', 'srvDescricao', 'srvLink', 'srvImage');
    
        return response.json(services);
    }, 
   
};

