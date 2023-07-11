const crypto = require('crypto');
const connection = require('../database/connection');

module.exports = {       
    
    async index (request, response) {
        const tipos = await connection('tipos')
        .orderBy('tipId')
        .select('tipId', 'tipDescricao');
    
        return response.json(tipos);
    }, 
   
};
