import { isEscapeKey } from './utils.js';

const pictureModalElement =  document.querySelector('.big-picture');
const commentCountElement = document.querySelector('.comments-count');
const imageElement = document.querySelector('.big-picture__img img');
const likesCountElement = document.querySelector('.likes-count');
const descriptionElement = document.querySelector('.social__caption');
const buttonCloseElement = document.querySelector('#picture-cancel');
const commentListElement = document.querySelector('.social__comments');
const commentTemplate = document.querySelector('#comment').content.querySelector('.social__comment');

const renderComments = (comments) => {
  commentListElement.innerHTML = '';
  const commentsFragment = document.createDocumentFragment();
  comments.forEach(({avatar, name, message}) => {
    const commentElement = commentTemplate.cloneNode(true);
    commentElement.querySelector('.social__picture').src = avatar;
    commentElement.querySelector('.social__picture').alt = name;
    commentElement.querySelector('.social__text').textContent = message;
    commentsFragment.appendChild(commentElement);
  });
  commentListElement.appendChild(commentsFragment);
};

const closeModalPicture =  () => {
  pictureModalElement.classList.add('hidden');
  document.body.classList.remove('modal-open');
};

const onModalPictureCloseClick = () => {
  closeModalPicture();
};

const onModalPictureKeydown = (evt) => {
  if(isEscapeKey(evt.key)) {
    closeModalPicture();
  }
};

const openModalPicture = ({url, likes,comments, description}) => {
  document.body.classList.add('modal-open');
  pictureModalElement.classList.remove('hidden');
  imageElement.src = url;
  commentCountElement.textContent = comments.length;
  likesCountElement.textContent = likes;
  descriptionElement.textContent = description;
  renderComments(comments);
  document.addEventListener('keydown', onModalPictureKeydown);
  buttonCloseElement.addEventListener('click', onModalPictureCloseClick, {once: true});
};

export {openModalPicture};
