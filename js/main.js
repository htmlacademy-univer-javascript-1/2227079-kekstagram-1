
function getRandomPositiveNum (leftBorder, rightBorder) {
  if (leftBorder < 0 || rightBorder < 0) {
    return 0;
  }
  return Math.floor(Math.random() * Math.abs(leftBorder - rightBorder) + Math.min(leftBorder, rightBorder));
}

function checkLength (line, maxLength) {
  return line.length <= maxLength;
}


const COMMENTS_MESSAGE = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];

const NAMES = [
  'Димон',
  'Васян',
  'Петька',
  'Славич',
  'Ромыч',
  'Салыч',
  'Сер',
  'Лол'
];

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
