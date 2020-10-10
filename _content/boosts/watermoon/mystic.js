const WatermoonBoost = require('@app/content/boosts/watermoon').WatermoonBoost;

const BOOST_TYPE = 'watermoon-mystic';
const FLAG_BOOST_WATERMOON_MYSTIC_3_DAY_WARNING_GIVEN = 'boost_watermoon_mystic_3_day_warning_given';

/**
 * Loot extra Essence Crystals.
 */
class WatermoonMysticBoost extends WatermoonBoost {
  /**
   * Get the description for this boost, including time remaining.
   *
   * @param {Character} character - The character to get the description for.
   *
   * @return {string}
   */
  getDescription(character) {
    return `Loot extra Essence Crystals in the Mystic District for ${this.getTimeRemainingText()}`;
  }

  /**
   * Get the flag set when the 3 day warning has been given.
   *
   * @return {string}
   */
  get3DayFlag() {
    return FLAG_BOOST_WATERMOON_MYSTIC_3_DAY_WARNING_GIVEN;
  }

  /**
   * Get the warning text to provide when 3 days remain on boost.
   *
   * @return {string}
   */
  get3DayWarningText() {
    return "Your Watermoon Mystic Boost is running down!  (3 days remaining)";
  }

  /**
   * Get the text to display when boost has expired.
   *
   * @return {string}
   */
  getExpiredText() {
    return "Your Watermoon Mystic Boost has expired!  You no longer have bonus Mystic in Watermoon.";
  }

  /**
   * Set the initial values for this boost.
   *
   * @param {Character} character - The character to set the initial values for.
   */
  setInitialValues(character) {
    this.type = BOOST_TYPE;

    return super.setInitialValues(character);
  }
}

module.exports = WatermoonMysticBoost;