"use strict";

/**
 * Concatenate one array onto another if the second array is populated.
 * If not populated, just return the first array, no extra empty slots.
 *
 * @param {array} a1 - The first array to concatenate.
 * @param {array} a2 - The second array to concatenate.
 *
 * @return {array}
 */
function concatPopulated(a1, a2) {
  return (a2 instanceof Array && a2.length > 0) ? a1.concat(a2) : a1;
}

module.exports = {
  concatPopulated
};