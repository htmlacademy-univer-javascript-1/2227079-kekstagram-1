import {isEscapeKey} from './util.js';

const imageUpdateForm = document.querySelector('.img-upload__form');
const submitButton = imageUpdateForm.querySelector('.img-upload__submit');
const fileUpdateButton = document.querySelector('#upload-file');
const overlay = document.querySelector('.img-upload__overlay');
const textHashtags = imageUpdateForm.querySelector('.text__hashtags');
const textDescription = imageUpdateForm.querySelector('.text__description');
const closeFormButton = document.querySelector('#upload-cancel');

let isCommentValid = true;
let isHashtagInputValid = true;

const regexCheck = /(^#[0-9А-Яа-яЁёA-Za-z]{1,19}$)|(^\s*$)/;

const hasDuplicates = (arr) => new Set(arr).size !== arr.length;

const checkHashtagsInput = (value) => {
  const separateHashtags = value.split(' ');
  if (separateHashtags.length > 5) {return false;}
  const values = separateHashtags.map((e) => e.toLowerCase());
  if (hasDuplicates(values)) {return false;}
  return separateHashtags.every((e) => regexCheck.test(e));
};

const disableSubmitButton = () => {submitButton.disabled = !isHashtagInputValid || !isCommentValid;};

const checkHashtags = (value) => {
  isHashtagInputValid = checkHashtagsInput(value);
  disableSubmitButton();
};

const checkComments = (value) => {
  isCommentValid = value.length <= 140;
  disableSubmitButton();
};

const pristine = new Pristine(imageUpdateForm, {
  classTo: 'form-group',
  errorClass: 'has-danger',
  successClass: 'has-success',
  errorTextParent: 'form-group',
  errorTextTag: 'div',
  errorTextClass: 'text-help'
}, true);

pristine.addValidator(
  textHashtags,
  checkHashtags,
  'Некорректно указаны хештэги'
);

pristine.addValidator(
  textDescription,
  checkComments,
  'Максимальная длина комментария 140 символов'
);

imageUpdateForm.addEventListener('submit', () => {
  pristine.validate();
});

const closeOverlay = () => {
  fileUpdateButton.value = '';
  textDescription.value = '';
  textHashtags.value = '';
  overlay.classList.add('hidden');
  document.body.classList.remove('modal-open');
};

const onEscapeKeydown = (evt) => {
  if (isEscapeKey(evt.key) && evt.target !== textHashtags && evt.target !== textDescription) {closeOverlay();}
  evt.preventDefault();
  closeOverlay();
};

fileUpdateButton.addEventListener('change', () => {
  document.addEventListener('keydown', onEscapeKeydown);
  closeFormButton.addEventListener('click', closeOverlay, {once: true});
  document.body.classList.add('modal-open');
  overlay.classList.remove('hidden');
});
