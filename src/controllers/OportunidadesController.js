const crypto = require('crypto');
const connection = require('../database/connection');

module.exports = {       
    
    async oportunidades (request, response) {
        let id = request.params.tipo;
        const oportunidades = await connection('oportunidades')
        .where('optTipo', id)
        .select('*');
    
        return response.json(oportunidades);
    }, 
   
    async newOportunidade(request, response) {
        const {optLocal, optValidade, optTitulo, optDescricao, optRequisitos, optLink, optTipo, optCanId} = request.body;
        let optStatus = 'A';
         
        const [optId] = await connection('oportunidades').insert({
            optLocal,
            optValidade, 
            optTitulo, 
            optDescricao, 
            optRequisitos, 
            optLink, 
            optTipo, 
            optCanId, 
            optStatus           
        });
           
        return response.json({optId});
    },
};
