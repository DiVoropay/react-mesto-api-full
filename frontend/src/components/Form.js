import React from 'react';
import {Link, Route } from 'react-router-dom';

function Form({ name, title, textBtn, children, onSubmit }) {

  return (
    <div className={``}>
      <form className="form sign" name={name} onSubmit={onSubmit} noValidate>
        <h2 className="form__title">
          {title}
        </h2>
        {children}
        <button className="form__button-submit page-hover" type="submit">
          {textBtn}
        </button>
        <Route path="/sign-up">
          <Link className="form__link form__link_white page-hover" to="./sign-in">Уже зарегистрированы? Войти</Link>
        </Route>        
      </form>
    </div>
  );

}

export default Form;
