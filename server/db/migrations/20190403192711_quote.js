
exports.up = function(knex, Promise) {
    return knex.schema.createTable('quote', table=>{
        table.increments();
        table.string('content').unique().notNullable();
        table.timestamps(true, true);
    })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('quote');
};
