const Login = require('../models/LoginModel');

exports.index = (req, res) => {
    res.render('login');
}

exports.register = async function(req, res) {//poderia ser uma arrow function que nem a acima
    const login = new Login(req.body); 
    await login.register();//espera isso resolver

    if(login.errors.length > 0) {//se tiver erro, mostra e volta
        req.flash('errors', login.errors);
        req.session.save(function() {
            return res.redirect('/login/index');
        });
        return;
    }
    res.send(login.errors);//está pegando os dados do form de register da página
}