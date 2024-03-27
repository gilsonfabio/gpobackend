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
        .limit(10)
        .orderBy('solId', 'desc')
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

    async busSolicitacao (request, response) {
        let id = request.params.idSol;
        console.log('Solicitacao Id:', id)
        const solicitacao = await connection('solicitacoes')
        .where('solId', id)
        .join('contatos', 'conId', 'solicitacoes.solContato')
        .join('tipos', 'tipId', 'solicitacoes.solTipo')
        .orderBy('solAbertura')
        .select([
            'solicitacoes.*', 
            'contatos.conNomCompleto', 
            'contatos.conCpf',
            'contatos.conEmail',
            'contatos.conCelular',
            'contatos.conId',
            'contatos.conCandidato',  
            'tipos.tipDescricao']);
    
        console.log(solicitacao)
            
        return response.json(solicitacao);
    }, 
   
    async newSolicitacao(request, response) {
        const {solIdServ, solTipo, solContato, solTitulo, solDescricao, solCandidato, solEspecializacao, solPrioridade} = request.body;
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
            solPrioridade,
            solAbertura,
            solStatus,
        });
           
        return response.json({solId});
    },

    async searchSolicitacoes (request, response) {
        const {
            candidato,
            contato,
            abertura,
            tipos} = request.body;

        //console.log(request.body);
        
        let status = "A" 

        if (!contato && !abertura && !tipos) { 
            //console.log('opção-1')   
            const solicitacao = await connection('solicitacoes')
            .where('solCandidato', candidato )
            .where('conStatus', status)
            .join('contatos', 'conId', 'solicitacoes.solContato')
            .join('tipos', 'tipId', 'solicitacoes.solTipo')
            .join('services', 'srvId', 'solicitacoes.solIdServ')
            .orderBy('solAbertura', 'desc')
            .select(['solicitacoes.*', 'tipos.tipDescricao', 'services.srvDescricao', 'contatos.conNomCompleto']);

            if (!solicitacao) {
                return response.status(404).send({erro: true, msn: 'Solicitações não localizadas!'});
            }
    
            return response.json(solicitacao);
        }else {
            if (contato && !abertura && !tipos) {
                //console.log('opção-2')   
                const solicitacao = await connection('solicitacoes')
                .where('solCandidato', candidato )
                .where('solContato', contato)
                .where('conStatus', status)
                .join('contatos', 'conId', 'solicitacoes.solContato')
                .join('tipos', 'tipId', 'solicitacoes.solTipo')
                .join('services', 'srvId', 'solicitacoes.solIdServ')
                .orderBy('solAbertura', 'desc')
                .select(['solicitacoes.*', 'tipos.tipDescricao', 'services.srvDescricao', 'contatos.conNomCompleto']);

                if (!solicitacao) {
                    return response.status(404).send({erro: true, msn: 'Solicitações não localizadas!'});
                }
        
                return response.json(solicitacao);
            }else {
                if (!contato && abertura && !tipos) {
                    //console.log('opção-3')   
                    const solicitacao = await connection('solicitacoes')
                    .where('solCandidato', candidato )
                    .where('solAbertura', abertura)
                    .where('conStatus', status)
                    .join('contatos', 'conId', 'solicitacoes.solContato')
                    .join('tipos', 'tipId', 'solicitacoes.solTipo')
                    .join('services', 'srvId', 'solicitacoes.solIdServ')
                    .orderBy('solAbertura', 'desc')
                    .select(['solicitacoes.*', 'tipos.tipDescricao', 'services.srvDescricao', 'contatos.conNomCompleto']);

                    if (!solicitacao) {
                        return response.status(404).send({erro: true, msn: 'Solicitações não localizadas!'});
                    }
        
                    return response.json(solicitacao);
                }else {
                    if (!contato && !abertura && tipos) {
                        //console.log('opção-4')   
                        const solicitacao = await connection('solicitacoes')
                        .where('solCandidato', candidato )
                        .where('solTipo', tipos)
                        .where('conStatus', status)
                        .join('contatos', 'conId', 'solicitacoes.solContato')
                        .join('tipos', 'tipId', 'solicitacoes.solTipo')
                        .join('services', 'srvId', 'solicitacoes.solIdServ')
                        .orderBy('solAbertura', 'desc')
                        .select(['solicitacoes.*', 'tipos.tipDescricao', 'services.srvDescricao', 'contatos.conNomCompleto']);

                        if (!solicitacao) {
                            return response.status(404).send({erro: true, msn: 'Solicitações não localizadas!'});
                        }
        
                        return response.json(solicitacao);
                    }else {
                        if (contato && abertura && !tipos) {
                            //console.log('opção-5')   
                            const solicitacao = await connection('solicitacoes')
                            .where('solCandidato', candidato )
                            .where('solContato', contato)
                            .where('solAbertura', abertura)
                            .where('conStatus', status)
                            .join('contatos', 'conId', 'solicitacoes.solContato')
                            .join('tipos', 'tipId', 'solicitacoes.solTipo')
                            .join('services', 'srvId', 'solicitacoes.solIdServ')
                            .orderBy('solAbertura', 'desc')
                            .select(['solicitacoes.*', 'tipos.tipDescricao', 'services.srvDescricao', 'contatos.conNomCompleto']);

                            if (!solicitacao) {
                                return response.status(404).send({erro: true, msn: 'Solicitações não localizadas!'});
                            }
        
                            return response.json(solicitacao);
                        }else {
                            if (!contato && abertura && tipos) {
                                //console.log('opção-6')   
                                const solicitacao = await connection('solicitacoes')
                                .where('solCandidato', candidato )
                                .where('solAbertura', abertura)
                                .where('solTipo', tipos)
                                .where('conStatus', status)
                                .join('contatos', 'conId', 'solicitacoes.solContato')
                                .join('tipos', 'tipId', 'solicitacoes.solTipo')
                                .join('services', 'srvId', 'solicitacoes.solIdServ')
                                .orderBy('solAbertura', 'desc')
                                .select(['solicitacoes.*', 'tipos.tipDescricao', 'services.srvDescricao', 'contatos.conNomCompleto']);
    
                                if (!solicitacao) {
                                    return response.status(404).send({erro: true, msn: 'Solicitações não localizadas!'});
                                }
            
                                return response.json(solicitacao);
                            }
                        }    
                    }    
                }
            }
        } 
        
    },

    async updSolicitacao(request, response) {
        let id = request.params.idSol;         
        const {
            solIdServ, 
            solTipo, 
            solContato, 
            solTitulo, 
            solDescricao, 
            solCandidato, 
            solEspecializacao,
            solPrioridade} = request.body;

        await connection('solicitacoes').where('solId', id)   
        .update({
            solIdServ, 
            solTipo, 
            solContato, 
            solTitulo, 
            solDescricao, 
            solCandidato, 
            solEspecializacao,
            solPrioridade,
        });
           
        return response.status(203).json({ success: 'Solicitação atualizada com sucesso!'});
    },
};


