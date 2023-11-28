const crypto = require('crypto');

function groupBy(array, property) {
    return array.reduce((result, currentItem) => {
        const key = currentItem[property];
        if (!result[key]) {
            result[key] = [];
        }
        result[key].push(currentItem);
        return result;
    }, {});
} 

function generateRandomId(length) {
  return crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
}

function deepUpdate(objA, objB) {
    for (const key in objB) {
      if (objA.hasOwnProperty(key)) {
        if (typeof objB[key] === 'object' && objB[key] !== null && typeof objA[key] === 'object' && objA[key] !== null) {
          deepUpdate(objA[key], objB[key]);
        } else {
          objA[key] = objB[key];
        }
      }
    }
  }

module.exports = {
    groupBy,
    generateRandomId,
    deepUpdate,
}
