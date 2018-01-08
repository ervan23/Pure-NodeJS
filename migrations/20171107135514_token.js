
exports.up = (knex, Promise) => Promise.all([
  knex.schema.createTableIfNotExists('tbl_token', (table) => {
    table.increments('id').primary();
    table.text('token');
    table.datetime('expired', 50);
    table.timestamps();
  }),
]);

exports.down = (knex, Promise) => Promise.all([
  knex.schema.dropTable('tbl_token'),
]);
