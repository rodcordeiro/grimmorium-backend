exports.up = function (knex) {
  return knex.schema.createTable('accessControl', (table) => {
    table.string('collection').notNullable();
    table.foreign('collection').references('collection.id');
    table.string('user').notNullable();
    table.foreign('user').references('user.id');
    table.boolean('editPermissions').notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('accessControl');
};
