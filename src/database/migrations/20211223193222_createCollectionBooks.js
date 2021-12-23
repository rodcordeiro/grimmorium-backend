exports.up = function (knex) {
    return knex.schema.createTable('collectionBooks', (table) => {
      table.string('collection').notNullable();
      table.foreign('collection').references('collection.id');
      table.string('book').notNullable();
      table.foreign('book').references('books.id');
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTable('collectionBooks');
  };
  