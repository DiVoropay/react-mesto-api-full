class Api {
  constructor(options) {
    this._baseUrl = options.baseUrl;
    this._headers = options.headers;
  }

  _collectHeader(token) {
    return {
      ...this._headers,
      'Authorization': `Bearer ${token}`
    }
  }

  _checkResponse(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Ошибка ${res.status}`);
  }

  getPrifile(token) {

    return fetch(`${this._baseUrl}/users/me `, {
      method: 'GET',
      headers: this._collectHeader(token)
    })
      .then(this._checkResponse);
  }

  setUserInfo(data, token) {

    return fetch(`${this._baseUrl}/users/me `, {
      method: 'PATCH',
      headers: this._collectHeader(token),
      body: JSON.stringify(data)
    })
      .then(this._checkResponse);
  }

  setUserAvatar(data, token) {

    return fetch(`${this._baseUrl}/users/me/avatar `, {
      method: 'PATCH',
      headers: this._collectHeader(token),
      body: JSON.stringify(data)
    })
      .then(this._checkResponse);
  }

  getInitialCards(token) {
    return fetch(`${this._baseUrl}/cards`, {
      method: 'GET',
      headers: this._collectHeader(token)
    })
      .then(this._checkResponse);
  }

  addCard(data, token) {
    return fetch(`${this._baseUrl}/cards`, {
      method: 'POST',
      headers: this._collectHeader(token),
      body: JSON.stringify(data)
    })
      .then(this._checkResponse);
  }

  removeCard(id, token) {
    return fetch(`${this._baseUrl}/cards/${id}`, {
      method: 'DELETE',
      headers: this._collectHeader(token)
    })
      .then(this._checkResponse);
  }

  changeLikeCardStatus(id, isLiked, token) {
    return fetch(`${this._baseUrl}/cards/${id}/likes`, {
      method: isLiked ? 'DELETE' : 'PUT',
      headers: this._collectHeader(token)
    })
      .then(this._checkResponse);
  }

}

const api = new Api({
  baseUrl: 'https://api.projectyp.nomoredomains.icu',
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;