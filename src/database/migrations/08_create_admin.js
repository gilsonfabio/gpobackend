exports.up = function(knex) {
    let nome = 'Administrator'; 
    let cpf = '12345678901';  
    let nascimento = 2023-01-01; 
    let email = 'desenvolvimento@aparecida.go.gov.br'; 
    let celular = '';
    let password = '159357';
    let nivAcesso = 9;
    let status = 'A'; 
    let senha = crypto.createHash('md5').update(password).digest('hex');
    return knex('usuarios').insert({
        usrNome: nome, 
        usrEmail: email, 
        usrPassword: senha,
        usrCelular: celular, 
        usrCpf: cpf, 
        usrNascimento: nascimento, 
        usrNivAcesso: nivAcesso,
        usrStatus: status
    });
};

exports.down = function(knex) {
    let email = 'desenvolvimento@aparecida.go.gov.br'; 
    return knex('usuarios').where('usrEmail', email)
    .del()
    
};
