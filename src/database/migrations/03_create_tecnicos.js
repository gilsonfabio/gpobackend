exports.up = function(knex) {
    return knex.schema.createTable('tecnicos', function(table) {
        table.increments('tecId').primary();
        table.string('tecNome').notNullable();
        table.string('tecEmail').notNullable(); 
        table.string('tecPassword').notNullable();
        table.string('tecCelular').nullable();
        table.string('tecCpf').nullable();
        table.date('tecNascimento').nullable();
        table.integer('tecNivAcesso').nullable();     
        table.string('tecStatus').nullable(); 
        table.string('tecCodSeguranca').nullable();      
    });
};
  
exports.down = function(knex) {
    return knex.schema.dropTable('tecnicos');
};