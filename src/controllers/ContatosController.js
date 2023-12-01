const connection = require('../database/connection');
const nodemailer = require("nodemailer");
require('dotenv/config');

const bcrypt = require('bcrypt');
const saltRounds = 10;
 
const jwt = require('jsonwebtoken');
const {v4:uuidv4} = require ('uuid') ; 
 
module.exports = {       
    async signIn(request, response) {
        let email = request.body.email;
        let senha = request.body.password;

        const user = await connection('contatos')
            .where('conEmail', email)
            .join('candidatos', 'canKey', 'contatos.conCandidato')
            .select('contatos.conId', 'contatos.conNomCompleto', 'contatos.conEmail', 'contatos.conCandidato', 'contatos.conPassword', 'candidatos.canRazSocial')
            .first();
          
        if (!user) {
            return response.status(400).json({ error: 'Não encontrou usuário com este ID'});
        }

        let pass = user.conPassword;
        const match = await bcrypt.compare(senha, pass)

        if(!match) {
            return response.status(403).send({ auth: false, message: 'User invalid!' });
        }

        const dados = {
            usrId: user.conId,
            usrNome: user.conNomCompleto,
            usrEmail: user.conEmail,
            usrCandidado: user.conCandidato 
        }

        let refreshIdToken = uuidv4(); 
                
        let token = jwt.sign({ id: user.conId, name: user.conNomCompleto, email: user.conEmail}, process.env.SECRET_JWT, {
            expiresIn: "1d"
        });
        let refreshToken = jwt.sign({ id: user.conId, name: user.conNomCompleto, email: user.conEmail}, process.env.SECRET_JWT_REFRESH, {
            expiresIn: "2d"
        });

        return response.json({dados, token, refreshToken});

    },

    async index(request, response) {
        let id = request.params.idCan; 
        let status = 'A'; 
        //console.log(id)
        const contatos = await connection('contatos')
        .where('conCandidato', id)
        .where('conStatus', status)
        .orderBy('conNomCompleto')
        .select('*');
    
        return response.json({contatos});
    }, 

    async create(request, response) {
        const {
            conCandidato, 
            conNomCompleto, 
            conGenero, 
            conCpf, 
            conIdentidade, 
            conOrgEmissor, 
            conTitEleitor, 
            conTitZona,
            conTitSecao,
            conTrabalho, 
            conCargo, 
            conCelular, 
            conTelefone,
            conEmail, 
            conEndereco, 
            conNumero, 
            conBairro, 
            conCidade, 
            conUf, 
            conCep,
            conComplemento, 
            conNascimento, 
            conPai, 
            conMae, 
            conEstCivil, 
            conConjuge, 
            conNasConjuge, 
            conInfluencia, 
            conLatitude, 
            conLongitude} = request.body;
        let status = 'A'; 
        //let snhCrypt = await bcrypt.hash(conPassword, saltRounds);
           
        //console.log('Antes:',conNascimento)
        let day = parseInt(conNascimento.substring(0,2));
        let month = parseInt(conNascimento.substring(3,5));
        let year = parseInt(conNascimento.substring(6,10));
        
        //console.log('Dia:',day)
        //console.log('Mes:',month)
        //console.log('Ano:',year)

        let datNasc = new Date(year, month - 1, day);
        //console.log('Depois:',datNasc)

        //console.log('Antes:',conNasConjuge)
        let dayCon = parseInt(conNasConjuge.substring(0,2));
        let monthCon = parseInt(conNasConjuge.substring(3,5));
        let yearCon = parseInt(conNasConjuge.substring(6,10));
        
        //console.log('Dia:',dayCon)
        //console.log('Mes:',monthCon)
        //console.log('Ano:',yearCon)

        let datNasConjuge = new Date(yearCon, monthCon - 1, dayCon);
        //console.log('Depois:',datNasConjuge)
        
        const [conId] = await connection('contatos').insert({
            conCandidato, 
            conNomCompleto, 
            conGenero, 
            conCpf, 
            conIdentidade, 
            conOrgEmissor, 
            conTitEleitor, 
            conTitZona,
            conTitSecao,
            conTrabalho, 
            conCargo, 
            conCelular, 
            conTelefone,
            conEmail, 
            conEndereco, 
            conNumero, 
            conBairro, 
            conCidade, 
            conUf, 
            conCep,
            conComplemento, 
            conNascimento: datNasc, 
            conPai, 
            conMae, 
            conEstCivil, 
            conConjuge, 
            conNasConjuge: datNasConjuge, 
            conInfluencia, 
            conLatitude, 
            conLongitude, 
            conStatus: status
        });
                  
        return response.json({conId});
    },

    async ctoMobile(request, response) {
        const {
            candidato,
            email, 
            nome, 
            celular, 
            password, 
            pushToken } = request.body;
        var status = 'A'; 

        const contato = await connection('contatos')
        .where('conEmail', email)
        .select('conNomCompleto');

        if (contato) {
            return response.status(200).json({ error: 'Email já cadastrado para outro contato! Favor verificar.'});
        }

        let snhCrypt = await bcrypt.hash(password, saltRounds);

        const [conId] = await connection('contatos').insert({
            conCandidato: candidato, 
            conNomCompleto: nome, 
            conCelular: celular, 
            conEmail: email, 
            conPushToken: pushToken,
            conPassword: snhCrypt, 
            conStatus: status
        });
           
        return response.status(204).json({ error: 'Cadastro de usuário realizado com sucesso!'});
    },

    async updContato(request, response) {
        let id = request.params.idCon;         
        const {
            conNomCompleto, 
            conGenero, 
            conCpf, 
            conIdentidade, 
            conOrgEmissor, 
            conTitEleitor, 
            conTrabalho, 
            conCargo, 
            conCelular, 
            conTelefone,
            conEmail, 
            conEndereco, 
            conNumero, 
            conBairro, 
            conCidade, 
            conUf, 
            conCep,
            conComplemento, 
            conNascimento, 
            conPai, 
            conMae, 
            conEstCivil, 
            conConjuge, 
            conNasConjuge, 
            conInfluencia, 
            conLatitude, 
            conLongitude, 
            conPassword,
            conStatus} = request.body;

        let year = conNascimento.substring(6, 10);
        let month = conNascimento.substring(3,5);
        let day = conNascimento.substring(0,2);

        let datNasc = new Date(year, month - 1, day);

        let yearCon = conNasConjuge.substring(6, 10);
        let monthCon = conNasConjuge.substring(3,5);
        let dayCon = conNasConjuge.substring(0,2);

        let datNasConjuge = new Date(yearCon, monthCon - 1, dayCon);

        await connection('contatos').where('conId', id)   
        .update({
            conNomCompleto, 
            conGenero, 
            conCpf, 
            conIdentidade, 
            conOrgEmissor, 
            conTitEleitor, 
            conTrabalho, 
            conCargo, 
            conCelular, 
            conTelefone,
            conEmail, 
            conEndereco, 
            conNumero, 
            conBairro, 
            conCidade, 
            conUf, 
            conCep,
            conComplemento, 
            conNascimento: datNasc, 
            conPai, 
            conMae, 
            conEstCivil, 
            conConjuge, 
            conNasConjuge: datNasConjuge, 
            conInfluencia, 
            conLatitude, 
            conLongitude, 
            conPassword,
            conStatus
        });
           
        return response.status(203).json({ success: 'Cadastro de usuário atualizado com sucesso!'});
    },

    async searchContato (request, response) {
        const {
            id,
            nomContato, 
            cpf, 
            celular, 
            email} = request.body;

        //console.log(id);   
        //console.log(nomContato);   
        //console.log(cpf);    
        //console.log(celular);   
        //console.log(email);
        let status = "A" 

        if (id && !nomContato && !cpf && !celular && !email) {    
            const contato = await connection('contatos')
            .where('conId', id )
            .where('conStatus', status)
            .orderBy('conNomCompleto')
            .select('*');

            if (!contato) {
                return response.status(404).send({erro: true, msn: 'Contato não localizado!'});
            }
    
            return response.json(contato);
        }else {
            if (!id && nomContato && !cpf && !celular && !email) {
                const contato = await connection('contatos')
                .where('conNomCompleto', 'like', `%${nomContato.replaceAll('%', '\\%')}%`)
                .where('conStatus', status)
                .orderBy('conNomCompleto')
                .select('*');

                if (!contato) {
                    return response.status(404).send({erro: true, msn: 'Contato não localizado!'});
                }
        
                return response.json(contato);
            }else {
                if (!id && !nomContato && cpf && !celular && !email) {
                    const contato = await connection('contatos')
                    .where('conCpf', cpf)
                    .where('conStatus', status)
                    .orderBy('conNomCompleto')
                    .select('*');

                    if (!contato) {
                        return response.status(404).send({erro: true, msn: 'Contato não localizado!'});
                    }
            
                    return response.json(contato);
                }else {
                    if (!id && !nomContato && !cpf && celular && !email) {
                        const contato = await connection('contatos')
                        .where('conCelular', celular)
                        .where('conStatus', status)
                        .orderBy('conNomCompleto')
                        .select('*');

                        if (!contato) {
                            return response.status(404).send({erro: true, msn: 'Contato não localizado!'});
                        }
                
                        return response.json(contato);
                    }else {
                        if (!id && !nomContato && !cpf && !celular && email) {
                            const contato = await connection('contatos')
                            .where('conEmail', email)
                            .where('conStatus', status)
                            .orderBy('conNomCompleto')
                            .select('*');

                            if (!contato) {
                                return response.status(404).send({erro: true, msn: 'Contato não localizado!'});
                            }
                    
                            return response.json(contato);
                        }    
                    }    
                }
            }
        } 
        
    },
    
};
