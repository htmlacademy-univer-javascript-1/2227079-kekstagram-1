function randomPositiveNum (leftBorder, rightBorder) {
  if (leftBorder < 0 || rightBorder < 0) {
    return 0;
  }
  let left;
  let right;
  if (leftBorder < rightBorder) {
    left = leftBorder;
    right =rightBorder;
  } else {
    left = rightBorder;
    right = leftBorder;
  }
  return Math.floor(left + Math.random() * right);
}

function lengthCheck (line, maxLength) {
  return line.length <= maxLength;
}

// eslint-disable-next-line no-console
console.log(randomPositiveNum(1, 1));
// eslint-disable-next-line no-console
console.log(lengthCheck('aaaa', 10));

