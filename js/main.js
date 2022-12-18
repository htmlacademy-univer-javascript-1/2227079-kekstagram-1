import {initializePhoto} from './pictures.js';
import './image-update.js';
import {loadDataFromServer} from './www-net.js';

const body = document.querySelector('body');

const showDownloadErrorMessage = () => {
  const errorDiv = document.createElement('div');
  errorDiv.textContent = 'Что-то прошло не так. Пожалуйста, проверьте подключение к интернету и перезагрузите страницу.';
  errorDiv.style.zIndex = '50';
  errorDiv.style.backgroundColor = 'rgba(65, 65, 65)';
  errorDiv.style.position = 'fixed';
  errorDiv.style.left = '35%';
  errorDiv.style.top = '35%';
  errorDiv.style.width = '30%';
  errorDiv.style.height = '30%';
  errorDiv.style.display = 'flex';
  errorDiv.style.alignItems = 'center';
  errorDiv.style.fontSize = '22px';
  errorDiv.style.lineHeight = '1.5';
  errorDiv.style.textAlign = 'center';
  errorDiv.style.color = '#e9dc45';
  errorDiv.style.borderRadius = '15px';
  body.appendChild(errorDiv);
};

loadDataFromServer((photos) => {
  initializePhoto(photos);
},
() => {
  showDownloadErrorMessage();
});
