const crypto = require('crypto');
const connection = require('../database/connection');

module.exports = {       
    
    async index (request, response) {
        const subtipos = await connection('subTipDenuncias')
        .orderBy('stdId')
        .select('stdId', 'stdDescricao');
    
        return response.json(subtipos);
    }, 
   
};
