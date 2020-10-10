"use strict";

const Log = require('@util/log');

/**
 * Return a random item from an array.
 *
 * @param {array} a - The array to choose from.
 *
 * @return {mixed}
 */
function fromArray(a) {
  return a[Math.floor(Math.random() * a.length)];
}

/**
 * Return a random value between the two provided values.
 *
 * @param {integer} min - The minimum bound.
 * @param {integer} max - The maximum bound.
 * @param {boolean} round - If we should round to a whole number.
 *
 * @return {integer}
 */
function between(min, max, round = true) {
  const diff = max - min + 1;

  return round ? Math.floor(Math.random() * diff) + min
    : Math.random() * diff + min;
}

/**
 * Get a value from a weighted array.
 *
 * Array format:
 *
 * [
 *     { 'weight': 10, value: 'some_value' },
 *     { 'weight': 50, value: 'another_value' },
 * ]
 *
 * @param {array} a - The weighted array to choose from.
 *
 * @return {mixed}
 */
function getWeighted(a) {
  if (a.length === 0) {
    throw new Error("Weighted array is empty!");
  }

  let totalWeight = 0;

  for (let e of a) {
    totalWeight += e.weight;
  }

  let rando = between(1, totalWeight);

  let previousWeights = 0;
  for (let e of a) {
    if (rando <= previousWeights + e.weight) {
      return e.value;
    }

    previousWeights += e.weight;
  }

  Log.error(a);

  throw new Error(`Invalid weighted array format.`);
}

/**
 * Shuffle an array.
 *
 * @param {array} array - The array to shuffle.
 *
 * @return {array}
 */
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // eslint-disable-line no-param-reassign
  }

  return array;
}

/**
 * Draw a random card.
 *
 * @return {string}
 */
function drawCard() {
  const ranks = ["1", "2", "3", "4", "5", "6", "7", "8", "Drake", "Dragon"];
  const suits = ["Scales", "Swords", "Coins", "Fish", "Steel"];
  const special = ["The Egg", "Obsidia", "Death", "Glory", "Fate"];

  if (between(1, 10) === 1) {
    return fromArray(special);
  }
  else {
    const rank = fromArray(ranks);
    const suit = fromArray(suits);
    return `${rank} of ${suit}`;
  }
}

/**
 * Draw some random cards.
 *
 * @param {integer} count The number of cards to draw.
 *
 * @return {array}
 */
function drawCards(count = 1) {
  let cards = [];

  for (let x = 0; x < count; x++) {
    cards.push(drawCard());
  }

  return cards;
}

module.exports = {
  fromArray,
  between,
  getWeighted,
  shuffle,
  drawCard,
  drawCards,
};