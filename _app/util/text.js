"use strict";

const Hashids     = require('hashids');

const PROPERTIES = require('@constants').PROPERTIES;

const CUSTOM_PLURALS = {
  'potato': 'potatoes',
  'Quicksalt': 'Quicksalt',
  'Crystal Acid': 'Crystal Acid',
  'Smelling Salts': 'Smelling Salts',
};

/**
 * Get the proper article ("a" or "an" to use with a word).
 *
 * @param {string} word - The word to get the article for.
 *
 * @return {string}
 */
function getArticle(word) {
  return word.match(/^[aeiou]/i) ? 'an' : 'a';
}

/**
 * Uppercase the first character of this string.
 *
 * @param {string} str - The string to uppercase the first character of.
 *
 * @return {string}
 */
function ucFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Returns the properly-pluralized version of the word provided.
 *
 * @param {string} word - The word to pluralize.
 * @param {integer} count - The number to use to decide if pluralizing.
 *
 * @return {string}
 */
function pluralize(word, count = 2) {
  if (count == 1) {
    return word;
  }

  // Is this a custom plural?
  if (Object.keys(CUSTOM_PLURALS).includes(word)) {
    return CUSTOM_PLURALS[word];
  }

  // '-s', '-x', '-ch', and '-sh' end with 'es'
  else if (endsWith(word, ['s', 'x', 'ch', 'sh'])) {
    return word + 'es';
  }

  // Otherwise, just add 's'
  else {
    return word + 's';
  }
}

/**
 * Check if the provided word ends with the provided letters.
 *
 * @param {string} word - The word to check.
 * @param {mixed} letters - The letters to check or an array of letters to check.
 *
 * @return {boolean}
 */
function endsWith(word, letters) {
  if (Array.isArray(letters)) {
    for (let ending of letters) {
      if (word.endsWith(ending)) {
        return true;
      }
    }

    return false;
  }

  return word.endsWith(letters);
}

/**
 * Check if the provided letter is a vowel.
 *
 * @param {string} letter - The letter to check.
 *
 * @return {boolean}
 */
function isVowel(letter) {
  return ['a', 'e', 'i', 'o', 'u'].includes(letter);
}

/**
 * Check if the provided letter is a consonant.
 *
 * @param {string} letter - The letter to check.
 *
 * @return {boolean}
 */
function isConsonant(letter) {
  return ! isVowel(letter);
}

/**
 * Turn an array of entries into a comma-separated list.
 * ['first'] => "first"
 * ['first', 'second'] => "first and second"
 * ['first', 'second', 'third'] => "first, second, and third"
 * etc
 *
 * @param {array} list - The list to listify.
 *
 * @return {string}
 */
function listify(list) {
  if (list.length === 1) {
    return list[0];
  }
  else if (list.length === 2) {
    return list.join(" and ");
  }

  let newList = _.clone(list);
  newList[newList.length - 1] = `and ${newList[newList.length - 1]}`;

  return newList.join(", ");
}

/**
 * Get the long name for an attribute.
 *
 * @param {string} short - The short version of the attribute.
 * @param {integer} value - The value to display before the attribute, if any.
 *
 * @return {string}
 */
function getLongAttributeName(short, value = false) {
  switch (short) {
    case 'damage': return (value === false) ? "Damage" : `${value} Damage`;
    case 'spellPower': return (value === false) ? "Spell Power" : `${value} Spell Power`;
    case 'minDamage': return (value === false) ? "Min. Damage" : `${value} Min. Damage`;
    case 'maxDamage': return (value === false) ? "Max. Damage" : `${value} Max. Damage`;
    case 'maxHp': return (value === false) ? "Max. HP" : `${value} Max. HP`;
    case 'maxMp': return (value === false) ? "Max. MP" : `${value} Max. MP`;
    case 'force': return (value === false) ? "Force" : `${value} Force`;
    case 'technique': return (value === false) ? "Technique" : `${value} Technique`;
    case 'crit': return (value === false) ? "Critical %" : `${value} Critical %`;
    case 'defence': return (value === false) ? "Defence" : `${value} Defence`;
    case 'dodge': return (value === false) ? "Dodge" : `${value} Dodge`;
    case 'maxAp': return (value === false) ? "Max. AP" : `${value} Max. AP`;
    case 'maxAmmo': return (value === false) ? "Max. Ammo" : `${value} Max. Ammo`;
  }
}

/**
 * Get the name of a property.
 *
 * @param {string} key - The key of the property.
 * @param {Character} character - The character getting the property.
 *
 * @return {string}
 */
function getPropertyName(key, character) {
  switch (key) {
    case PROPERTIES.IS_ATTACK: return "Attack";
    case PROPERTIES.RANGED_ATTACK: return "Ranged Attack";
    case PROPERTIES.AOE_ATTACK: return "AoE Attack";
    case PROPERTIES.BURN_ATTACK: return "Burn Attack";
    case PROPERTIES.CHILL_ATTACK: return "Chill Attack";
    case PROPERTIES.IS_GROUP: return "Group";
    case PROPERTIES.BONUS_CRIT_DAMAGE: return "+Crit Damage";
    case PROPERTIES.DEFEND_CRIT_CHANCE: return "+Crit % on Defend";
  }
}

/**
 * Get the URL for the buy page.
 *
 * @param {Character} character - The character doing the buying.
 *
 * @return {string}
 */
function getBuyUrl(character) {
  const hashids = new Hashids(_.get(process.env, 'HASHID_SALT'), 4);

  return _.get(process.env, 'BUY_URL') + hashids.encode(character.id);
}

module.exports = {
  getArticle,
  ucFirst,
  pluralize,
  endsWith,
  isVowel,
  isConsonant,
  listify,
  getLongAttributeName,
  getPropertyName,
  getBuyUrl
};