const connection = require('../database/connection');

module.exports = {       
    
    async index (request, response) {
        const bairros = await connection('bairros')
        .select('baiId', 'baiDescricao', 'baiCidId');
    
        return response.json(bairros);
    }, 

    async create(request, response) {
        const {baiDescricao, baiCidId} = request.body;
        const [baiId] = await connection('bairros').insert({
            baiDescricao, 
            baiCidId             
        });
           
        return response.json({baiId});
    },

    async updBairro(request, response) {
        let id = request.params.idBai;         
        const {baiDescricao, baiCidId} = request.body;
 
        await connection('bairros').where('baiId', id)   
        .update({
            baiDescricao, 
            baiCidId
        });
           
        return response.status(204).send();
    },   
    
};
