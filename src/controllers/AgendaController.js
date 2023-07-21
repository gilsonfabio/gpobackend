const connection = require('../database/connection');

module.exports = {       
    
    async agenda (request, response) {
        let id = request.params.idCan;
        let data = request.params.datAgenda;
        console.log(data);
        
        let year = data.getFullYear();
        let month = data.getMonth();
        let day = data.getDate();
        
        let datAgenda = new Date(year,month,day);
        console.log(id, datAgenda);

        const agenda = await connection('agenda')
        .where('ageCanId', id)
        .where('ageDatInicial', datAgenda)
        .select('*');
    
        console.log(agenda);

        return response.json(agenda);
    }, 

    async ageMonth (request, response) {
        let id = request.params.idCan;
        let data = request.params.datAtual;
        let year = data.getFullYear();
        let month = data.getMonth();

        const firstDay = new Date(data.getFullYear(), data.getMonth(), 1);
        const lastDay = new Date(data.getFullYear(), data.getMonth() + 1, 0);

        const mensal = await connection('agenda')
        .where('ageCanId', id)
        .where('ageDatInicial', '>=', firstDay)
        .where('ageDatInicial', '<=', lastDay)
        .select('*');
    
        console.log(mensal);

        return response.json(mensal);
    }, 
       
};
