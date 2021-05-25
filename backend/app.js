require('dotenv').config();

const path = require('path');
const express = require('express');

const mongoose = require('mongoose');
const cors = require('cors');
const { errors } = require('celebrate');

const auth = require('./middlewares/auth');
const { createUser, login } = require('./controllers/users');
const NotFoundError = require('./errors/not-found-error');
const handlerErrors = require('./middlewares/handler-errors');
const { validateAuth, validateUserData } = require('./middlewares/validators');
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

app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signin', validateUserData, login);
app.post('/signup', validateUserData, createUser);
app.use('/users', validateAuth, auth, require('./routes/users'));
app.use('/cards', validateAuth, auth, require('./routes/cards'));

app.use('/', () => {
  throw new NotFoundError('Страница не существует');
});

app.use(errorLogger);

app.use(errors());
app.use(handlerErrors);

app.listen(PORT, () => {});
