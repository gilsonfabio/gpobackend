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
       
        //console.log(email)
        //console.log(senha)

        const user = await connection('administradores')
            .where('admEmail', email)
            .join('candidatos', 'canKey', 'administradores.admCandidato')
            .select('administradores.admId', 'administradores.admNomCompleto', 'administradores.admEmail', 'administradores.admPassword', 'candidatos.canRazSocial')
            .first();
          
        if (!user) {
            return response.status(400).json({ error: 'Não encontrou usuário com este ID'});
        } 

        let pass = user.admPassword;
        const match = await bcrypt.compare(senha, pass)

        if(!match) {
            return response.status(403).send({ auth: false, message: 'User invalid!' });
        }

        const dados = {
            usrId: user.usrId,
            usrNome: user.usrNome,
            usrNivAcesso: user.usrNivAcesso
        }

        let refreshIdToken = uuidv4(); 
                
        let token = jwt.sign({ id: user.admId, name: user.admNomCompleto, email: user.admEmail}, process.env.SECRET_JWT, {
            expiresIn: "1d"
        });
        let refreshToken = jwt.sign({ id: user.admId, name: user.admNomCompleto, email: user.admEmail}, process.env.SECRET_JWT_REFRESH, {
            expiresIn: "2d"
        });

        //console.log(token);

        return response.json({user, token, refreshToken});

    },

    async index (request, response) {
        const users = await connection('administradores')
        .orderBy('admNomCompleto')
        .select('*');
    
        return response.json(users);
    }, 

    async create(request, response) {
        const {admNomUsuario, admNomCompleto, admFuncao, admEmail, admCelular, admEndereco, admNumero, admComplemento, admBairro, admCidade, admCep, admUrlPhoto, admCandidato, admPassword} = request.body;
        var status = 'A'; 
        let snhCrypt = await bcrypt.hash(admPassword, saltRounds);

        const [admId] = await connection('administradores').insert({
            admNomUsuario, 
            admNomCompleto, 
            admFuncao,
            admEmail, 
            admCelular, 
            admEndereco, 
            admNumero, 
            admComplemento, 
            admBairro, 
            admCidade, 
            admCep, 
            admUrlPhoto, 
            admCandidato, 
            admPassword: snhCrypt, 
            admStatus: status
        });
           
        return response.json({admId});
    },

    async updUsuario(request, response) {
        let id = request.params.idUsr;         
        const {admNomUsuario, admNomCompleto, admFuncao, admEmail, admCelular, admEndereco, admNumero, admComplemento, admBairro, admCidade, admCep, admUrlPhoto} = request.body;
 
        await connection('administradores').where('usrId', id)   
        .update({
            admNomUsuario, 
            admNomCompleto, 
            admFuncao,
            admEmail, 
            admCelular, 
            admEndereco, 
            admNumero, 
            admComplemento, 
            admBairro, 
            admCidade, 
            admCep, 
            admUrlPhoto, 
        });
           
        return response.status(204).send();
    },
    
    async refreshToken(request, response) {
        let id = request.body.idUsr;
    
        const user = await connection('administradores')
            .where('admId', id)
            .select('admId', 'admNomCompleto', 'admEmail')
            .first();
          
        if (!user) {
            return response.status(400).json({ error: 'Não encontrou usuário com este ID'});
        } 

        let refreshIdToken = uuidv4(); 
        
        //console.log(refreshIdToken);
                
        let token = jwt.sign({ id: user.admId, name: user.admNomCompleto, email: user.admEmail}, process.env.SECRET_JWT, {
            expiresIn: process.env.EXPIREIN_JWT
        });
        let refreshToken = jwt.sign({ id: user.admId, name: user.admNomCompleto, email: user.admEmail}, process.env.SECRET_JWT_REFRESH, {
            expiresIn: process.env.EXPIREIN_JWT_REFRESH
        });

        return response.json({user, token, refreshToken});

    },

    //...........................................................................................................................

   
    async solPassword (request, response) {
        let emailUsuario = request.params.email;

        //console.log('email solicitado:', emailUsuario)

        const user = await connection('administradores')
            .where('admEmail', emailUsuario)
            .select('admId', 'admNomCompleto')
            .first();

        if (!user) {
            return response.status(400).json({ error: 'Não encontrou usuario com este email'});
        } 

        const arr_alfa = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","U","V","W","X","Y","Z","!","@","$","%","&","*"];
  
        let data = new Date();
        let dia = data.getDate();
        let mes = data.getMonth() + 1;
        let ano = data.getFullYear();
        let dataString = ano + '-' + mes + '-' + dia;
        let dataAtual = dataString;
         
        let hor = data.getHours();
        let min = data.getMinutes();
        let seg = data.getSeconds();
        let horaString = hor + ':' + min + ':' + seg;
        let horaAtual = horaString;
         
        let priLetra = arr_alfa[dia];
        let segLetra = arr_alfa[hor];
        let codSeguranca = priLetra + segLetra + user.usrId + min + seg;
        
        let nomServidor = user.usrNome;

        await connection('administradores').where('admEmail', emailUsuario)  
        .update({
           usrCodSeguranca: codSeguranca,           
        });

        let admEmail = process.env.EMAIL_USER;
        let hostEmail = process.env.EMAIL_HOST;
        let portEmail =  process.env.EMAIL_PORT;

        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: true,
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS,
            },
            tls: {
              rejectUnauthorized: false,
            },
        });

        const mailSent = await transporter.sendMail({
            text: `Código de Recuperação de senha: ${codSeguranca}`,
            subject: "E-mail de recuperação de senha",
            from: process.env.EMAIL_FROM,
            to: emailUsuario,
            html: `
            <html>
            <body>
                <center><h1>Olá ${nomServidor},<h1></center>
                <center><p>Você solicitou um código de segurança para recuperação de senha de acesso ao PORTAL DE ESPORTES</p></center></b></b>
                <center><p>Utilize o código de segurança abaixo para validar alteração da senha</p></center></b></b>
                <center><h3>Código de Segurança: ${codSeguranca}</h3></center></b></b></b>
                <center><img src="public/logo-barra.png" alt="Prefeitura de Aparecida de Goiânia" align="center" width="300px" height="120" /></center>
            </body>
          </html> 
            `,
        });
        console.log(mailSent);
        return response.status(200).send();  
    },    

    async updAdmPassword(request, response) {
      
        const { email, password, codSeguranca } = request.body;

        let senha = crypto.createHash('md5').update(password).digest('hex');
        let segLimpa = '';
        await connection('administradores')
        .where('admEmail', email) 
        .where('admCodSeguranca', codSeguranca)   
        .update({
            admPassword: senha,
            admCodSeguranca: segLimpa,           
        });
           
        return response.status(204).send();
    },
};

