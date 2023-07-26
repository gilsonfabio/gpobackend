const connection = require('../database/connection');
const { param } = require('../routes');

module.exports = {       
    
    async denHistorico (request, response) {
        let id = request.params.denId;

        const denHist = await connection('denhistoricos')
        .where('hdeDenId', id)
        .orderBy('hdeData', 'desc')
        .select('*');
    
        let qtdNews = 0;
        await connection('denuncias').where('denId', id)   
        .update({
            denNews: qtdNews                
        });

        return response.json(denHist);
    },   
        
    async solHistorico (request, response) {
        let id = request.params.solId;
        
        const solHist = await connection('solhistoricos')
        .where('hsoSolId', id)
        .orderBy('hsoData', 'desc')
        .select('*');

        let qtdNews = 0;
        await connection('solicitacoes').where('solId', id)   
        .update({
            solNews: qtdNews                
        });
    
        return response.json(solHist);
    },  
};