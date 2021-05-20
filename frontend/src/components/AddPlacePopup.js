import React from 'react';
import PopupWithForm from './PopupWithForm';

function AddPlacePopup({ isOpen, onClose, onAddPlace }) {

  const [name, setName] = React.useState();
  const [link, setLink] = React.useState();

  const handleChangeName = (e) => {
    setName(e.target.value);
  }

  const handleChangeLink = (e) => {
    setLink(e.target.value);
  }

  const resetInputs = () => {
    setName('');
    setLink('');
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddPlace({
      name,
      link
    });
    resetInputs();
  }

  const handleClose = () => {
    onClose();
    resetInputs();
  }


  return (
    <PopupWithForm
      name="add-card"
      title="Новое место"
      textBtn="Создать"
      isOpen={isOpen}
      onClose={handleClose}
      onSubmit={handleSubmit}>
      <label className="form__field">
        <input className="form__input popup__edit-name"
          onChange={handleChangeName}
          value={name || ''}
          type="text"
          name="place-name"
          placeholder="Название"
          minLength="2"
          maxLength="30"
          required
        />
        <span className="form__tip place-name-error"></span>
      </label>
      <label className="form__field">
        <input className="form__input popup__edit-description"
          onChange={handleChangeLink}
          value={link || ''}
          type="url"
          name="link-image"
          placeholder="Ссылка на картинку"
          required
        />
        <span className="form__tip link-image-error"></span>
      </label>
    </PopupWithForm>
  )
}

export default AddPlacePopup;
