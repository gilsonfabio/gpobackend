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
        .select(['denuncias.*', 'contatos.conNomCompleto', 'tipdenuncias.tdeDescricao', 'subTipDenuncias.stdDescricao']);
    
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

    async searchDenuncias (request, response) {
        const candidato = request.body.candidato;
        const contato = request.body.contato;
        const data = request.body.abertura;
        const tipo = request.body.tipos;
        const subtipo =  request.body.subtipo;
        if (!contato && !data && !tipo && !subtipo) { 
            const denuncias = await connection('denuncias')
            .where('denCandidato', candidato)
            .join('contatos', 'conId', 'denuncias.denConId')
            .join('tipdenuncias', 'tdeId', 'denuncias.denTipo')
            .join('subTipDenuncias', 'stdId', 'denuncias.denSubId')
            .orderBy('denData')
            .select(['denuncias.*', 'tipdenuncias.tdeDescricao', 'subTipDenuncias.stdDescricao', 'contatos.conNomCompleto']);
    
            return response.json(denuncias);    
        }else {
            if (contato && !data && !tipo && !subtipo) { 
                const denuncias = await connection('denuncias')
                .where('denCandidato', candidato)
                .where('denConId', contato)
                .join('contatos', 'conId', 'denuncias.denConId')
                .join('tipdenuncias', 'tdeId', 'denuncias.denTipo')
                .join('subTipDenuncias', 'stdId', 'denuncias.denSubId')
                .orderBy('denData')
                .select(['denuncias.*', 'tipdenuncias.tdeDescricao', 'subTipDenuncias.stdDescricao', 'contatos.conNomCompleto']);
        
                return response.json(denuncias);    
            }else {
                if (!contato && data && !tipo && !subtipo) { 
                    const denuncias = await connection('denuncias')
                    .where('denCandidato', candidato)
                    .where('denData', data)
                    .join('contatos', 'conId', 'denuncias.denConId')
                    .join('tipdenuncias', 'tdeId', 'denuncias.denTipo')
                    .join('subTipDenuncias', 'stdId', 'denuncias.denSubId')
                    .orderBy('denData')
                    .select(['denuncias.*', 'tipdenuncias.tdeDescricao', 'subTipDenuncias.stdDescricao', 'contatos.conNomCompleto']);
            
                    return response.json(denuncias);    
                }else {
                    if (!contato && !data && tipo && !subtipo) { 
                        const denuncias = await connection('denuncias')
                        .where('denCandidato', candidato)
                        .where('denTipo', tipo)
                        .join('contatos', 'conId', 'denuncias.denConId')
                        .join('tipdenuncias', 'tdeId', 'denuncias.denTipo')
                        .join('subTipDenuncias', 'stdId', 'denuncias.denSubId')
                        .orderBy('denData')
                        .select(['denuncias.*', 'tipdenuncias.tdeDescricao', 'subTipDenuncias.stdDescricao', 'contatos.conNomCompleto']);
                
                        return response.json(denuncias);    
                    }else {
                        if (!contato && !data && !tipo && subtipo) { 
                            const denuncias = await connection('denuncias')
                            .where('denCandidato', candidato)
                            .where('denSubId', subtipo)
                            .join('contatos', 'conId', 'denuncias.denConId')
                            .join('tipdenuncias', 'tdeId', 'denuncias.denTipo')
                            .join('subTipDenuncias', 'stdId', 'denuncias.denSubId')
                            .orderBy('denData')
                            .select(['denuncias.*', 'tipdenuncias.tdeDescricao', 'subTipDenuncias.stdDescricao', 'contatos.conNomCompleto']);
                    
                            return response.json(denuncias);    
                        }else {
                            if (contato && data && !tipo && !subtipo) { 
                                const denuncias = await connection('denuncias')
                                .where('denCandidato', candidato)
                                .where('denConId', contato)
                                .where('denData', data)
                                .join('contatos', 'conId', 'denuncias.denConId')
                                .join('tipdenuncias', 'tdeId', 'denuncias.denTipo')
                                .join('subTipDenuncias', 'stdId', 'denuncias.denSubId')
                                .orderBy('denData')
                                .select(['denuncias.*', 'tipdenuncias.tdeDescricao', 'subTipDenuncias.stdDescricao', 'contatos.conNomCompleto']);
                        
                                return response.json(denuncias);    
                            }else {
                                if (contato && !data && tipo && !subtipo) { 
                                    const denuncias = await connection('denuncias')
                                    .where('denCandidato', candidato)
                                    .where('denConId', contato)
                                    .where('denTipo', tipo)
                                    .join('contatos', 'conId', 'denuncias.denConId')
                                    .join('tipdenuncias', 'tdeId', 'denuncias.denTipo')
                                    .join('subTipDenuncias', 'stdId', 'denuncias.denSubId')
                                    .orderBy('denData')
                                    .select(['denuncias.*', 'tipdenuncias.tdeDescricao', 'subTipDenuncias.stdDescricao', 'contatos.conNomCompleto']);
                            
                                    return response.json(denuncias);    
                                }else {
                                    if (contato && !data && !tipo && subtipo) { 
                                        const denuncias = await connection('denuncias')
                                        .where('denCandidato', candidato)
                                        .where('denConId', contato)
                                        .where('denSubId', subtipo)
                                        .join('contatos', 'conId', 'denuncias.denConId')
                                        .join('tipdenuncias', 'tdeId', 'denuncias.denTipo')
                                        .join('subTipDenuncias', 'stdId', 'denuncias.denSubId')
                                        .orderBy('denData')
                                        .select(['denuncias.*', 'tipdenuncias.tdeDescricao', 'subTipDenuncias.stdDescricao', 'contatos.conNomCompleto']);
                                
                                        return response.json(denuncias);    
                                    }else {
                                        if (!contato && data && tipo && !subtipo) { 
                                            const denuncias = await connection('denuncias')
                                            .where('denCandidato', candidato)
                                            .where('denData', data)
                                            .where('denTipo', tipo)
                                            .join('contatos', 'conId', 'denuncias.denConId')
                                            .join('tipdenuncias', 'tdeId', 'denuncias.denTipo')
                                            .join('subTipDenuncias', 'stdId', 'denuncias.denSubId')
                                            .orderBy('denData')
                                            .select(['denuncias.*', 'tipdenuncias.tdeDescricao', 'subTipDenuncias.stdDescricao', 'contatos.conNomCompleto']);
                                    
                                            return response.json(denuncias);    
                                        }else {
                                            if (!contato && data && !tipo && subtipo) { 
                                                const denuncias = await connection('denuncias')
                                                .where('denCandidato', candidato)
                                                .where('denData', data)
                                                .where('denSubId', subtipo)
                                                .join('contatos', 'conId', 'denuncias.denConId')
                                                .join('tipdenuncias', 'tdeId', 'denuncias.denTipo')
                                                .join('subTipDenuncias', 'stdId', 'denuncias.denSubId')
                                                .orderBy('denData')
                                                .select(['denuncias.*', 'tipdenuncias.tdeDescricao', 'subTipDenuncias.stdDescricao', 'contatos.conNomCompleto']);
                                        
                                                return response.json(denuncias);    
                                            }else {
                                                if (!contato && !data && tipo && subtipo) { 
                                                    const denuncias = await connection('denuncias')
                                                    .where('denCandidato', candidato)
                                                    .where('denTipo', tipo)
                                                    .where('denSubId', subtipo)
                                                    .join('contatos', 'conId', 'denuncias.denConId')
                                                    .join('tipdenuncias', 'tdeId', 'denuncias.denTipo')
                                                    .join('subTipDenuncias', 'stdId', 'denuncias.denSubId')
                                                    .orderBy('denData')
                                                    .select(['denuncias.*', 'tipdenuncias.tdeDescricao', 'subTipDenuncias.stdDescricao', 'contatos.conNomCompleto']);
                                            
                                                    return response.json(denuncias);    
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }

        }



    },

    async busDenuncia (request, response) {
        const id = request.params.idDen;

        const denuncia = await connection('denuncias')
        .where('denId', id)
        .join('contatos', 'conId', 'denuncias.denConId')
        .join('tipdenuncias', 'tdeId', 'denuncias.denTipo')
        .join('subTipDenuncias', 'stdId', 'denuncias.denSubId')
        .orderBy('denData')
        .select(['denuncias.*', 'tipdenuncias.tdeDescricao', 'subTipDenuncias.stdDescricao', 'contatos.conNomCompleto', 'contatos.conEmail', 'contatos.conCelular']);
         
        console.log(denuncia)

        return response.json(denuncia);    

    },

    async updDenuncia(request, response) {
        let id = request.params.denId;         
        const {
            denTipo, 
            denSubId, 
            denDescricao, 
            denStatus, 
            denNome, 
            denConId, 
            denFonContato } = request.body;

        await connection('denuncias').where('denId', id)   
        .update({
            denTipo, 
            denSubId, 
            denDescricao, 
            denStatus, 
            denNome, 
            denConId, 
            denFonContato            
        });
           
        return response.status(203).json({ success: 'Denuncia atualizada com sucesso!'});
    },

};
