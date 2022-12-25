require('dotenv').config();

//puxa os frameworks
const express = require('express');
const app = express();
const mongoose = require('mongoose');//modela a base de dados
//usa a string do arquivo .env
mongoose.connect(process.env.CONNECTIONSTRING, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.emit('pronto');//isso faz com que o usuário nãe entre antes da conexão acontecer
  })
  .catch(e => console.log(e));
const session = require('express-session');//salva a sessão na memória
const MongoStore = require('connect-mongo');//const atualizada, tirada o (session)
const flash = require('connect-flash');
const routes = require('./routes');
const path = require('path');
//lembrar que usar o helmet em localhost só funciona se for em https, senão dá erro em importações e CSS
const helmet = require('helmet');//para maior segurança
const csrf = require('csurf');//cria um token random para prevenir um ataque
const { middlewareGlobal, checkCsrfError, csrfMiddleware } = require('./src/middlewares/middleware');

app.use(helmet());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'public')));

const sessionOptions = session({
  secret: 'akasdfj0út23453456+54qt23qv  qwf qwer qwer qewr asdasdasda a6()',
  store: MongoStore.create({ mongoUrl: process.env.CONNECTIONSTRING }),
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7, //o cookie dura 7 dias
    httpOnly: true
  }
});
app.use(sessionOptions);
app.use(flash());

app.set('views', path.resolve(__dirname, 'src', 'views'));
app.set('view engine', 'ejs');

app.use(csrf());
// Nossos próprios middlewares
app.use(middlewareGlobal);
app.use(checkCsrfError);
app.use(csrfMiddleware);
app.use(routes);

app.on('pronto', () => {
  app.listen(3000, () => {
    console.log('Acessar http://localhost:3000');
    console.log('Servidor executando na porta 3000');
  });
});
