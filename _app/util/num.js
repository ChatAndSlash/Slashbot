"use strict";

/**
 * Calculate the fibonacci value for a given number.
 * Recursive functions are neat and all, but slow as HELL at anything above small numbers.
 *
 * @param {integer} n - The place in the fibonacci sequence to calculate.
 *
 * @return {integer}
 */
function fib(n) {
  let result = 0;
  let previousOne = 0;
  let previousTwo = 1;

  for (let i = 0; i <= n; i++) {
    result = previousOne + previousTwo;
    previousTwo = previousOne;
    previousOne = result;
  }

  return result;
}

/**
 * Get the amount to increase a total by to ensure that the amount is the requested percentage
 * of the new total.
 *
 * @param {integer} total - The total to increase.
 * @param {float} percentage - The percentage to have the amount/new total equal.
 *
 * @return {integer}
 */
function getIncreaseForPercentage(total, percentage) {
  if (percentage >= 1) {
    throw new Error(`Percentage must be < 1, is actually: '${percentage}'.`);
  }

  return Math.ceil((1 / (1 - percentage) * total) - total);
}

/**
 * Clip a number to fall between two bounds.
 *
 * @param {integer} num - The number to clip.
 * @param {integer} lower - The lower bound.
 * @param {integer} upper - The upper bound.
 *
 * @return {integer}
 */
function bound(num, lower, upper) {
  return Math.max(lower, Math.min(num, upper));
}

/**
 * Round a number to the nearest multiple of that number.
 *
 * @param {float} number - The number to round.
 * @param {integer} multiple - The multiple to round to.
 *
 * @return {integer}
 */
function roundToMultiple(number, multiple) {
  return multiple * Math.round(number / multiple);
}

module.exports = {
  fib,
  getIncreaseForPercentage,
  bound,
  roundToMultiple
};