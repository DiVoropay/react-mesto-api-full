import React from 'react';
import avatar from '../images/profile/avatar.png';
import Card from './Card';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

function Main({ onEditProfile, onAddPlace, onEditAvatar, onCardClick, cards, onCardLike, onCardDelete }) {
  const currentUser = React.useContext(CurrentUserContext);

  return (
    <main className="content">

      <section className="profile content__profile">
        <button className="profile__edit-avatar" onClick={onEditAvatar} type="button">
          <img className="profile__avatar" src={currentUser.avatar ? currentUser.avatar : avatar} alt="Фотография профиля" />
          <div className="profile__edit-icon"></div>
        </button>

        <div className="profile__info">
          <div className="profile__flex-row">
            <h1 className="profile__name">{currentUser.name}</h1>
            <button className="profile__edit-button page-hover" onClick={onEditProfile} type="button"></button>
          </div>
          <p className="profile__description">{currentUser.about}</p>
        </div>
        <button className="profile__add-button page-hover" onClick={onAddPlace} type="button"></button>
      </section>

      <section className="elements">
        {cards.map((card) => (
          <Card
            key={card._id}
            card={card}
            onCardClick={onCardClick}
            onCardLike={onCardLike}
            onCardDelete={onCardDelete}
          />
        )
        )
        }
      </section>

    </main>
  );
}

export default Main;
