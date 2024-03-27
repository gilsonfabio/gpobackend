const crypto = require('crypto');
const express = require('express');
const routes = express.Router();
const jwt = require('jsonwebtoken');

const AdminController = require('./controllers/AdminController');
const ModulosController = require('./controllers/ModulosController');
const CidadesController = require('./controllers/CidadesController');
const BairrosController = require('./controllers/BairrosController');
const EstadosController = require('./controllers/EstadosController');
const GruposController = require('./controllers/GruposController');
const NewsController = require('./controllers/NewsController');
const ServicesController = require('./controllers/ServicesController');
const TiposController = require('./controllers/TiposController');
const EspecializacoesController = require('./controllers/EspecializacoesController');
const SolicitacoesController = require('./controllers/SolicitacoesController');
const ContatosController = require('./controllers/ContatosController');
const OportunidadesController = require('./controllers/OportunidadesController');
const CandidatoController = require('./controllers/CandidatoController');
const DenunciasController = require('./controllers/DenunciasController');
const UtilidadesController = require('./controllers/UtilidadesController');
const ImportsController = require('./controllers/ImportsController');
const CitiesController = require('./controllers/CitiesController');
const PostitController = require('./controllers/PostitController');
const HistoricosController = require('./controllers/HistoricosController');
const AgendaController = require('./controllers/AgendaController');
const TipDenController = require('./controllers/TipDenController');
const SubTipController = require('./controllers/SubTipController');

routes.get('/', (request, response) => {
    response.json({
        message: 'Bem-vindo ao servidor Assiste!',
    });
});

function verifyJWT(req, res, next){
    //console.log('verificando token...')
    const token = req.headers["x-access-token"];
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

    jwt.verify(token, process.env.SECRET_JWT, (err, userInfo) => {
        if (err) {
           return res.status(403).send({ auth: false, message: 'Token invalid!' });
        }                
        next();            
    });
}

async function verifyRefreshJWT(req, res, next){
    //console.log('verificando refresh token...')
    const refreshTokenJWT = req.headers["x-access-token"];
    if (!refreshTokenJWT) return res.status(401).send({ auth: false, message: 'No refresh token provided.' });
    
    jwt.verify(refreshTokenJWT, process.env.SECRET_JWT_REFRESH, (err, userInfo) => {
        if (err) {
           return res.status(403).send({ auth: false, message: 'Refresh Token invalid!' });
        }
        next();            
    });
}

routes.post('/refreshToken', verifyRefreshJWT, AdminController.refreshToken);
routes.post('/signIn', AdminController.signIn);

routes.get('/users', verifyJWT, AdminController.index);
routes.post('/newuser', verifyJWT, AdminController.create);
routes.put('/solPassword/:email', AdminController.solPassword);
routes.put('/updUsuario/:idAdm', verifyJWT, AdminController.updUsuario);

routes.get('/services', ServicesController.index);
routes.get('/utilidades', UtilidadesController.index);

routes.get('/tipos', TiposController.index);
routes.get('/especializacoes', EspecializacoesController.index);

routes.get('/tipdenuncias', TipDenController.index);

routes.get('/subtipos', SubTipController.index);

routes.get('/contatos/:idCan', ContatosController.index);
routes.post('/signInCon', ContatosController.signIn);
routes.post('/newcontato', ContatosController.create);
routes.put('/updContato/:conId', ContatosController.updContato);
routes.post('/searchContato', ContatosController.searchContato);
routes.post('/ctoMobile', ContatosController.ctoMobile);
routes.get('/buscontatos/:idCan', ContatosController.busContatos);
routes.get('/busContatoCpf/:numCpf', ContatosController.busContatoCpf);

routes.get('/solicitacoes/:idCan', SolicitacoesController.index);
routes.get('/solContato/:idCon', SolicitacoesController.solContato);
routes.post('/newSolicitacao', SolicitacoesController.newSolicitacao);
routes.post('/searchSolicitacoes', SolicitacoesController.searchSolicitacoes);
routes.get('/busSolicitacao/:idSol', SolicitacoesController.busSolicitacao);


routes.get('/denuncias/:idCan', DenunciasController.index);
routes.get('/denContato/:idCon', DenunciasController.denContato);
routes.post('/newDenuncia', DenunciasController.newDenuncia);
routes.get('/tipdenuncias', DenunciasController.tipDenuncias);
routes.get('/subTipDenuncias', DenunciasController.subTipDenuncias);
routes.post('/searchDenuncias', DenunciasController.searchDenuncias);
routes.get('/busDenuncia/:idDen', DenunciasController.busDenuncia);

routes.get('/oportunidades/:tipo', OportunidadesController.oportunidades);
routes.post('/newOportunidade', OportunidadesController.newOportunidade);

routes.get('/modulos', ModulosController.index);
routes.get('/iteModulos/:idMod', ModulosController.iteModulos);

routes.get('/cidades', CidadesController.index);
routes.post('/newCidade', CidadesController.create);
routes.put('/updCidade/:idCid', CidadesController.updCidade);

routes.get('/estados', EstadosController.index);
routes.post('/newEstado', EstadosController.create);
routes.put('/updEstado/:idEst', EstadosController.updEstado);

routes.get('/bairros', BairrosController.index);
routes.post('/newBairro', BairrosController.create);
routes.put('/updBairro/:idBai', BairrosController.updBairro);

routes.get('/grupos', GruposController.index);
routes.post('/newGrupo', GruposController.create);
routes.put('/updGrupo/:idGrp', GruposController.updGrupo);

routes.get('/news', NewsController.index);

routes.get('/candidato', CandidatoController.index);
routes.get('/searchCandidato/:candidato', CandidatoController.searchCandidato);
routes.get('/accessCandidato/:candidato', CandidatoController.accessCandidato);

routes.post('/geraUfs', ImportsController.gerUfs);
routes.post('/geraCities/:uf', ImportsController.importCities);
routes.post('/geraContatos', ImportsController.importContatos);
routes.post('/impContatos', ImportsController.impContatos);

routes.get('/cities/:city', CitiesController.index);
routes.get('/cityIbge/:city', CitiesController.cityIbge);

routes.get('/postit/:idAdm', PostitController.index);
routes.post('/newpostit', PostitController.create);
routes.put('/updpostit/:idPos', PostitController.updPostit);
routes.get('/searchPostit/:idPos', PostitController.searchPostit);
routes.get('/perPostit/:datIni/:datFin', PostitController.perPostit);

routes.get('/denHistorico/:denId', HistoricosController.denHistorico);
routes.get('/solHistorico/:solId', HistoricosController.solHistorico);

routes.get('/agenda/:idCan/:selected', AgendaController.agenda);
routes.get('/ageMonth/:idCan/:datAgenda', AgendaController.ageMonth);

module.exports = routes;
