const Card = require('../models/card');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.send(cards))
    .catch((err) => next(err));
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .populate(['owner', 'likes'])
    .then((card) => res.send(card))
    .catch((err) => next(err));
};

module.exports.removeCard = (req, res, next) => {
  const { cardId } = req.params;
  const currentUser = req.user;

  Card.findById({ _id: cardId })
    .orFail(() => ({ name: 'EmptyData' }))
    .populate(['owner', 'likes'])
    .then((card) => {
      const { owner } = card;
      if (`${owner._id}` !== `${currentUser._id}`) {
        const AccessError = { name: 'AccessError' };
        throw AccessError;
      }
      Card.findByIdAndRemove({ _id: cardId })
        .then((removedCard) => res.send(removedCard))
        .catch((err) => next(err));
    })
    .catch((err) => next(err));
};

module.exports.likeCard = (req, res, next) => {
  const { cardId } = req.params;
  const owner = req.user;

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: owner._id } },
    { new: true, runValidators: true },
  )
    .orFail(() => ({ name: 'EmptyData' }))
    .populate(['owner', 'likes'])
    .then((card) => res.send(card))
    .catch((err) => next(err));
};

module.exports.dislikeCard = (req, res, next) => {
  const { cardId } = req.params;
  const owner = req.user;

  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: owner._id } },
    { new: true, runValidators: true },
  )
    .orFail(() => ({ name: 'EmptyData' }))
    .populate(['owner', 'likes'])
    .then((card) => res.send(card))
    .catch((err) => next(err));
};
