const mongoose = require('mongoose');
const validator = require('validator');

const ContatoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  sobrenome: { type: String, required: false, default: '' },
  email: { type: String, required: false, default: '' },
  telefone: { type: String, required: false, default: '' },
  criadoEm: { type: Date, default: Date.now }

});

const ContatoModel = mongoose.model('Contato', ContatoSchema);


function Contato(body){
  this.body = body;
  this.errors = [];
  this.contato = null;
}

Contato.buscaPorId = async function(id) {
  if(typeof id !== 'string') return;
  const user = await ContatoModel.findById(id);
  return user;
}

Contato.prototype.register = async function() {
  this.valida(); 

  if(this.errors.length > 0) return;
  this.contato = await ContatoModel.create(this.body);
}

Contato.prototype.valida = function() {
  this.cleanUp();
  //email precisa ser válido ou existir 
  if(this.body.email && !validator.isEmail(this.body.email)) this.errors.push('E-mail inválido');
  if(!this.body.nome) this.errors.push('Nome é um campo obrigatório');
  if(!this.body.email && !this.body.telefone) {
    this.errors.push('Preencha o nome e/ou telefone');
  }
  
  
}

Contato.prototype.cleanUp = function() {//garante que tudo o que entrar no valida é string
  for(const key in this.body)//precisa ser in para fazer loop nas chaves do objeto
  if(typeof this.body[key] != 'string') {
    this.body[key] = '';//transforma o que não é string em campo vazio
  }

  this.body = {
    nome: this.body.nome,
    sobrenome: this.body.sobrenome,
    email: this.body.email,
    telefone: this.body.telefone
  
  }
}


module.exports = Contato;
