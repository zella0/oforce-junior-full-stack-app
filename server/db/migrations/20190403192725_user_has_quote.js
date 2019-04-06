
exports.up = function(knex, Promise) {
    return knex.schema.createTable('user_has_quote', table=>{
        table.increments();
        table.integer('user_id')
            .references('id')
            .inTable('user')
            .onDelete('cascade')
            .index();
        table.integer('quote_id')
            .references('id')
            .inTable('quote')
            .onDelete('cascade')
            .index();
        table.unique(['user_id', 'quote_id']);
        table.integer('rating').defaultTo(0);
        table.timestamps(true, true);
    })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('user_has_quote');
};
