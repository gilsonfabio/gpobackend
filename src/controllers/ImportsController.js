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
            const temp = reader.utils.sheet_to_json(file.Sheets[file.SheetNames[i]])            
            temp.forEach((res) => {
                data.push(res)                
            })            
        }      
        console.log(data)
        let contatos = JSON.stringify(data);
        fs.writeFileSync('contatos-2.json', contatos);

        return response.status(200).send({status: 'Importação de Contatos com Sucesso!'});
    },

    async impContatos (request, response) {        
        fs.readFile("./src/database/json/contatos-2.json", function(err, data) {
      
            if (err) throw err;
           
            const contatos = JSON.parse(data);
            let i = 0
            for (const contato of contatos) {                
                let nome = contatos[i].Nome.replace(/aaa/i, "");
                let email = contatos[i].Email.replace(/aaa/i, "");
                let nascimento= contatos[i].DataNascimento
                let nomeMae = contatos[i].NomeMae.replace(/aaa/i, "");
                let cpf = contatos[i].CPF.replace(/\D+/g, "");
                //let cpf = contatos[i].CPF;
                let sexo = contatos[i].Sexo.replace(/aaa/i, "");
                let lideranca = contatos[i].Lideranca.replace(/aaa/i, "");
                let liglideranca = contatos[i].LigacaoLideranca.replace(/aaa/i, "");
                let nivel = contatos[i].Nivel.replace(/aaa/i, "");
                let comunidades = contatos[i].Comunidades.replace(/aaa/i, "");
                let telefone = contatos[i].Telefones.replace(/\D+/g, "");
                
                let fone = '';
                let fone2 = '';
                
                if (telefone.length === 21 ) {
                    fone = telefone.toString().substring(0,10)
                    fone2 = telefone.toString().substring(10,21) 
                }else {
                    if (telefone.length === 22) {
                        fone = telefone.toString().substring(0,11)
                        fone2 = telefone.toString().substring(11,22)
                    }else {
                        fone = telefone 
                        fone2 = ''
                    }     
                }
                     
                let titulo = contatos[i].TituloEleitor.replace(/aaa/i, "");
                let zona = contatos[i].Zona.replace(/aaa/i, "");
                let secao = contatos[i].Secao.replace(/aaa/i, "");
                let tags = contatos[i].TagsContato.replace(/aaa/i, "");
                let localVotacao = contatos[i].LocalVotacao.replace(/aaa/i, "");
                let cep = contatos[i].CEP;
                let logradouro = contatos[i].Logradouro.replace(/aaa/i, "");
                let numero = contatos[i].Numero;
                let complemento = contatos[i].Complemento.replace(/aaa/i, "");
                let bairro = contatos[i].Bairro.replace(/aaa/i, "");
                let cidade = contatos[i].Cidade.replace(/aaa/i, "");
                let estado = contatos[i].Estado.replace(/aaa/i, "");
                let latitude = contatos[i].Latitude;
                let longitude = contatos[i].Longitude;
                let twitter = contatos[i].Twitter.replace(/aaa/i, "");
                let facebook = contatos[i].Facebook.replace(/aaa/i, "");
                let instagram = contatos[i].Instagram.replace(/aaa/i, "");
                let linkedin = contatos[i].Linkedin.replace(/aaa/i, "");
                let status = 'A';
                
                console.log('id:',i, 'CPF:', cpf, '-', 'Nome:', nome, ' - Telefones:', telefone, 'F1:',fone,' <=> F2:', fone2)
/*
                salvaContato(
                    nome,
                    email, 
                    nascimento, 
                    nomeMae, 
                    cpf, 
                    sexo, 
                    fone,
                    fone2, 
                    titulo, 
                    zona, 
                    secao, 
                    tags, 
                    localVotacao,
                    cep,
                    logradouro,
                    numero,
                    complemento,
                    bairro,
                    cidade,
                    estado,
                    latitude,
                    longitude,
                    status
                )
*/                
                i++  
            }
            
            return response.status(200).send({status: 'Importação com Sucesso!'});
        });

        async function salvaContato(
            nome,
            email, 
            nascimento, 
            nomeMae, 
            cpf, 
            sexo, 
            fone,
            fone2, 
            titulo, 
            zona, 
            secao, 
            tags, 
            localVotacao,
            cep,
            logradouro,
            numero,
            complemento,
            bairro,
            cidade,
            estado,
            latitude,
            longitude,
            status ) {
            let conPassword = '1234';
            let snhCrypt = await bcrypt.hash(conPassword, saltRounds);
            await connection('contatos').insert({
                conCandidato, 
                conNomCompleto: nome, 
                conGenero: sexo, 
                conCpf: cpf, 
                conIdentidade, 
                conOrgEmissor, 
                conTitEleitor: titulo, 
                conTrabalho, 
                conCargo, 
                conCelular: fone,
                conTelefone: fone2, 
                conEmail: email, 
                conEndereco: logradouro, 
                conNumero: numero, 
                conBairro, 
                conCidade, 
                conUf: estado, 
                conCep: cep,
                conComplemento: complemento, 
                conNascimento: nascimento, 
                conPai, 
                conMae: nomeMae, 
                conEstCivil, 
                conConjuge, 
                conNasConjuge, 
                conInfluencia, 
                conLatitude: latitude, 
                conLongitude: longitude, 
                conPassword: snhCrypt, 
                conStatus: status                     
            });
        }
    }, 



};
