const fs = require("fs");
const connection = require('../database/connection');

module.exports = {       
    
    async gerUfs (request, response) {        
        fs.readFile("./src/database/json/estados.json", function(err, data) {
      
            if (err) throw err;
           
            const ufs = JSON.parse(data);
            let i = 0
            for (const uf of ufs) {                
                let codigo = ufs[i].codigo_uf;
		        let sigla = ufs[i].uf;
                let nome = ufs[i].nome;
                let lat = ufs[i].latitude;
                let lon = ufs[i].longitude;
                let reg  = ufs[i].regiao;

                console.log(nome)

                salvaState(codigo, sigla, nome, lat, lon, reg)
                
                i++  
            }
            
            return response.status(200).send({status: 'Importação com Sucesso!'});
        });

        async function salvaState(codigo, sigla, nome, lat, lon, reg) {
            await connection('states').insert({
                stdId: codigo, 
                stdSigla: sigla, 
                stdNome: nome, 
                stdLatitude: lat, 
                stdLongitude: lon, 
                stdRegiao: reg                       
            });
        }
    }, 

    async importCities (request, response) {  
        
        let idUf = request.params.uf;
        console.log(idUf);

        fs.readFile("./src/database/json/municipios.json", function(err, data) {
      
            if (err) throw err;
           
            const cities = JSON.parse(data);
            let i = 0
            for (const city of cities) {                
                let codigo = cities[i].codigo_ibge;
                let nome = cities[i].nome;
                let latitude = cities[i].latitude;
                let longitude = cities[i].longitude;
                let capital = cities[i].capital;
                let uf = cities[i].codigo_uf;
                let siafi = cities[i].siafi_id;
                let ddd = cities[i].ddd;
                let fuso = cities[i].fuso_horario;
                
                if (uf == idUf) {
                    salvaCity(codigo, nome, latitude, longitude, capital, uf, siafi, ddd, fuso)
                    console.log(nome)
                }

                i++  
            }           
        });

        return response.status(200).send({status: 'Importação de Cidades com Sucesso!'});

        async function salvaCity(codigo, nome, latitude, longitude, capital, uf, siafi, ddd, fuso) {
            await connection('cities').insert({
                citCodIbge: codigo, 
                citNome: nome, 
                citLatitude: latitude, 
                citLongitude: longitude, 
                citCapital: capital, 
                citUf: uf, 
                citSiafi: siafi, 
                citDdd: ddd, 
                citFuso: fuso                       
            });
        }
    },

    async importContatos(request, response) { 
        const reader = require('xlsx')
        const file = reader.readFile("./src/database/json/contatos.xlsx")
  
        let data = []
  
        const sheets = file.SheetNames
  
        for(let i = 0; i < sheets.length; i++)
        {
            const temp = reader.utils.sheet_to_json(
            file.Sheets[file.SheetNames[i]])
            temp.forEach((res) => {
                data.push(res)
            })
        }
  
        console.log(data);
        return response.status(200).send({status: 'Importação de Contatos com Sucesso!'});
    },

};
