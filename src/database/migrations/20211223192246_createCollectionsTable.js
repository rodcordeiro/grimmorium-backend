exports.up = function (knex) {
  return knex.schema.createTable('collection', (table) => {
    table.string('id').notNullable().primary();
    table.string('name').notNullable();
    table.string('owner').notNullable();
    table.foreign('owner').references('user.id');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('collection');
};
