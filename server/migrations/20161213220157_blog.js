// title - text
// description - text
// author - text
// done - boolean
// date - datetime

exports.up = function(knex, Promise) {
  return knex.schema.createTable('blog', (table) => {
    table.increments();
    table.text('title').notNullable();
    table.text('author');
    table.text('description');
    table.boolean('done').defaultTo(false).notNullable();
    table.datetime('date').notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('blog');
};
