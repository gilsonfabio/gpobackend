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
        //console.log(id)
        const contatos = await connection('contatos')
        .where('conCandidato', id)
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
            conTrabalho, 
            conCargo, 
            conCelular, 
            conEmail, 
            conEndereco, 
            conNumero, 
            conBairro, 
            conCidade, 
            conUf, 
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
            conPassword} = request.body;
        var status = 'A'; 
        let snhCrypt = await bcrypt.hash(conPassword, saltRounds);

        const [conId] = await connection('contatos').insert({
            conCandidato, 
            conNomCompleto, 
            conGenero, 
            conCpf, 
            conIdentidade, 
            conOrgEmissor, 
            conTitEleitor, 
            conTrabalho, 
            conCargo, 
            conCelular, 
            conEmail, 
            conEndereco, 
            conNumero, 
            conBairro, 
            conCidade, 
            conUf, 
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
            conPassword: snhCrypt, 
            conStatus: status
        });
           
        return response.json({conId});
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
            conEmail, 
            conEndereco, 
            conNumero, 
            conBairro, 
            conCidade, 
            conUf, 
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
            conPassword} = request.body;
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
            conEmail, 
            conEndereco, 
            conNumero, 
            conBairro, 
            conCidade, 
            conUf, 
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
            conPassword
        });
           
        return response.status(204).send();
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

        if (id != '') {    
            const contato = await connection('contatos')
            .where('conId', id )
            .orderBy('conNomCompleto')
            .select('*');
        }else {
            if (nomContato != '') {
                const contato = await connection('contatos')
                .where('conNomCompleto', like, `%${nomContato.replaceAll('%', '\\%')}%`)
                .orderBy('conNomCompleto')
                .select('*');
            }else {
                if (cpf != '') {
                    const contato = await connection('contatos')
                    .where('conCpf', cpf)
                    .orderBy('conNomCompleto')
                    .select('*');
                }else {
                    if (celular != '') {
                        const contato = await connection('contatos')
                        .where('conCelular', celular)
                        .orderBy('conNomCompleto')
                        .select('*');
                    }else {
                        if (email != '') {
                            const contato = await connection('contatos')
                            .where('conEmail', email)
                            .orderBy('conNomCompleto')
                            .select('*');
                        }    
                    }    
                }
            }
        } 

        if (!contato) {
            return response.status(404).send({erro: true, msn: 'Contato não localizado!'});
        }

        return response.json(contato);
    },
    
};
