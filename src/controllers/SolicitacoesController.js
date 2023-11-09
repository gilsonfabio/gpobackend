const crypto = require('crypto');
const connection = require('../database/connection');

module.exports = {       
    
    async index (request, response) {
        let id = request.params.idCan;  
        const solicitacoes = await connection('solicitacoes')
        .where('solCandidato', id)
        .join('contatos', 'conId', 'solicitacoes.solContato')
        .join('tipos', 'tipId', 'solicitacoes.solTipo')
        .join('services', 'srvId', 'solicitacoes.solIdServ')
        .select(['solicitacoes.*', 'tipos.tipDescricao', 'services.srvDescricao', 'contatos.conNomCompleto']);
    
        return response.json(solicitacoes);
    }, 

    async solContato (request, response) {
        let id = request.params.idCon;
        const solicitacoes = await connection('solicitacoes')
        .where('solContato', id)
        .join('contatos', 'conId', 'solicitacoes.solContato')
        .join('tipos', 'tipId', 'solicitacoes.solTipo')
        .orderBy('solAbertura')
        .select(['solicitacoes.solId', 'solicitacoes.solTitulo', 'solicitacoes.solAbertura', 'solicitacoes.solTipo', 'solicitacoes.solNews', 'contatos.conNomCompleto', 'tipos.tipDescricao']);
    
        return response.json(solicitacoes);
    }, 
   
    async newSolicitacao(request, response) {
        const {solIdServ, solTipo, solContato, solTitulo, solDescricao, solCandidato, solEspecializacao} = request.body;
        let solStatus = 'A';
        let solAbertura = new Date();
        //console.log(request.body);

        const [solId] = await connection('solicitacoes').insert({
            solIdServ, 
            solTipo, 
            solContato, 
            solTitulo, 
            solDescricao, 
            solCandidato, 
            solEspecializacao,
            solAbertura,
            solStatus,
        });
           
        return response.json({solId});
    },
};


