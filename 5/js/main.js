import {getRandomPositiveNum, checkLength} from './util.js';
import {NAMES, COMMENTS_MESSAGE} from './data.js';

const createComments = () => Array.from({length: getRandomPositiveNum(0, 100)}).map((value, index) => ({
  id: index + 1,
  avatar: `img/avatar-${getRandomPositiveNum(1, 6)}.svg`,
  message: COMMENTS_MESSAGE[getRandomPositiveNum(0, COMMENTS_MESSAGE.length - 1)],
  name: NAMES[getRandomPositiveNum(0, NAMES.length - 1)],
}));


const createPhotos = () => Array.from({length: 25}).map((value, index) => ({
  id: index + 1,
  url: `photos/${index + 1}.jpg`,
  description: COMMENTS_MESSAGE[getRandomPositiveNum(0, COMMENTS_MESSAGE.length - 1)],
  likes: getRandomPositiveNum(0, 2000),
  comments: createComments(),
}));

createPhotos();
checkLength('aaaaaaaaaaaaa', 6);
