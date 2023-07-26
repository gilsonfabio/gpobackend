const connection = require('../database/connection');

module.exports = {       
    
    async index (request, response) {
        let nomCity = request.params.city;
        //console.log('procurando...',nomCity)
        const city = await connection('cities')
        .where('citNome', 'like', `%${nomCity.replaceAll('%', '\\%')}%`)
        .join('states', 'stdId', 'cities.citUf')
        .limit(20)
        .orderBy('citNome')
        .select(['cities.*', 'states.stdSigla', 'states.stdNome']);
    
        return response.json(city);
    },    

    async cityIbge (request, response) {
        let ibge = request.params.city;
        
        const city = await connection('cities')
        .where('citCodIbge', ibge)
        .join('states', 'stdId', 'cities.citUf')
        .orderBy('citNome')
        .select(['cities.*', 'states.stdSigla', 'states.stdNome'])
        .first();
        
        return response.json(city);
    }, 

};
