const knexfile = require('../knexfile');
const knex = require('knex')(knexfile.development);

const user = {
  status: null,
  name: '',
  email: '',
  phone: '',
  password: '',
  gender: 0,
  test() {
    return user.nama;
  },
  insert() {
    const param = {
      name: user.name,
      email: user.email,
      password: user.password,
      phone: user.phone,
      gender: user.gender,
    };
    return knex('tbl_user').insert(param);
  },
  get(id) {
    if (id === undefined) {
      return knex.select().table('tbl_user').limit(2).orderBy('id', 'desc');
    }

    return knex('tbl_user').where('id', id).first().orderBy('id', 'desc');
  },
  update(id) {
    const param = {
      name: user.name,
      email: user.email,
      password: user.password,
      phone: user.phone,
      gender: user.gender,
    };
    return knex('tbl_user').where('id', id).update(param);
  },
  updateStatus(id) {
    const param = {
      status: user.status,
    };
    return knex('tbl_user').where('id', id).update(param);
  },
  delete(id) {
    return knex('tbl_user').where('id', id).del();
  },
  paginate(recordPerPage, currentPage) {
    return knex.select().table('tbl_user').limit(recordPerPage).offset(currentPage)
      .orderBy('id', 'desc');
  },
  getByEmail(email) {
    return knex('tbl_user').where('email', email).first();
  },

  changePassword(id) {
    const param = {
      password: user.password,
    };
    return knex('tbl_user').where('id', id).update(param);
  },

};

// console.log(user.gainRequest("POST"));
module.exports = user;
