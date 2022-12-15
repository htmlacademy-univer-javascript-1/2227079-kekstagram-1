const MESSAGE_LOAD_ERROR = 'Ошибка. Не удалось загрузить данные.';
const MESSAGE_UPLOAD_ERROR = 'Ошибка при отправке формы.';
const SERVER__LINK_LOAD = 'https://26.javascript.pages.academy/kekstagram/data';
const SERVER__LINK_UPLOAD = 'https://26.javascript.pages.academy/kekstagram';

const uploadDataToServer = (onSuccess, onFail, body) => {
  fetch(
    SERVER__LINK_UPLOAD,
    {
      method: 'POST',
      body,
    },
  )
    .then((response) => {
      if (response.ok) {
        onSuccess();
      } else {
        onFail(MESSAGE_UPLOAD_ERROR);
      }
    })
    .catch(() => {
      onFail(MESSAGE_UPLOAD_ERROR);
    });
};

const loadDataFromServer = (onSuccess, onFail) => {
  fetch(SERVER__LINK_LOAD)
    .then((response) => {
      if (response.ok) {
        response.json().then((posts) => {
          onSuccess(posts);
        });
      } else {
        throw new Error('Bad response');
      }
    })
    .catch(() => {
      onFail(MESSAGE_LOAD_ERROR);
    });
};


export {loadDataFromServer, uploadDataToServer};
