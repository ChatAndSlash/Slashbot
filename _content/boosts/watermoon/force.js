const WatermoonBoost = require('@app/content/boosts/watermoon').WatermoonBoost;

const BOOST_TYPE = 'watermoon-force';
const FLAG_BOOST_WATERMOON_FORCE_3_DAY_WARNING_GIVEN = 'boost_watermoon_force_3_day_warning_given';

/**
 * +25% Force while in Watermoon.
 */
class WatermoonForceBoost extends WatermoonBoost {
  /**
   * Get the description for this boost, including time remaining.
   *
   * @param {Character} character - The character to get the description for.
   *
   * @return {string}
   */
  getDescription(character) {
    return `+25% Force while in Watermoon for ${this.getTimeRemainingText()}`;
  }

  /**
   * Get the flag set when the 3 day warning has been given.
   *
   * @return {string}
   */
  get3DayFlag() {
    return FLAG_BOOST_WATERMOON_FORCE_3_DAY_WARNING_GIVEN;
  }

  /**
   * Get the warning text to provide when 3 days remain on boost.
   *
   * @return {string}
   */
  get3DayWarningText() {
    return "Your Watermoon Force Boost is running down!  (3 days remaining)";
  }

  /**
   * Get the text to display when boost has expired.
   *
   * @return {string}
   */
  getExpiredText() {
    return "Your Watermoon Force Boost has expired!  You no longer have bonus Force in Watermoon.";
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

  /**
   * Get the bonus Force this boost provides.
   *
   * @param {Character} character - The character to check for.
   *
   * @return {integer}
   */
  getForceValue(character) {
    return this.isInWatermoon(character)
      ? Math.ceil(character._force * 0.25)
      : 0;
  }
}

module.exports = WatermoonForceBoost;