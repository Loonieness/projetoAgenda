const express = require('express');
const route = express.Router();

const homeController = require('./src/controllers/homeController');
const loginController = require('./src/controllers/loginController');
const contatoController = require('./src/controllers/contatoController');

//impede que usuários entrem sem estar logados apenas colocando no meio de um parentese
const { loginRequired } = require('./src/middlewares/middleware');

// Rotas da home
//controllers escolhem qual a model e qual a view que irá acontecer em tal rota, no caso da Home
route.get('/', homeController.index);

//Rotas de Login
route.get('/login/index', loginController.index);//daria para excluir o index se quiser
route.post('/login/register', loginController.register);
route.post('/login/login', loginController.login);
route.get('/login/logout', loginController.logout);

//rotas de contato
route.get('/contato/index', loginRequired, contatoController.index);
route.post('/contato/register', loginRequired, contatoController.register);
route.get('/contato/index/:id', loginRequired, contatoController.editIndex);



module.exports = route;
