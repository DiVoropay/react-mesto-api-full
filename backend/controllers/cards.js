const Card = require('../models/card');

const NotFoundError = require('../errors/not-found-error');
const AccessError = require('../errors/access-error');
const BadRequestError = require('../errors/bad-request-error');

const hendlerError = (err) => {
  console.log(err);
  switch (err.name) {
    case 'ValidationError':
      return new BadRequestError(`${Object.values(err.errors).map((error) => error.message).join(', ')}`);
    case 'CastError':
      return new BadRequestError(`Ошибка запроса ${err.message}`);
    default: return err;
  }
};

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.send(cards))
    .catch((err) => next(hendlerError(err)));
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((newCard) => {
      Card.findById({ _id: newCard._id })
        .orFail(() => {
          throw new NotFoundError('Карточка с указанным _id не найдена');
        })
        .populate(['owner', 'likes'])
        .then((card) => res.send(card))
        .catch((err) => next(hendlerError(err)));
    })
    .catch((err) => next(hendlerError(err)));
};

module.exports.removeCard = (req, res, next) => {
  const { cardId } = req.params;
  const currentUser = req.user;

  Card.findById({ _id: cardId })
    .orFail(() => {
      throw new NotFoundError('Карточка с указанным _id не найдена');
    })
    .populate(['owner', 'likes'])
    .then((card) => {
      const { owner } = card;
      if (`${owner._id}` !== `${currentUser._id}`) {
        throw new AccessError('Вы можете удалять только свои карточки');
      }
      Card.findByIdAndRemove({ _id: cardId })
        .then((removedCard) => res.send(removedCard))
        .catch((err) => next(err));
    })
    .catch((err) => next(hendlerError(err)));
};

module.exports.likeCard = (req, res, next) => {
  const { cardId } = req.params;
  const owner = req.user;

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: owner._id } },
    { new: true, runValidators: true },
  )
    .orFail(() => {
      throw new NotFoundError('Карточка с указанным _id не найдена');
    })
    .populate(['owner', 'likes'])
    .then((card) => res.send(card))
    .catch((err) => next(hendlerError(err)));
};

module.exports.dislikeCard = (req, res, next) => {
  const { cardId } = req.params;
  const owner = req.user;

  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: owner._id } },
    { new: true, runValidators: true },
  )
    .orFail(() => {
      throw new NotFoundError('Карточка с указанным _id не найдена');
    })
    .populate(['owner', 'likes'])
    .then((card) => res.send(card))
    .catch((err) => next(hendlerError(err)));
};
