const crypto = require('crypto');
const connection = require('../database/connection');
const nodemailer = require("nodemailer");
require('dotenv/config');

const jwt = require('jsonwebtoken');
const {v4:uuidv4} = require ('uuid') ; 

module.exports = {       
    async signIn(request, response) {
        let email = request.body.email;
        let senha = request.body.password;
        let encodedVal = crypto.createHash('md5').update(senha).digest('hex');
        
        const user = await connection('contatos')
            .where('conEmail', email)
            .where('conPassword', encodedVal)
            .join('candidatos', 'canKey', 'contatos.conCandidato')
            .select('contatos.conId', 'contatos.conNomCompleto', 'contatos.conEmail', 'contatos.conCandidato', 'candidatos.canRazSocial')
            .first();
          
        if (!user) {
            return response.status(400).json({ error: 'Não encontrou usuário com este ID'});
        } 

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
