import React from 'react';
import Form from './Form';

function Login({ onLoginUser }) {

  const [email, setEmail] = React.useState();
  const [password, setPassword] = React.useState();

  const handleChangeEmail = (e) => {
    setEmail(e.target.value);
  }

  const handleChangePassword = (e) => {
    setPassword(e.target.value);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    onLoginUser({
      password,
      email      
    });
  }

  return (
    <Form
      name="login"
      title="Вход"
      textBtn="Войти"
      onSubmit={handleSubmit}>
        <label className="form__field">
          <input className="form__input form__input_black"
            onChange={handleChangeEmail}
            value={email || ''}
            type="text" name="email"
            placeholder="Email"
            minLength="5"
            maxLength="40"
            required
          />
          <span className="form__tip firstname-error"></span>
        </label>
        <label className="form__field">
          <input className="form__input form__input_black"
            onChange={handleChangePassword}
            value={password || ''}
            type="password"
            name="password"
            placeholder="Пароль"
            minLength="4"
            maxLength="16"
            required
          />
          <span className="form__tip about-error"></span>
        </label>
    </Form>
  );

}

export default Login;
