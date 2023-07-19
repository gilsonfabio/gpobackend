const connection = require('../database/connection');
const { param } = require('../routes');

module.exports = {       
    
    async denHistorico (request, response) {
        let id = request.params.denId;

        const denHist = await connection('denhistoricos')
        .where('hdeDenId', id)
        .orderBy('hdeData', 'desc')
        .select('*');
    
        return response.json(denHist);
    },   
        
    async solHistorico (request, response) {
        let id = request.params.solId;
        
        const solHist = await connection('solhistoricos')
        .where('hsoSolId', id)
        .orderBy('hsoData', 'desc')
        .select('*');
    
        return response.json(solHist);
    },  
};