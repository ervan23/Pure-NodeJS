exports.seed = (knex, Promise) => knex.table('tbl_user').del()
  .then(() => Promise.all([
    knex('tbl_user').insert({
      name: 'Ervan Prastyanto',
      email: 'ervan@skyshi.io',
      password: 'password',
      phone: '087739086179',
      gender: 1,
      role: 1,
      status: 1,
      created_at: new Date(),
    }),
    knex('tbl_user').insert({
      name: 'Auth User',
      email: 'user@skyshi.io',
      password: 'password',
      phone: '087739086178',
      gender: 1,
      role: 2,
      status: 1,
      created_at: new Date(),
    }),
    knex('tbl_user').insert({
      name: 'Guest',
      email: 'guest@skyshi.io',
      password: 'password',
      phone: '087739086177',
      gender: 2,
      role: 3,
      status: 1,
      created_at: new Date(),
    }),
  ]));

