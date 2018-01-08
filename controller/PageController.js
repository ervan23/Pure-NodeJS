const fileSys = require('fs');
const ejs = require('ejs');
const NodeSession = require('node-session');
const userObj = require('../model/User.js');
const token = require('../model/Token.js');
const config = require('../config/config.js');

const session = new NodeSession({ secret: config.key.session, lifetime: ((300000 * 12) * 24) });

const page = {
  home(req, res) {
    session.startSession(req, res, () => {
      const id = req.session.get('id');
      if (id === undefined) {
        res.writeHead(302, { Location: 'http://localhost:8080/login' });
        res.end();
        return;
      }

      if (req.query.page !== undefined) {
        page.paginate(req, res, req.query.page);
        return;
      }

      if (req.session.get('role') === 2) {
        page.userHomePage(req, res);
      }

      userObj.get().then((result) => {
        const param = {
          url: req.url,
          ejs,
          users: {
            result,
            total: result.length,
            paginate_count: result.length / 2,
            current_page: 1,
          },
          page: fileSys.readFileSync('./view/train1.ejs').toString(),
        };

        ejs.renderFile('./view/index.ejs', param, (err, str) => {
          res.writeHead(200, { 'Content-type': 'text/html' });
          res.write(str);
          res.end();
        });
      })
        .catch(() => {
          res.end();
        });
    });
  },

  userHomePage(req, res) {
    userObj.get(req.session.get('id')).then((result) => {
      const param = {
        ejs,
        users: result,
        page: fileSys.readFileSync('./view/profile.ejs').toString(),
      };

      ejs.renderFile('./view/index.ejs', param, (err, str) => {
        res.writeHead(200, { 'Content-type': 'text/html' });
        res.write(str);
        res.end();
      });
    })
      .catch(() => {
        res.end();
      });
  },

  paginate(req, res, reqPage) {
    let currentPage = parseInt(reqPage, 36);
    currentPage = currentPage < 1 ? 1 : currentPage;
    userObj.paginate(2, (currentPage - 1) * 2).then((result) => {
      const param = {
        ejs,
        users: {
          current_page: currentPage,
          result,
          total: result.length,
          paginate_count: Math.ceil(result.length / 2),
        },
        page: fileSys.readFileSync('./view/train1.ejs').toString(),
      };

      ejs.renderFile('./view/index.ejs', param, (err, str) => {
        res.writeHead(200, { 'Content-type': 'text/html' });
        res.write(str);
        res.end();
      });
    })
      .catch(() => {
        res.end();
      });
  },

  loginPage(req, res) {
    ejs.renderFile('./view/login.ejs', {}, (err, str) => {
      if (err) {
        res.end();
        return;
      }
      res.writeHead(200, { 'Content-type': 'text/html' });
      res.write(str);
      res.end();
    });
  },

  register(req, res) {
    ejs.renderFile('./view/register.ejs', {}, (err, str) => {
      res.writeHead(200, { 'Content-type': 'text/html' });
      res.write(str);
      res.end();
    });
  },

  resetPassword(req, res) {
    let parseToken = token.parse(req.query.token);
    parseToken = parseToken.split('-');
    const tokenId = parseToken[1];
    token.id = tokenId;
    token.get().then((result) => {
      const expire = new Date() > new Date(result.expired);
      console.log(`${expire} --> ${JSON.stringify(result)}`);
      ejs.renderFile('./view/reset_password.ejs', { id: parseToken[0], expired: expire }, (err, str) => {
        res.writeHead(200, { 'Content-type': 'text/html' });
        res.write(str);
        res.end();
      });
    });
  },

};

module.exports = page;
