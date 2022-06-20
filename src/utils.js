export const randomInt = (min, max) => {
  return parseInt(randomFloat(min, max), 10);
};

export const randomFloat = (min, max) => {
  return min + Math.random() * (max - min);
};

export const randomItem = (array) => {
  return array[randomInt(0, array.length)];
};

export const calcChance = (min, max, value) => {
  return (max - value) / (max - min);
};

export class Rectangle {
  constructor({ x, y, height, width } = {}) {
    this.x = x;
    this.y = y;
    this.height = height;
    this.width = width;
  }

  getCenter() {
    const centerX = (this.width - this.x) / 2;
    const centerY = (this.height - this.y) / 2;
    return [centerX, centerY];
  }
}

Rectangle.createFrom = ([x, y, width, height] = []) => {
  return new Rectangle({ x, y, height, width });
};
