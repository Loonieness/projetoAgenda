const Login = require('../models/LoginModel');

exports.index = (req, res) => {
    res.render('login');
}

exports.register = function(req, res) {//poderia ser uma arrow function que nem a acima
    const login = new Login(req.body); 
    login.register();
    res.send(login.errors);//está pegando os dados do form de register da página
}