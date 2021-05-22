const path = require('path');
const express = require('express');

const mongoose = require('mongoose');
const { errors } = require('celebrate');

const auth = require('./middlewares/auth');
const { createUser, login } = require('./controllers/users');
const handlerErrors = require('./middlewares/handler-errors');
const { validateAuth, validateUserData, validateCardData } = require('./middlewares/validators');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(requestLogger);

app.use(express.static(path.join(__dirname, 'public')));

const allowedCors = [
  'https://projectyp.nomoredomains.icu',
  'localhost:3000'
];

app.use(function(req, res, next) {
  const { origin } = req.headers;

  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }

  next();
});

app.post('/signin', validateUserData, login);
app.post('/signup', validateUserData, createUser);
app.use('/users', validateAuth, auth, require('./routes/users'));
app.use('/cards', validateAuth, auth, validateCardData, require('./routes/cards'));

app.use('/', (req, res) => {
  res.status(404).send({ message: 'Страница не существует' });
});

app.use(errorLogger);

app.use(errors());
app.use(handlerErrors);

app.listen(PORT, () => {});
