const Boost       = require('@app/content/boosts').Boost;
const moment      = require('moment');

const BOOST_TYPE = 'max_ap';
const FLAG_BOOST_MAX_AP_3_DAY_WARNING_GIVEN = 'boost_max_ap_3_day_warning_given';

/**
 * Get bonus AP while active.
 */
class MaxApBoost extends Boost {
  /**
   * Get the description for this boost, including time remaining.
   *
   * @param {Character} character - The character to get the description for.
   *
   * @return {string}
   */
  getDescription(character) {
    return `+2 Maximum AP for ${this.getTimeRemainingText()}`;
  }

  /**
   * Get the flag set when the 3 day warning has been given.
   *
   * @return {string}
   */
  get3DayFlag() {
    return FLAG_BOOST_MAX_AP_3_DAY_WARNING_GIVEN;
  }

  /**
   * Get the warning text to provide when 3 days remain on boost.
   *
   * @return {string}
   */
  get3DayWarningText() {
    return "Your Maximum AP Boost is running down!  (3 days remaining)";
  }

  /**
   * Get the text to display when boost has expired.
   *
   * @return {string}
   */
  getExpiredText() {
    return "Your Maximum AP Boost has expired!  You no longer have bonus Max AP.";
  }

  /**
   * Get the time remaining on this boost.
   *
   * @return {timestamp}
   */
  getTimeRemaining() {
    const purchasedDate = moment(this.purchasedAt);
    return moment(purchasedDate).add(30, 'days').add(1, 'hour');
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
   * Get the bonus Maximum AP this boost provides.
   *
   * @param {Character} character - The character to check for.
   *
   * @return {integer}
   */
  getMaxApValue(character) {
    return 2;
  }
}

module.exports = MaxApBoost;