import React from 'react';
import { Route, Switch, Redirect, useHistory } from 'react-router-dom';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import PopupWithForm from './PopupWithForm';
import ImagePopup from './ImagePopup';
import AddPlacePopup from './AddPlacePopup';
import InfoTooltip from './InfoTooltip';
import api from '../utils/api';
import signApi from '../utils/signApi';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import ProtectedRoute from './ProtectedRoute';
import Register from './Register';
import Login from './Login';

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);
  const [isInfoTooltipOpen, setIsInfoTooltipOpen] = React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState({});
  const [currentUser, setCurrentUser] = React.useState({});
  const [emailUser, setEmailUser] = React.useState();
  const [cards, setCards] = React.useState([]);
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [isSuccessful, setIsSuccessful] = React.useState(false);
  const [currentToken, setCurrentToken] = React.useState('');
  const history = useHistory();

  const handleEditProfileClick = () => {
    setIsEditProfilePopupOpen(true);
  }

  const handleAddPlaceClick = () => {
    setIsAddPlacePopupOpen(true);
  }

  const handleEditAvatarClick = () => {
    setIsEditAvatarPopupOpen(true);
  }

  const handleCardClick = (card) => {
    setSelectedCard(card);
  }

  const closeAllPopups = () => {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsInfoTooltipOpen(false);
    setSelectedCard({});
  }

  const updateCurrentUser = (data) => {
    const currentUserAdvanced = {...data, email: emailUser};
    setCurrentUser(currentUserAdvanced);
  }

  const handleUpdateUser = (data) => {
    api.setUserInfo(data, currentToken)
      .then((data) => {
        updateCurrentUser(data);
        closeAllPopups();
      })
      .catch((err) => { console.log(`????????????: ${err}`) });
  }

  const handleUpdateAvatar = (data) => {
    api.setUserAvatar(data, currentToken)
      .then((data) => {
        updateCurrentUser(data);
        closeAllPopups();
      })
      .catch((err) => { console.log(`????????????: ${err}`) });
  }


  function handleCardLike(card, isLiked) {
    api.changeLikeCardStatus(card._id, isLiked, currentToken)
      .then((newCard) => {
        setCards((cards) => cards.map((c) => c._id === card._id ? newCard : c));
      })
      .catch((err) => { console.log(`????????????: ${err}`) });
  }

  function handleCardDelete(card) {
    api.removeCard(card._id, currentToken)
      .then(() => {
        setCards((cards) => cards.filter((c) => c._id !== card._id));
      })
      .catch((err) => { console.log(`????????????: ${err}`) });
  }

  function handleAddPlaceSubmit(card) {
    api.addCard(card, currentToken)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => { console.log(`????????????: ${err}`) });
  }

  const handleRegisterUser = (data) => {
    signApi.register(data)
      .then((data) => {
        console.log(data);
        setIsSuccessful(true);
        setIsInfoTooltipOpen(true);
        history.push('./sign-in');
      })
      .catch((err) => {
        setIsSuccessful(false);
        setIsInfoTooltipOpen(true);
        console.log(`????????????: ${err}`)
      });
  }

  const loginByToken = () => {
    const token = localStorage.getItem('token');
    if (token) {
      handleAuthorizationUser(token);
    }
    setCurrentToken(token);   
  }

  const handleLoginUser = (data) => {
    signApi.login(data)
      .then((data) => {
        history.push('./main');
        localStorage.setItem('token', data.token);
        loginByToken();
      })
      .catch((err) => { console.log(`????????????: ${err}`) });
  }

  const handleAuthorizationUser = (token) => {
    signApi.authorization(token)
      .then((data) => {
        setEmailUser(data.email);
        setLoggedIn(true);
        history.push('./main');
      })
      .catch((err) => { console.log(`????????????: ${err}`) });
  }

  const handleExitUser = () => {
    localStorage.removeItem('token');
    setLoggedIn(false);
  }

  React.useEffect(() => {
    loginByToken();
  }, []);

  React.useEffect(() => {
    if (loggedIn) {
      api.getPrifile(currentToken)
      .then((data) => {
        updateCurrentUser(data);
      })
      .catch((err) => { console.log(`????????????: ${err}`) });
    }
  }, [loggedIn]);

  React.useEffect(() => {
    if (loggedIn) {
      api.getInitialCards(currentToken)
        .then((data) => {
          setCards(data);
        })
        .catch((err) => { console.log(`????????????: ${err}`) });
    }
  }, [loggedIn]);

  return (
    <div className="page">
      <CurrentUserContext.Provider value={currentUser}>
        <Header
          onSignOut={handleExitUser}
        />
        <Switch>
          <Route path="/sign-up">
            {loggedIn ? <Redirect to="/main" /> : 
              <Register
                onRegisterUser={handleRegisterUser}           
              />
            }           
          </Route>
          <Route path="/sign-in">
            {loggedIn ? <Redirect to="/main" /> : 
              <Login
                onLoginUser={handleLoginUser}            
              />
            }          
          </Route>
          <ProtectedRoute
            path="/main"
            loggedIn={loggedIn}
            component = {Main}
            
            onEditProfile={handleEditProfileClick}
            onAddPlace={handleAddPlaceClick}
            onEditAvatar={handleEditAvatarClick}
            onCardClick={handleCardClick}
            cards={cards}
            onCardLike={handleCardLike}
            onCardDelete={handleCardDelete}
          /> 

          <Route path="/">
              {loggedIn ? <Redirect to="/main" /> : <Redirect to="/sign-in" />}
          </Route>

        </Switch>

        <Footer />

        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
        />

        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
        />

        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onAddPlace={handleAddPlaceSubmit}
        />

        <InfoTooltip
          isOpen={isInfoTooltipOpen}
          onClose={closeAllPopups}
          isSuccessful={isSuccessful}
          msgSuccessful="???? ?????????????? ????????????????????????????????????!" 
          msgError="??????-???? ?????????? ???? ??????! ???????????????????? ?????? ??????."
        />        

        <PopupWithForm name="remove-card" title="???? ???????????????" textBtn="????">
          <label className="form__field">
            <input className="form__input popup__edit-description" type="url" name="link-avatar" placeholder="???????????? ???? ????????????" required />
            <span className="form__tip link-avatar-error"></span>
          </label>
        </PopupWithForm>

        <ImagePopup
          card={selectedCard}
          onClose={closeAllPopups}
        />
      </CurrentUserContext.Provider>
    </div>
  );
}

export default App;
