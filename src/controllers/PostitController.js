const connection = require('../database/connection');
const nodemailer = require("nodemailer");
require('dotenv/config');

const bcrypt = require('bcrypt');
const saltRounds = 10;

const jwt = require('jsonwebtoken');
const {v4:uuidv4} = require ('uuid') ; 

module.exports = {       
    
    async index (request, response) {
        const postit = await connection('postit')
        .orderBy('posData')
        .select('*');
    
        return response.json(postit);
    }, 

    async create(request, response) {
        const {posData, posHora, posTitulo, posDescricao, posAdmId, posDatConclusao, posHorConclusao } = request.body;
        var status = 'A'; 
        const [posId] = await connection('postit').insert({
            posData, 
            posHora, 
            posTitulo, 
            posDescricao, 
            posAdmId, 
            posDatConclusao, 
            posHorConclusao,
            posStatus: status
        });
           
        return response.json({posId});
    },

    async updPostit(request, response) {
        let id = request.params.idPos;         
        const {posData, posHora, posTitulo, posDescricao, posAdmId, posDatConclusao, posHorConclusao } = request.body;
        await connection('postit').where('posId', id)   
        .update({
            posData, 
            posHora, 
            posTitulo, 
            posDescricao, 
            posAdmId, 
            posDatConclusao, 
            posHorConclusao
        });
           
        return response.status(204).send();
    },

    async searchPostit (request, response) {
        let id = request.params.idPos;    
        const postit = await connection('postit')
        .where('posId', id)
        .orderBy('posData')
        .select('*');
    
        return response.json(postit);
    },

    async perPostit (request, response) {
        let inicio = request.params.datIni;
        let final = request.params.datFin;    
        const postit = await connection('postit')
        .where('posData', '>=', inicio)
        .where('posData', '<=', final)
        .orderBy('posData')
        .select('*');
    
        return response.json(postit);
    },
        
};

