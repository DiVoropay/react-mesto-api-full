const { celebrate, Joi } = require('celebrate');

module.exports.validateAuth = celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().pattern(/^Bearer [^\s]+/),
  }).unknown(),
});

module.exports.validateUserId = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24).required(),
  }),
});

module.exports.validateUserData = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required()
      .messages({
        'any.required': 'Поле "email" должно быть заполнено',
        'any.email': 'Недопустимый формат email',
      }),
    password: Joi.string().min(8).required()
      .messages({
        'string.min': 'Минимальная длина поля "password" - 8',
        'any.required': 'Поле "password" должно быть заполнено',
      }),
    name: Joi.string().min(2).max(30)
      .messages({
        'string.min': 'Минимальная длина поля "name" - 2',
        'string.max': 'Максимальная длина поля "name" - 30',
      }),
    about: Joi.string().min(2).max(30)
      .messages({
        'string.min': 'Минимальная длина поля "about" - 2',
        'string.max': 'Максимальная длина поля "about" - 30',
      }),
    avatar: Joi.string().pattern(/^http[s]?:\/\/[www.]*[\w-._~:/?#[\]@!$&'()*+,;=]+/)
      .rule({ message: 'Неправильный формат ссылки' }),
  }),
});

module.exports.validateUserUpdateData = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required()
      .messages({
        'string.min': 'Минимальная длина поля "name" - 2',
        'string.max': 'Максимальная длина поля "name" - 30',
      }),
    about: Joi.string().min(2).max(30).required()
      .messages({
        'string.min': 'Минимальная длина поля "about" - 2',
        'string.max': 'Максимальная длина поля "about" - 30',
      }),
  }),
});

module.exports.validateUserAvatarData = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(/^http[s]?:\/\/[www.]*[\w-._~:/?#[\]@!$&'()*+,;=]+/)
      .rule({ message: 'Неправильный формат ссылки' }),
  }),
});

module.exports.validateCardId = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24).required(),
  }),
});

module.exports.validateCardData = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required()
      .messages({
        'string.min': 'Минимальная длина поля "name" - 2',
        'string.max': 'Максимальная длина поля "name" - 30',
      }),
    link: Joi.string().required().pattern(/^http[s]?:\/\/[www.]*[\w-._~:/?#[\]@!$&'()*+,;=]+/)
      .rule({ message: 'Неправильный формат ссылки' }),
  }),
});
