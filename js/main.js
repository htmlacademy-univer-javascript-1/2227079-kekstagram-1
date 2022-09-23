function randomPositiveNum (leftBorder, rightBorder) {
  if (leftBorder < 0 || rightBorder < 0) {
    return 0;
  }
  return Math.floor(Math.random() * Math.abs(leftBorder - rightBorder) + Math.min(leftBorder, rightBorder));
}

function lengthCheck (line, maxLength) {
  return line.length <= maxLength;
}

// eslint-disable-next-line no-console
console.log(randomPositiveNum(1, 10));
// eslint-disable-next-line no-console
console.log(lengthCheck('aaaa', 10));

