function randomPositiveNum (leftBorder, rightBorder) {
  if (leftBorder < 0 || rightBorder < 0) {
    return 0;
  }
  if (leftBorder < rightBorder) {
    let left = leftBorder;
    let right =rightBorder;
  } else {
    let left = rightBorder;
    let right = leftBorder;
  }
  return Math.floor(leftBorder + Math.random() * rightBorder);
}

console.log(randomPositiveNum(1, 1));
