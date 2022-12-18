import {openModalPicture} from './modal.js';
import {debounce} from './util.js';
import {faker} from 'https://cdn.skypack.dev/@faker-js/faker';

const DELAY_VALUE = 500;
const NUMBER_OF_RANDOM_PICTURES = 10;

const photoListElement = document.querySelector('.pictures');
const photoFragment = document.createDocumentFragment();
const photoTemplate = document.querySelector('#picture').content.querySelector('.picture');

const buttonFilterDefault = document.querySelector('#filter-default');
const buttonFilterRandom = document.querySelector('#filter-random');
const buttonFilterDiscussed = document.querySelector('#filter-discussed');
const photoFiltersForm = document.querySelector('.img-filters__form');
const photoFilters = document.querySelector('.img-filters');

let selectedFilter = 'filter-default', photoToRender, renderedPhoto = [];

const appendPhoto = (picture) => {
  const { id, url, likes, comments } = picture;
  const photoElement = photoTemplate.cloneNode(true);
  photoElement.querySelector('.picture__img').src = url;
  photoElement.querySelector('.picture__likes').textContent = likes;
  photoElement.querySelector('.picture__comments').textContent = comments.length;
  photoElement.dataset.id = id;
  photoFragment.appendChild(photoElement);
  renderedPhoto.push(photoElement);
};

const removePhoto = (picture) => {
  photoListElement.removeChild(picture);
};

const clearPhoto = () => {
  renderedPhoto.forEach((picture) => removePhoto(picture));
  renderedPhoto = [];
};

const renderPhoto = () => {
  clearPhoto();
  photoToRender.forEach(appendPhoto);
  photoListElement.appendChild(photoFragment);
  photoListElement.addEventListener('click', (evt) => {
    const photoElement = evt.target.closest('.picture');
    if (photoElement) {
      const clickedPhoto = photoToRender.find(({ id }) => Number(photoElement.dataset.id) === id);
      openModalPicture(clickedPhoto);
    }
  });
};

const setActive = (button) => {
  buttonFilterDefault.classList.remove('img-filters__button--active');
  buttonFilterRandom.classList.remove('img-filters__button--active');
  buttonFilterDiscussed.classList.remove('img-filters__button--active');
  button.classList.add('img-filters__button--active');
};

const initializePhoto = (photos) => {
  photoFilters.classList.remove('img-filters--inactive');
  photoToRender = photos;
  renderPhoto();
  photoFiltersForm.addEventListener('click', (evt) => {
    const defaultPhoto = Array.from(photos);
    const randomPhoto =  Array.from(photos);
    const discussedPhoto = Array.from(photos).sort((a, b) => b.comments.length - a.comments.length);
    const newFilter = evt.target.id;
    const renderWithDelay = debounce(renderPhoto, DELAY_VALUE);
    switch(newFilter) {
      case 'filter-default':
        setActive(buttonFilterDefault);
        photoToRender = defaultPhoto;
        break;
      case 'filter-random':
        setActive(buttonFilterRandom);
        photoToRender = faker.helpers.shuffle(randomPhoto).slice(0, NUMBER_OF_RANDOM_PICTURES);
        break;
      case 'filter-discussed':
        setActive(buttonFilterDiscussed);
        photoToRender = discussedPhoto;
        break;
    }
    if(selectedFilter !== newFilter) {
      selectedFilter = newFilter;
      renderWithDelay();
    }
  });
};

export {initializePhoto};
