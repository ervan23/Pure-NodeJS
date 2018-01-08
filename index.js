const http = require('http');
const Router = require('node-router');
const controller = require('./controller/Controller.js');

const router = Router();
const route = router.push;

route('GET', '/login', controller.page.loginPage);
route('POST', '/login', controller.user.login);
route('GET', '/logout', controller.user.logout);
route('GET', '/register', controller.page.register);
route('POST', '/forgot_password', controller.user.forgotPassword);
route('GET', '/reset_password', controller.page.resetPassword);
route('POST', '/reset_password', controller.user.resetPassword);

route('PUT', '/user/change_status', controller.user.changeStatus);
route('POST', '/user', controller.user.insertUser);
route('PUT', '/user', controller.user.updateUser);
route('DELETE', '/user', controller.user.deleteUser);
route('GET', '/user', controller.user.getDetailUser);

route('GET', '/', controller.page.home);

http.createServer(router).listen(8080);
