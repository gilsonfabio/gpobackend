const connection = require('../database/connection');

module.exports = {       
    
    async index (request, response) {
        const news = await connection('news')
        .select('*');
    
        //console.log(news);
        
        return response.json(news);
    }, 
    
};
