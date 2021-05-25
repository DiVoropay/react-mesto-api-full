const router = require('express').Router();
const { validateCardId, validateCardData } = require('../middlewares/validators');

const {
  getCards, createCard, removeCard, likeCard, dislikeCard,
} = require('../controllers/cards');

router.get('/', getCards);
router.post('/', validateCardData, createCard);
router.delete('/:cardId', validateCardId, removeCard);
router.put('/:cardId/likes', validateCardId, likeCard);
router.delete('/:cardId/likes', validateCardId, dislikeCard);

module.exports = router;
