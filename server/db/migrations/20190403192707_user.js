
exports.up = function(knex, Promise) {
  return knex.schema.createTable('user', table=>{
      table.increments();
      table.string('ip_address').unique().notNullable();
      table.timestamps(true, true);
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('user');
};
