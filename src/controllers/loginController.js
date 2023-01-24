const Login = require('../models/LoginModel');

exports.index = (req, res) => {
    if(req.session.user) return res.render('login-logado');//essa condição pergunta se o usuário está logado
    return res.render('login');
}

exports.register = async function(req, res) {//poderia ser uma arrow function que nem a acima
    try{
        const login = new Login(req.body); 
        await login.register();//espera isso resolver
    
        if(login.errors.length > 0) {//se tiver erro, mostra e volta
            req.flash('errors', login.errors);
            req.session.save(function() {
                return res.redirect('/login/index');
            });
            return;  
        }
        req.flash('success', 'Seu usuário foi criado com sucesso');
        req.session.save(function() {
            return res.redirect('/login/index');
            });
    }catch(e){
        console.log(e);
        return res.render('404');
    }
};


exports.login = async function(req, res) {//poderia ser uma arrow function que nem a acima
    try{
        const login = new Login(req.body); 
        await login.login();//espera isso resolver 
    
        if(login.errors.length > 0) {//se tiver erro, mostra e volta
            req.flash('errors', login.errors);
            req.session.save(function() {
                return res.redirect('/login/index');
            });
            return;  
        }

        req.flash('success', 'Usuário logado com sucesso!');
        req.session.user = login.user; //a sessão se tornou única
        req.session.save(function() {
            return res.redirect('/login/index');
            });
    }catch(e){
        console.log(e);
        return res.render('404');
    }
};

exports.logout = function(req, res) {
    req.session.destroy();
    res.redirect('/');
}