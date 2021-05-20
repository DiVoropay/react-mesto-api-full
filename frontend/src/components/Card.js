import React from 'react';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

function Card({ card, onCardClick, onCardLike, onCardDelete }) {
  const currentUser = React.useContext(CurrentUserContext);

  const name = card.name;
  const link = card.link;
  const numberOfLikes = card.likes.length;
  const authorsOfLikes = card.likes.reduce((list, item) => { return list + item.name + '\n' }, '');

  const isOwn = card.owner._id === currentUser._id;
  const isLiked = card.likes.some(i => i._id === currentUser._id);

  function handleClick() {
    onCardClick(card);
  }

  function handleLikeClick() {
    onCardLike(card, isLiked);
    //передаю состояние лайка отображаемое на старнице пользователя
    //для предсказуемости отклика приложения на клик пользователя
    //в случае параллельной работы из нескольких приложений
  }

  function handleDeleteClick() {
    onCardDelete(card);
  }

  return (
    <article className="element">
      <img className="element__image" src={link} alt={name} onClick={handleClick} />
      <div className="element__description">
        <h2 className="element__title" title={name}>
          {name}
        </h2>
        <div className="element__like-block">
          <button className={`element__like page-hover${isLiked ? ' element__like_active' : ''}`} onClick={handleLikeClick} type="button"></button>
          <p className="element__like-count" title={authorsOfLikes}>
            {numberOfLikes}
          </p>
        </div>
      </div>
      <button className={`element__trash page-hover${!isOwn ? ' element__trash_hidden' : ''}`} onClick={handleDeleteClick} type="button"></button>
    </article>
  );
}

export default Card;
