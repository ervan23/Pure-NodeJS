exports.up = (knex, Promise) => Promise.all([
  knex.schema.createTableIfNotExists('tbl_user', (table) => {
    table.increments('id').primary();
    table.string('name', 100);
    table.string('email', 50);
    table.string('password', 255);
    table.string('phone', 15);
    table.integer('gender');
    table.timestamps();
  }),
]);

exports.down = (knex, Promise) => Promise.all([
  knex.schema.dropTable('tbl_user'),
]);
