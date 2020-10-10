"use strict";

let collection = {};
let names      = {};

const Files   = require('@util/files');
const Content = require('@app/content')(collection, names);
const moment  = require('moment');
const Attachments    = require('slacksimple').Attachments;

const { TIME, COLORS } = require('@constants');

class Boost {
  /**
   * Initialize command.
   *
   * @param {object} info - The info about this boost.
   */
  constructor(info) {
    this.type = _.get(info, 'type', '');

    const data = _.get(info, 'data', {});

    this.purchasedAt = moment(_.get(data, 'purchased_at'));

  }

  /**
   * Get the description for this boost, including time remaining.
   *
   * @param {Character} character - The character to get the description for.
   *
   * @return {string}
   */
  getDescription(character) {
    return '';
  }

  /**
   * Gets the time remaining on this boost in a descriptive text format.
   *
   * @return {string}
   */
  getTimeRemainingText() {
    const remaining = this.getTimeRemaining();
    const now = moment();
    const msRemaining = remaining.diff(now);

    if (msRemaining < TIME.MINUTE) {
      return 'a few more seconds...';
    }
    else if (msRemaining < TIME.HOUR) {
      return `${remaining.diff(now, 'minutes')} minutes`;
    }
    else if (msRemaining < TIME.DAY) {
      return `${remaining.diff(now, 'hours')} hours`;
    }

    return `${remaining.diff(now, 'days')} days`;
  }

  /**
   * Get the data used to track this boost.
   *
   * @return {object}
   */
  getData() {
    return {
      purchased_at: moment(this.purchasedAt).format(),
    };
  }

  /**
   * Set the initial values for this boost.
   *
   * @param {Character} character - The character to set the initial values for.
   */
  setInitialValues(character) {
    this.purchasedAt = moment().format();

    return this;
  }

  /**
   * If this boost has expired and should be removed.
   * Can send messages to Slashbot, so character should be fully loaded before then.
   * Should NOT send messages if loaded for Party, since character is not saved later, the flag
   * that ensures messages are only sent once is never applied.
   *
   * @param {Character} character - The character to check the boost for.
   * @param {Boolean} warnCharacter - Whether the character should be warned through a say.
   *
   * @return {boolean}
   */
  hasExpired(character, warnCharacter) {
    const expiredDate = this.getTimeRemaining(character);
    const nowDate = moment();

    // Expired?
    const secondsRemaining = expiredDate.diff(nowDate, 'seconds');
    if (warnCharacter && secondsRemaining <= 0) {
      character.slashbot.say('', character, {
        attachments: Attachments.one({
          title: this.getExpiredText(),
          color: COLORS.DANGER
        }),
      });
      character.clearFlag(this.get3DayFlag());

      return true;
    }

    // Less than 3 days?
    const daysRemaining = expiredDate.diff(nowDate, 'days');
    if (warnCharacter && daysRemaining <= 3 && ! character.getFlag(this.get3DayFlag())) {
      character.slashbot.say('', character, {
        attachments: Attachments.one({
          title: this.get3DayWarningText(),
          color: COLORS.WARNING
        }),
      });
      character.setFlag(this.get3DayFlag());
    }

    return false;
  }

  /**
   * Get the flag set when the 3 day warning has been given.
   *
   * @return {string}
   */
  get3DayFlag() {
    return '';
  }

  /**
   * Get the warning text to provide when 3 days remain on boost.
   *
   * @return {string}
   */
  get3DayWarningText() {
    return '';
  }

  /**
   * Get the text to display when boost has expired.
   *
   * @return {string}
   */
  getExpiredText() {
    return '';
  }

  /**
   * Get the bonus Maximum AP this boost provides.
   *
   * @param {Character} character - The character to check for.
   *
   * @return {integer}
   */
  getMaxApValue(character) {
    return 0;
  }

  /**
   * Get the bonus Force this boost provides.
   *
   * @param {Character} character - The character to check for.
   *
   * @return {integer}
   */
  getForceValue(character) {
    return 0;
  }

  /**
   * Get the bonus Technique this boost provides.
   *
   * @param {Character} character - The character to check for.
   *
   * @return {integer}
   */
  getTechniqueValue(character) {
    return 0;
  }

  /**
   * Get the bonus Defence this boost provides.
   *
   * @param {Character} character - The character to check for.
   *
   * @return {integer}
   */
  getDefenceValue(character) {
    return 0;
  }

  /**
   * Get the bonus SpellPower this boost provides.
   *
   * @param {Character} character - The character to check for.
   *
   * @return {integer}
   */
  getSpellPowerValue(character) {
    return 0;
  }
}

/**
 * Utility class for searching and creating new boost objects.
 */
class Boosts extends Content {}

module.exports = {
  Boost,
  Boosts,
};

/**
 * @type array The collection of boosts.
 */
Files.loadContent(`${CONTENT_FILES_PATH}/boosts/`, `${CONTENT_FILES_PATH}/boosts/`, collection);