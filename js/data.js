import {getRandomPositiveNum, checkLength} from './util.js';
import { faker } from 'https://cdn.skypack.dev/@faker-js/faker';

const PHOTOS_NUMBER = 25;
const MIN_LIKES_NUMBER  = 15;
const MAX_LIKES_NUMBER  = 200;
const MAX_AVATAR_NUM = 6;

const COMMENTS_MESSAGE = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];

const createComments = () => Array.from({length: getRandomPositiveNum(0, 100)}).map((value, index) => ({
  id: index + 1,
  avatar: `img/avatar-${getRandomPositiveNum(1, MAX_AVATAR_NUM)}.svg`,
  message: COMMENTS_MESSAGE[getRandomPositiveNum(0, COMMENTS_MESSAGE.length - 1)],
  name: faker.name.firstName()
}));


const createPhotos = () => Array.from({length: PHOTOS_NUMBER}).map((value, index) => ({
  id: index + 1,
  url: `photos/${index + 1}.jpg`,
  description: COMMENTS_MESSAGE[getRandomPositiveNum(0, COMMENTS_MESSAGE.length - 1)],
  likes: getRandomPositiveNum(MIN_LIKES_NUMBER, MAX_LIKES_NUMBER),
  comments: createComments(),
}));

const arrayOfPhotos = Array.from({length: PHOTOS_NUMBER}, createPhotos());

createPhotos();
checkLength('aaaaaaaaaaaaa', 6);

export {arrayOfPhotos};
