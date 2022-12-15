import {isEscapeKey} from './util.js';
import {uploadDataToServer} from './www-net.js';

const SCALE_MIN = 25;
const SCALE_MAX = 100;
const SCALE_STEP = 25;
const MAX_HASHTAGS_NUM = 5;
const MAX_COMMENT_LENGTH = 140;

const error = document.querySelector('#error').content.querySelector('.error');
const success = document.querySelector('#success').content.querySelector('.success');
const errorButton = error.querySelector('.error__button');
const successButton = success.querySelector('.success__button');

const body = document.querySelector('body');
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

const regexCheck = /(^#[0-9А-Яа-яЁёA-Za-z]{1,19}$)|(^\s*$)/;

const hasDuplicates = (arr) => new Set(arr).size !== arr.length;

const checkHashtagsInput = (value) => {
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

const checkHashtags = (value) => checkHashtagsInput(value);

const checkComments = (value) => value.length <= MAX_COMMENT_LENGTH;

const pristine = new Pristine(imageUpdateForm, {
  classTo: 'img-upload__field-wrapper',
  errorTextParent: 'img-upload__field-wrapper',
  errorTextClass: 'text-invalid__error'
}, true);

pristine.addValidator(
  textHashtags,
  (value) => checkHashtags(value),
  'Некорректно указаны хештэги'
);


pristine.addValidator(
  textDescription,
  (value) => checkComments(value),
  `Максимальная длина комментария ${MAX_COMMENT_LENGTH} символов`
);

const closeSuccessErrorMessages = () => {
  if (body.contains(error)) {
    body.removeChild(error);
    overlay.classList.remove('hidden');
  }
  if (body.contains(success)) {
    body.removeChild(success);
  }
  document.removeEventListener('keydown', onEscapeKeydownError);
  document.removeEventListener('click', onClickSuccess);
  successButton.removeEventListener('click', closeSuccessErrorMessages);
  document.removeEventListener('click', onClickError);
  errorButton.removeEventListener('click', closeSuccessErrorMessages);
};

const onFormSubmit = (evt) => {
  evt.preventDefault();
  const isValid = pristine.validate();
  if (isValid) {
    disableSubmitButton();
    uploadDataToServer(
      () => {
        closeOverlay();
        enableSubmitButton();
        document.addEventListener('keydown', onEscapeKeydownError);
        document.addEventListener('click', onClickSuccess);
        successButton.addEventListener('click', closeSuccessErrorMessages);
        body.appendChild(success);
      },
      () => {
        overlay.classList.add('hidden');
        enableSubmitButton();
        document.addEventListener('keydown', onEscapeKeydownError);
        document.addEventListener('click', onClickError);
        errorButton.addEventListener('click', closeSuccessErrorMessages);
        body.appendChild(error);
      },
      new FormData(evt.target),
    );
  }
};

function onClickSuccess (evt) {
  if (evt.target === success) {
    closeSuccessErrorMessages();
  }
}

function onClickError (evt) {
  if (evt.target === error) {
    closeSuccessErrorMessages();
  }
}

function onEscapeKeydownError (evt) {
  if (isEscapeKey(evt.key)) {
    closeSuccessErrorMessages();
  }
}


imageUpdateForm.addEventListener('submit', onFormSubmit);

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

function closeOverlay () {
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
}

function onEscapeKeydown(evt) {
  if (isEscapeKey(evt.key) && evt.target !== textHashtags && evt.target !== textDescription && !body.contains(error)) {
    evt.preventDefault();
    closeOverlay();
  }
}

const onCloseClick = () => {
  closeOverlay();
};

fileUpdateButton.addEventListener('change', () => {
  document.addEventListener('keydown', onEscapeKeydown);
  closeFormButton.addEventListener('click', onCloseClick, {once: true});
  document.body.classList.add('modal-open');
  overlay.classList.remove('hidden');

  scaleControlSmaller.addEventListener('click', onScaleControlSmallerClick);
  scaleControlBigger.addEventListener('click', onScaleControlBiggerClick);
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
});
