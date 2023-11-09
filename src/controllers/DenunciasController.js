const crypto = require('crypto');
const connection = require('../database/connection');

module.exports = {       
    
    async index (request, response) {
        let id = request.params.idCan;  
        const denuncias = await connection('denuncias')
        .where('denCandidato', id)
        .join('contatos', 'conId', 'denuncias.denConId')
        .join('tipdenuncias', 'tdeId', 'denuncias.denTipo')
        .join('subTipDenuncias', 'stdId', 'denuncias.denSubId')
        .orderBy('denData')
        .select(['denuncias.denId', 'denuncias.denDescricao', 'denuncias.denData', 'denuncias.denTipo', 'denuncias.denNews', 'denuncias.denSubId', 'contatos.conNomCompleto', 'tipdenuncias.tdeDescricao', 'subTipDenuncias.stdDescricao']);
    
        return response.json(denuncias);    

    },

    async denContato (request, response) {
        let id = request.params.idCon;
        const denuncias = await connection('denuncias')
        .where('denConId', id)
        .join('contatos', 'conId', 'denuncias.denConId')
        .join('tipdenuncias', 'tdeId', 'denuncias.denTipo')
        .join('subTipDenuncias', 'stdId', 'denuncias.denSubId')
        .orderBy('denData')
        .select(['denuncias.denId', 'denuncias.denDescricao', 'denuncias.denData', 'denuncias.denTipo', 'denuncias.denNews', 'denuncias.denSubId', 'contatos.conNomCompleto', 'tipdenuncias.tdeDescricao', 'subTipDenuncias.stdDescricao']);
    
        return response.json(denuncias);
    }, 
   
    async newDenuncia(request, response) {
        const {denTipo, denSubId, denDescricao, denCandidato, denNome, denConId, denFonContato} = request.body;
        let denStatus = 'A';
        let denData = new Date();
        
        const [denId] = await connection('denuncias').insert({
            denData,
            denTipo, 
            denSubId, 
            denDescricao, 
            denStatus, 
            denCandidato, 
            denNome, 
            denConId, 
            denFonContato          
        });
           
        return response.json({denId});
    },

    async tipDenuncias(request, response) {
        const tipdenuncias = await connection('tipdenuncias')
        .orderBy('tdeId')
        .select('tdeId', 'tdeDescricao');
    
        return response.json(tipdenuncias);
    },

    async subTipDenuncias(request, response) {
        const subtipos = await connection('subTipDenuncias')
        .orderBy('stdId')
        .select('stdId', 'stdDescricao');
    
        return response.json(subtipos);
    },
};
