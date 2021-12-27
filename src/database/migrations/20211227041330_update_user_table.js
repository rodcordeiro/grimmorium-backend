exports.up = function (knex) {
  return knex.schema.table('users', (table) => {
    table.string('defaultCollection');
  });
};

exports.down = function (knex) {
  return knex.schema.table('users', (table) => {
    table.dropColum('defaultCollection');
  });
};
