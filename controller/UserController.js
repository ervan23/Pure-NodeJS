const qString = require('querystring');
const validator = require('../middleware/validator.js');
const userObj = require('../model/User.js');
const bcrypt = require('bcrypt');
const NodeSession = require('node-session');
const auth = require('../model/Auth.js');
const token = require('../model/Token.js');
const postmark = require('postmark');
const config = require('../config/config.js');

// Send an email:
const client = new postmark.Client(config.key.postmark);

const session = new NodeSession({ secret: config.key.session, lifetime: ((300000 * 12) * 24) });

module.exports = {

  insertUser(req, res) {
    let dataPost = '';
    const dataResponse = {};
    req.on('data', (stream) => {
      dataPost += stream;
      dataPost = qString.parse(dataPost);

      validator.validate(dataPost.txtEmail, 'Enter valid email.').isEmail();
      validator.validate(dataPost.gender, 'Gender cant empty').notEmpty();
      validator.validate(dataPost.txtName, 'Name cant empty').notEmpty();
      validator.validate(dataPost.txtPassword, 'Password cant empty').notEmpty();
      validator.validate(dataPost.txtPhone, 'Phone cant empty').notEmpty();

      if (validator.fail()) {
        dataResponse.error = true;
        dataResponse.message = validator.error_message;
        res.writeHead(200, { 'Content-type': 'application/json' });
        res.write(JSON.stringify(dataResponse));
        res.end();
        return;
      }

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(dataPost.txtPassword, salt, (errHash, hash) => {
          if (errHash) {
            return;
          }
          userObj.email = dataPost.txtEmail;
          userObj.gender = dataPost.gender;
          userObj.name = dataPost.txtName;
          userObj.password = hash;
          userObj.phone = dataPost.txtPhone;

          userObj.insert().then(() => {
            dataPost.error = false;
            dataPost.message = 'Data inserted';
            res.writeHead(200, { 'Content-type': 'application/json' });
            res.write(JSON.stringify(dataPost));
            res.end();
          })
            .catch((error) => {
              dataResponse.error = true;
              dataResponse.message = 'Failed insert data.';
              dataResponse.data = JSON.stringify(error);
              res.writeHead(500, { 'Content-type': 'application/json' });
              res.write(JSON.stringify(dataResponse));
              res.end();
            });
        });
      });
    });
  },

  getDetailUser(req, res) {
    const dataResponse = {};
    let code;
    userObj.get(req.query.id).then((result) => {
      if (result) {
        dataResponse.error = false;
        dataResponse.message = 'User Found.';
        dataResponse.user = result;
        code = 200;
      } else {
        dataResponse.error = false;
        dataResponse.message = 'User not Found.';
        code = 404;
      }
      res.writeHead(code, { 'Content-type': 'application/json' });
      res.write(JSON.stringify(dataResponse));
      res.end();
    })
      .catch((err) => {
        dataResponse.error = true;
        dataResponse.message = 'Failed get user.';
        dataResponse.data = JSON.stringify(err);
        res.writeHead(500, { 'Content-type': 'application/json' });
        res.write(JSON.stringify(dataResponse));
        res.end();
      });
  },

  deleteUser(req, res) {
    const dataResponse = {};
    userObj.delete(req.query.id).then(() => {
      dataResponse.error = false;
      dataResponse.message = 'Success delete user.';
      res.writeHead(200, { 'Content-type': 'application/json' });
      res.write(JSON.stringify(dataResponse));
      res.end();
    })
      .catch((err) => {
        dataResponse.error = true;
        dataResponse.message = 'Failed delete user.';
        dataResponse.data = JSON.stringify(err);
        res.writeHead(500, { 'Content-type': 'application/json' });
        res.write(JSON.stringify(dataResponse));
        res.end();
      });
  },

  updateUser(req, res) {
    let dataPost = '';
    const dataResponse = {};
    req.on('data', (stream) => {
      dataPost += stream;
      dataPost = qString.parse(dataPost);
      userObj.email = dataPost.txtEmail;
      userObj.gender = dataPost.gender;
      userObj.name = dataPost.txtName;
      userObj.password = dataPost.txtPassword;
      userObj.phone = dataPost.txtPhone;

      userObj.update(dataPost.txtId).then(() => {
        dataResponse.error = false;
        dataResponse.message = 'Data updated';
        res.writeHead(200, { 'Content-type': 'application/json' });
        res.write(JSON.stringify(dataResponse));
        res.end();
      })
        .catch((err) => {
          dataResponse.error = true;
          dataResponse.message = 'Failed update data.';
          dataResponse.data = JSON.stringify(err);
          res.writeHead(500, { 'Content-type': 'application/json' });
          res.write(JSON.stringify(dataResponse));
          res.end();
        });
    });
  },

  login(req, res) {
    session.startSession(req, res, () => {
      let dataPost = '';
      const dataResponse = {};
      req.on('data', (stream) => {
        dataPost += stream;
        dataPost = qString.parse(dataPost);
        const email = dataPost.txtEmail;
        const password = dataPost.txtPassword;

        auth.login(email).then((result) => {
          if (result) {
            bcrypt.compare(password, result.password, (err, correct) => {
              if (correct) {
                dataResponse.error = false;
                dataResponse.message = 'loged in';
                req.session.put('id', result.id);
                req.session.put('role', result.role);
                res.writeHead(200, { 'Content-type': 'application/json' });
                res.write(JSON.stringify(dataResponse));
                res.end();
              } else {
                dataResponse.error = true;
                dataResponse.message = 'Login failed, check password or email address.';
                res.writeHead(200, { 'Content-type': 'application/json' });
                res.write(JSON.stringify(dataResponse));
                res.end();
              }
            });
          } else {
            dataResponse.error = true;
            dataResponse.message = 'Check your email and password';
            res.writeHead(200, { 'Content-type': 'application/json' });
            res.write(JSON.stringify(dataResponse));
            res.end();
          }
        })
          .catch(() => {
            dataResponse.error = true;
            dataResponse.message = 'Internal server error.';
            res.writeHead(500, { 'Content-type': 'application/json' });
            res.write(JSON.stringify(dataResponse));
            res.end();
          });
      });
    });
  },

  changeStatus(req, res) {
    let dataPost = '';
    const dataResponse = {};
    req.on('data', (stream) => {
      dataPost += stream;
      dataPost = qString.parse(dataPost);
      userObj.status = dataPost.status;

      userObj.updateStatus(dataPost.id).then(() => {
        dataResponse.error = false;
        dataResponse.message = 'Data updated';
        res.writeHead(200, { 'Content-type': 'application/json' });
        res.write(JSON.stringify(dataResponse));
        res.end();
      })
        .catch(() => {
          dataResponse.error = true;
          dataResponse.message = 'Failed update data.';
          res.writeHead(500, { 'Content-type': 'application/json' });
          res.write(JSON.stringify(dataResponse));
          res.end();
        });
    });
  },

  logout(req, res) {
    session.startSession(req, res, () => {
      req.session.flush();
      res.writeHead(302, { Location: 'http://localhost:8080/login' });
      res.end();
    });
  },

  forgotPassword(req, res) {
    let dataPost = '';
    const dataResponse = {};
    req.on('data', (stream) => {
      dataPost += stream;
      dataPost = qString.parse(dataPost);

      userObj.getByEmail(dataPost.txtEmail).then((result) => {
        if (result) {
          token.token = token.generate(result.email);
          token.insert().then((tokenId) => {
            const genToken = token.generate(`${result.id}-${tokenId[0]}-${result.email}`);
            client.sendEmail({
              From: 'alif@skyshi.io',
              To: result.email,
              Subject: 'Reset Password',
              HtmlBody: `<p>Use this link to reset your password</p><br>
              <a href="http://localhost:8080/reset_password?token=${genToken}">Reset Password</a>`,
            });
            dataResponse.error = false;
            dataResponse.message = `We sent reset password link to ${dataPost.txtEmail}`;
            res.writeHead(200, { 'Content-type': 'application/json' });
            res.write(JSON.stringify(dataResponse));
            res.end();
          });
        } else {
          dataResponse.error = true;
          dataResponse.message = 'Your email not registered.';
          res.writeHead(200, { 'Content-type': 'application/json' });
          res.write(JSON.stringify(dataResponse));
          res.end();
        }
      })
        .catch(() => {
          dataResponse.error = true;
          dataResponse.message = 'Your email not registered.';
          res.writeHead(500, { 'Content-type': 'application/json' });
          res.write(JSON.stringify(dataResponse));
          res.end();
        });
    });
  },

  resetPassword(req, res) {
    let dataPost = '';
    const dataResponse = {};
    req.on('data', (stream) => {
      dataPost += stream;
      dataPost = qString.parse(dataPost);

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(dataPost.txtPassword, salt, (errHash, hash) => {
          if (errHash) {
            return;
          }

          userObj.password = hash;
          userObj.changePassword(dataPost.txtId).then(() => {
            dataResponse.error = false;
            dataResponse.message = 'Data updated';
            res.writeHead(200, { 'Content-type': 'application/json' });
            res.write(JSON.stringify(dataResponse));
            res.end();
          }).catch(() => {
            dataResponse.error = true;
            dataResponse.message = 'Failed update data.';
            res.writeHead(500, { 'Content-type': 'application/json' });
            res.write(JSON.stringify(dataResponse));
            res.end();
          });
        });
      });
    });
  },

};// ->return
// c5487382-32c0-4a49-872f-58ac3298340b
