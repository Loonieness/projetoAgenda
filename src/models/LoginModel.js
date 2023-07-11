const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs');

const LoginSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true }
});

const LoginModel = mongoose.model('Login', LoginSchema);

class Login {
  constructor(body) {//nisso teremos o body disponível dentro de toda a classe
    this.body = body;
    this.errors = [];//controla se o usuário pode ser criado ou não
    this.user = null;
  }

  async login() {
    this.valida();
    if(this.errors.length > 0) return;
    this.user = await LoginModel.findOne({ email: this.body.email });

    if(!this.user) {
      this.errors.push('Usuário não existe');
      return;//processo para aqui
    }

    if(!bcryptjs.compareSync(this.body.password, this.user.password)) {
      this.errors.push('Senha inválida');
      this.user = null;
      return;
    }
  }

 async register() {
    this.valida();
    if(this.errors.length > 0) return;

    await this.userExists();

    if(this.errors.length > 0) return;

    const salt = bcryptjs.genSaltSync();
    this.body.password = bcryptjs.hashSync(this.body.password, salt);

    
      this.user = await LoginModel.create(this.body);//o this.body já foi validado, criado e preenchido antes
  }

  async userExists() {
    this.user = await LoginModel.findOne({ email: this.body.email });//está procurando na BD um email igual ao que está sendo enviado
    if(this.user) this.errors.push('Usuário já existe');
  }

  valida() {
    this.cleanUp();
    //email precisa ser válido 
    if(!validator.isEmail(this.body.email)) this.errors.push('E-mail inválido');
    //a senha precisa ter entre 5 a 50 caracteres
    if(this.body.password.length < 5 || this.body.password.length > 50) {
      this.errors.push('A senha precisa ter entre 5 a 50 caracteres');
    }
  }

  cleanUp(){//garante que tudo o que entrar no valida é string
    for(const key in this.body)//precisa ser in para fazer loop nas chaves do objeto
    if(typeof this.body[key] != 'string') {
      this.body[key] = '';//transforma o que não é string em campo vazio
    }

    this.body = {
      email: this.body.email,
      password: this.body.password
    }
  }
}



module.exports = Login;
