import {isEscapeKey} from './util.js';
import {uploadDataToServer} from './www-net.js';

const SCALE_MIN = 25;
const SCALE_MAX = 100;
const SCALE_STEP = 25;
const MAX_HASHTAGS_NUM = 5;
const MAX_COMMENT_LENGTH = 140;
const PHOTO_TYPES_ALLOWED = ['jpg', 'jpeg', 'png','gif'];

const EFFECTS = {
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

const regexCheck = /(^#[0-9А-Яа-яЁёA-Za-z]{1,19}$)|(^\s*$)/;

const err = document.querySelector('#error').content.querySelector('.error');
const success = document.querySelector('#success').content.querySelector('.success');
const errButton = err.querySelector('.error__button');
const successButton = success.querySelector('.success__button');

const documentBody = document.querySelector('body');
const documentOverlay = document.querySelector('.img-upload__overlay');
const effectLevelSlider = documentOverlay.querySelector('.effect-level__slider');
const effectLevelValue = documentOverlay.querySelector('.effect-level__value');
const photoUpdateEffectLevel = documentOverlay.querySelector('.img-upload__effect-level');
const scaleControlSmaller = documentOverlay.querySelector('.scale__control--smaller');
const scaleControlBigger = documentOverlay.querySelector('.scale__control--bigger');
const scaleControlValue = documentOverlay.querySelector('.scale__control--value');
const photoUpdatePreview = documentOverlay.querySelector('.img-upload__preview');

const photoUpdateForm = document.querySelector('.img-upload__form');
const submitButton = photoUpdateForm.querySelector('.img-upload__submit');
const fileUpdateButton = document.querySelector('#upload-file');
const textHashtags = photoUpdateForm.querySelector('.text__hashtags');
const textDescription = photoUpdateForm.querySelector('.text__description');
const closeFormButton = document.querySelector('#upload-cancel');

let currentEffect;

const hasDuplicates = (arr) => new Set(arr).size !== arr.length;

const checkHashtags = (value) => {
  if(value === '') {
    return true;
  }
  const separatedHashtags = value.split(' ');
  if (separatedHashtags.length > MAX_HASHTAGS_NUM) {
    return false;
  }
  const values = separatedHashtags.map((element) => element.toLowerCase());
  if (hasDuplicates(values)) {
    return false;
  }
  return separatedHashtags.every((element) => regexCheck.test(element));
};

const disableSubmitButton = () => {
  submitButton.textContent = 'Подождите...';
  submitButton.disabled = true;
};

const enableSubmitButton = () => {
  submitButton.textContent = 'Опубликовать';
  submitButton.disabled = false;
};

const checkedHashtagsValue = (value) => checkHashtags(value);

const checkedCommentsValue = (value) => value.length <= MAX_COMMENT_LENGTH;

const pristine = new Pristine(photoUpdateForm, {
  classTo: 'img-upload__field-wrapper',
  errorTextParent: 'img-upload__field-wrapper',
  errorTextClass: 'text-invalid__error'
}, true);

pristine.addValidator(
  textHashtags,
  (value) => checkedHashtagsValue(value),
  'Неверно введены хештэги'
);

pristine.addValidator(
  textDescription,
  (value) => checkedCommentsValue(value),
  `Максимальная длина комментария составляет ${MAX_COMMENT_LENGTH} символов!`
);

const closeSuccessErrMessages = () => {
  if (documentBody.contains(err)) {
    documentBody.removeChild(err);
    documentOverlay.classList.remove('hidden');
  }
  if (documentBody.contains(success)) {
    documentBody.removeChild(success);
  }
  document.removeEventListener('keydown', onEscapeKeydownErr);
  document.removeEventListener('click', onClickSuccess);
  document.removeEventListener('click', onClickErr);
  successButton.removeEventListener('click', closeSuccessErrMessages);
  errButton.removeEventListener('click', closeSuccessErrMessages);
};

const formSubmit = (evt) => {
  evt.preventDefault();
  const isValid = pristine.validate();
  if (isValid) {
    disableSubmitButton();
    uploadDataToServer(
      () => {
        closeOverlayImage();
        enableSubmitButton();
        document.addEventListener('keydown', onEscapeKeydownErr);
        document.addEventListener('click', onClickSuccess);
        successButton.addEventListener('click', closeSuccessErrMessages);
        documentBody.appendChild(success);
      },
      () => {
        documentOverlay.classList.add('hidden');
        enableSubmitButton();
        document.addEventListener('keydown', onEscapeKeydownErr);
        document.addEventListener('click', onClickErr);
        errButton.addEventListener('click', closeSuccessErrMessages);
        documentBody.appendChild(err);
      },
      new FormData(evt.target),
    );
  }
};

function onClickSuccess (evt) {
  if (evt.target === success) {
    closeSuccessErrMessages();
  }
}

function onClickErr (evt) {
  if (evt.target === err) {
    closeSuccessErrMessages();
  }
}

function onEscapeKeydownErr (evt) {
  if (isEscapeKey(evt.key)) {
    closeSuccessErrMessages();
  }
}

photoUpdateForm.addEventListener('submit', formSubmit);

const scaleValuePercentageClear =() => scaleControlValue.value.replace('%', '');

const updateScale = (newValue) => {
  scaleControlValue.value = `${newValue}%`;
  photoUpdatePreview.style.transform = `scale(${newValue / 100})`;
};

const onScaleSmallerClick = () => {
  if(scaleValuePercentageClear() > SCALE_MIN) {
    const newValue = Math.min(parseInt(scaleControlValue.value, 10) - SCALE_STEP, 100);
    updateScale(newValue);
  }
};

const onScaleBiggerClick = () => {
  if(scaleValuePercentageClear() < SCALE_MAX) {
    const newValue = Math.min(parseInt(scaleControlValue.value, 10) + SCALE_STEP, 100);
    updateScale(newValue);
  }
};

const onChangePhotoEffects = (evt) => {
  currentEffect = evt.target.value;
  const effectConfig = EFFECTS[currentEffect];
  if (!effectConfig) {
    photoUpdateEffectLevel.classList.add('hidden');
    photoUpdatePreview.style.filter = 'none';
    return;
  }
  photoUpdateEffectLevel.classList.remove('hidden');
  const {min, max, step} = effectConfig;
  effectLevelSlider.noUiSlider.updateOptions({
    range: {min, max},
    start: max,
    step,
  });
  photoUpdatePreview.className = 'img-upload__preview';
  const effectsPreview = evt.target.parentNode.querySelector('.effects__preview');
  photoUpdatePreview.classList.add(effectsPreview.getAttribute('class').split('  ')[1]);
};

const onSliderUpdate = () => {
  const sliderValue = effectLevelSlider.noUiSlider.get();
  effectLevelValue.value = sliderValue;
  const effectConfig = EFFECTS[currentEffect];
  photoUpdatePreview.style.filter = effectConfig
    ? `${effectConfig.filterName}(${sliderValue}${effectConfig.valueUnit})`
    : '';
};

const inPhoto = document.querySelector('input[type=file]');
const photoUploadPreview = document.querySelector('.img-upload__preview').querySelector('img');

inPhoto.addEventListener('change', () => {
  const photo = inPhoto.files[0];
  const nameOfPhoto = photo.name.toLowerCase();
  if (PHOTO_TYPES_ALLOWED.some((it) => nameOfPhoto.endsWith(it))) {
    photoUploadPreview.src = URL.createObjectURL(photo);
  }
});

function closeOverlayImage () {
  photoUpdateForm.reset();
  documentOverlay.classList.add('hidden');
  document.body.classList.remove('modal-open');
  scaleControlSmaller.removeEventListener('click', onScaleSmallerClick);
  scaleControlBigger.removeEventListener('click', onScaleBiggerClick);
  photoUpdateForm.removeEventListener('change', onChangePhotoEffects);
  document.removeEventListener('keydown', onEscapeKeydown);
  photoUpdateForm.removeEventListener('submit', formSubmit);
  documentOverlay.classList.add('hidden');
  document.body.classList.remove('modal-open');
  effectLevelSlider.noUiSlider.destroy();
  pristine.destroy();
}

function onEscapeKeydown(evt) {
  if (isEscapeKey(evt.key) && evt.target !== textHashtags && evt.target !== textDescription && !documentBody.contains(err)) {
    evt.preventDefault();
    closeOverlayImage();
  }
}

const onCloseClick = () => {
  closeOverlayImage();
};

fileUpdateButton.addEventListener('change', () => {
  document.addEventListener('keydown', onEscapeKeydown);
  closeFormButton.addEventListener('click', onCloseClick, {once: true});
  document.body.classList.add('modal-open');
  documentOverlay.classList.remove('hidden');

  scaleControlSmaller.addEventListener('click', onScaleSmallerClick);
  scaleControlBigger.addEventListener('click', onScaleBiggerClick);
  scaleControlValue.value = '100%';

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
  scaleControlSmaller.addEventListener('click', onScaleSmallerClick);
  scaleControlBigger.addEventListener('click', onScaleBiggerClick);
  scaleControlValue.value = '100%';
  currentEffect = 'effect-none';
  photoUpdatePreview.className = 'img-upload__preview';
  photoUpdatePreview.classList.add('effects__preview--none');
  photoUpdateForm.addEventListener('change', onChangePhotoEffects);
  effectLevelSlider.noUiSlider.on('update', onSliderUpdate);
  photoUpdateEffectLevel.classList.add('hidden');
  photoUpdatePreview.style.transform = 'scale(1)';
  photoUpdatePreview.style.filter = 'none';
});
