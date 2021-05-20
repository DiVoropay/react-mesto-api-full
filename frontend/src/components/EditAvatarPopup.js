import React from 'react';
import PopupWithForm from './PopupWithForm';

function EditAvatarPopup({ isOpen, onClose, onUpdateAvatar }) {

  const avatarRef = React.useRef();

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdateAvatar({
      avatar: avatarRef.current.value
    });
    avatarRef.current.value = '';
  }

  return (
    <PopupWithForm
      name="edit-avatar"
      title="Обновить аватар"
      textBtn="Сохранить"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}>
      <label className="form__field">
        <input className="form__input popup__edit-description"
          ref={avatarRef}
          type="url"
          name="link-avatar"
          placeholder="Ссылка на аватар"
          required
        />
        <span className="form__tip link-avatar-error"></span>
      </label>
    </PopupWithForm>
  )
}

export default EditAvatarPopup;