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
        
        if (!user) {
            return response.status(400).json({ error: 'Não encontrou usuário com este ID'});
        } 

        let pass = user.conPassword;
        const match = await bcrypt.compare(senha, pass)

        if(!match) {
            return response.status(403).send({ auth: false, message: 'User invalid!' });
        }

        console.log(match);

        let refreshIdToken = uuidv4(); 
                
        let token = jwt.sign({ id: user.conId, name: user.conNomCompleto, email: user.conEmail}, process.env.SECRET_JWT, {
            expiresIn: process.env.EXPIREIN_JWT
        });
        let refreshToken = jwt.sign({ id: user.conId, name: user.conNomCompleto, email: user.conEmail}, process.env.SECRET_JWT_REFRESH, {
            expiresIn: process.env.EXPIREIN_JWT_REFRESH
        });

        console.log(token);

        return response.json({user, token, refreshToken});

    },

    async index (request, response) {
        const contatos = await connection('contatos')
        .where('conCanditado', id)
        .orderBy('conNomCompleto')
        .select('*');
    
        return response.json(contatos);
    }, 

    
};
