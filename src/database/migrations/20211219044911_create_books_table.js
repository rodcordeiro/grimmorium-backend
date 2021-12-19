exports.up = function (knex) {
  return knex.schema.createTable('books', (table) => {
    table.string('id').notNullable();
    table.string('title').notNullable();
    table.string('author');
    table.string('serie');
    table.string('serieOrder');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('books');
};
