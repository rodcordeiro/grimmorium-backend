exports.up = function (knex) {
  return knex.schema.createTable('users', (table) => {
    table.string('id').notNullable().primary();
    table.string('username').notNullable();
    table.text('picture').notNullable();
    table.string('email').notNullable();
    table.string('password').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('users');
};
