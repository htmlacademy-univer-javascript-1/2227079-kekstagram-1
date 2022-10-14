function getrandomPositiveNum (leftBorder, rightBorder) {
  if (leftBorder < 0 || rightBorder < 0) {
    return 0;
  }
  return Math.floor(Math.random() * Math.abs(leftBorder - rightBorder) + Math.min(leftBorder, rightBorder));
}

function checkLength (line, maxLength) {
  return line.length <= maxLength;
}

// eslint-disable-next-line no-console
console.log(getrandomPositiveNum(1000, 1001));
// eslint-disable-next-line no-console
console.log(checkLength('aaaa', 10));

