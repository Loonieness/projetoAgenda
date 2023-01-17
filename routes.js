const express = require('express');
const route = express.Router();

const homeController = require('./src/controllers/homeController');
const loginController = require('./src/controllers/loginController');


// Rotas da home
//controllers escolhem qual a model e qual a view que irá acontecer em tal rota, no caso da Home
route.get('/', homeController.index);

//Rotas de Login
route.get('/login/index', loginController.index);//daria para excluir o index se quiser


module.exports = route;
