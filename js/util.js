function getRandomPositiveNum (leftBorder, rightBorder) {
  if (leftBorder < 0 || rightBorder < 0) {
    return 0;
  }
  return Math.floor(Math.random() * Math.abs(leftBorder - rightBorder) + Math.min(leftBorder, rightBorder));
}

function checkLength (line, maxLength) {
  return line.length <= maxLength;
}

const isEscapeKey = (key) => key === 'Escape';

export {getRandomPositiveNum, checkLength, isEscapeKey};
