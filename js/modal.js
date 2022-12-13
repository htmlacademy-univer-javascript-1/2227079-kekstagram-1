import { isEscapeKey } from './util.js';


const pictureModalElement =  document.querySelector('.big-picture');
const currentCommentsCountElement = pictureModalElement.querySelector('.social__comment-count');
const commentsLoaderElement = pictureModalElement.querySelector('.social__comments-loader');
const commentCountElement = document.querySelector('.comments-count');
const imageElement = document.querySelector('.big-picture__img img');
const likesCountElement = document.querySelector('.likes-count');
const descriptionElement = document.querySelector('.social__caption');
const buttonCloseElement = document.querySelector('#picture-cancel');
const commentListElement = document.querySelector('.social__comments');
const commentTemplate = document.querySelector('#comment').content.querySelector('.social__comment');

let currentListOfComments;
let numberOfComments;
let currentNumberOfRenderedComments = 0;

const renderComment = (comment) => {
  const commentElement = commentTemplate.cloneNode(true);
  commentElement.querySelector('.social__picture').src = comment.avatar;
  commentElement.querySelector('.social__picture').alt = comment.name;
  commentElement.querySelector('.social__text').textContent = comment.message;
  commentListElement.appendChild(commentElement);
};

function renderComments (commentsNumber)  {
  commentsNumber = typeof commentsNumber === 'undefined' ? commentsNumber : 5;
  do  {
    renderComment(currentListOfComments[currentNumberOfRenderedComments]);
    commentsNumber--;
    currentNumberOfRenderedComments++;
  } while (currentNumberOfRenderedComments !== numberOfComments && commentsNumber > 0);
  if (currentNumberOfRenderedComments === numberOfComments) {commentsLoaderElement.classList.add('hidden');}
  currentCommentsCountElement.textContent = `Показано ${currentNumberOfRenderedComments} из ${numberOfComments} комментариев`;
}

const closeModalPicture =  () => {
  pictureModalElement.classList.add('hidden');
  currentCommentsCountElement.classList.add('hidden');
  commentsLoaderElement.classList.add('hidden');
  document.body.classList.remove('modal-open');
  commentsLoaderElement.removeEventListener('click', renderComments);
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
  currentCommentsCountElement.classList.remove('hidden');
  commentListElement.textContent = '';
  currentNumberOfRenderedComments = 0;
  currentListOfComments = comments;
  numberOfComments = currentListOfComments.length;
  if (comments.length <= 5) {
    commentsLoaderElement.classList.add('hidden');
  } else {
    commentsLoaderElement.classList.remove('hidden');
    commentsLoaderElement.addEventListener('click', renderComments);
  }
  const initialCommentsNumber = numberOfComments <= 5 ? numberOfComments : 5;
  renderComments(initialCommentsNumber);
  document.addEventListener('keydown', onModalPictureKeydown);
  buttonCloseElement.addEventListener('click', onModalPictureCloseClick, {once: true});
};

export {openModalPicture};
