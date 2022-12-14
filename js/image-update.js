import {isEscapeKey} from './util.js';

const SCALE_MIN = 25;
const SCALE_MAX = 100;
const SCALE_STEP = 25;

const overlay = document.querySelector('.img-upload__overlay');
const effectLevelSlider = overlay.querySelector('.effect-level__slider');
const effectLevelValue = overlay.querySelector('.effect-level__value');
const imageUpdateEffectLevel = overlay.querySelector('.img-upload__effect-level');
const scaleControlSmaller = overlay.querySelector('.scale__control--smaller');
const scaleControlBigger = overlay.querySelector('.scale__control--bigger');
const scaleControlValue = overlay.querySelector('.scale__control--value');
const imageUpdatePreview = overlay.querySelector('.img-upload__preview');

const PHOTO_EFFECTS = {
  'chrome': {
    filterName: 'grayscale',
    valueUnit: '',
    min: 0,
    max: 1,
    start: 1,
    step: 0.1,
    connect: 'lower'
  },
  'sepia': {
    filterName: 'sepia',
    valueUnit: '',
    min: 0,
    max: 1,
    start: 1,
    step: 0.1,
    connect: 'lower'
  },
  'marvin': {
    filterName: 'invert',
    valueUnit: '%',
    min: 0,
    max: 100,
    start: 100,
    step: 1,
    connect: 'lower'
  },
  'phobos': {
    filterName: 'blur',
    valueUnit: 'px',
    min: 0,
    max: 3,
    start: 3,
    step: 0.1,
    connect: 'lower'
  },
  'heat': {
    filterName: 'brightness',
    valueUnit: '',
    min: 1,
    max: 3,
    start: 3,
    step: 0.1,
    connect: 'lower'
  },
};

let currentEffect;

const imageUpdateForm = document.querySelector('.img-upload__form');
const submitButton = imageUpdateForm.querySelector('.img-upload__submit');
const fileUpdateButton = document.querySelector('#upload-file');
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

const onFormSubmit = (evt) => {
  const isValid = pristine.validate();
  if (!isValid) {
    evt.preventDefault();
  }
};

imageUpdateForm.addEventListener('submit', onFormSubmit);

noUiSlider.create(
  effectLevelSlider, {
    range: {
      min: 0,
      max: 100,
    },
    start: 100,
    connect: 'lower'
  }
);

const removePercentage =() => scaleControlValue.value.replace('%', '');

const updateScale = (newValue) => {
  scaleControlValue.value = `${newValue}%`;
  imageUpdatePreview.style.transform = `scale(${newValue / 100})`;
};

const onScaleControlSmallerClick = () => {
  if(removePercentage() > SCALE_MIN) {
    const newValue = Math.min(parseInt(scaleControlValue.value, 10) - SCALE_STEP, 100);
    updateScale(newValue);
  }
};

const onScaleControlBiggerClick = () => {
  if(removePercentage() < SCALE_MAX) {
    const newValue = Math.min(parseInt(scaleControlValue.value, 10) + SCALE_STEP, 100);
    updateScale(newValue);
  }
};

const onChangeEffects = (evt) => {
  currentEffect = evt.target.value;
  const effectConfig = PHOTO_EFFECTS[currentEffect];
  if (!effectConfig) {
    imageUpdateEffectLevel.classList.add('hidden');
    imageUpdatePreview.style.filter = 'none';
    return;
  }
  imageUpdateEffectLevel.classList.remove('hidden');
  const {min, max, step} = effectConfig;
  effectLevelSlider.noUiSlider.updateOptions({
    range: {min, max},
    start: max,
    step,
  });
  imageUpdatePreview.className = 'img-upload__preview';
  const effectsPreview = evt.target.parentNode.querySelector('.effects__preview');
  imageUpdatePreview.classList.add(effectsPreview.getAttribute('class').split('  ')[1]);
};

const onSliderUpdate = () => {
  const sliderValue = effectLevelSlider.noUiSlider.get();
  effectLevelValue.value = sliderValue;
  const effectConfig = PHOTO_EFFECTS[currentEffect];
  imageUpdatePreview.style.filter = effectConfig
    ? `${effectConfig.filterName}(${sliderValue}${effectConfig.valueUnit})`
    : '';
};

const closeOverlay = () => {
  imageUpdateForm.reset();
  overlay.classList.add('hidden');
  document.body.classList.remove('modal-open');
  scaleControlSmaller.removeEventListener('click', onScaleControlSmallerClick);
  scaleControlBigger.removeEventListener('click', onScaleControlBiggerClick);
  imageUpdateForm.removeEventListener('change', onChangeEffects);
  document.removeEventListener('keydown', onEscapeKeydown);
  imageUpdateForm.removeEventListener('submit', onFormSubmit);
  overlay.classList.add('hidden');
  document.body.classList.remove('modal-open');
  effectLevelSlider.noUiSlider.destroy();
  pristine.destroy();
};

function onEscapeKeydown(evt) {
  if (isEscapeKey(evt.key) && evt.target !== textHashtags && evt.target !== textDescription) {closeOverlay();}
  evt.preventDefault();
  closeOverlay();
}

fileUpdateButton.addEventListener('change', () => {
  document.addEventListener('keydown', onEscapeKeydown);
  closeFormButton.addEventListener('click', closeOverlay, {once: true});
  document.body.classList.add('modal-open');
  overlay.classList.remove('hidden');
});

scaleControlSmaller.addEventListener('click', onScaleControlSmallerClick);
scaleControlBigger.addEventListener('click', onScaleControlBiggerClick);
scaleControlValue.value = '100%';
currentEffect = 'effect-none';
imageUpdatePreview.className = 'img-upload__preview';
imageUpdatePreview.classList.add('effects__preview--none');
imageUpdateForm.addEventListener('change', onChangeEffects);
effectLevelSlider.noUiSlider.on('update', onSliderUpdate);
imageUpdateEffectLevel.classList.add('hidden');
imageUpdatePreview.style.transform = 'scale(1)';
imageUpdatePreview.style.filter = 'none';
