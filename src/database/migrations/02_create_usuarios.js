exports.up = function(knex) {
    return knex.schema.createTable('usuarios', function(table) {
        table.increments('usrId').primary();
        table.string('usrNome').notNullable();
        table.string('usrEmail').notNullable(); 
        table.string('usrPassword').notNullable();
        table.string('usrCelular').nullable();
        table.string('usrCpf').nullable();
        table.date('usrNascimento').nullable();
        table.integer('usrNivAcesso').nullable();     
        table.string('usrStatus').nullable();
        table.string('usrCodSeguranca').nullable();       
    });    
};
  
exports.down = function(knex) {
    return knex.schema.dropTable('usuarios');
};


