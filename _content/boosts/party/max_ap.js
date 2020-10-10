const { PartyBoost } = require('@app/content/boosts/party');
const moment      = require('moment');

const BOOST_TYPE = 'party-max_ap';
const FLAG_PARTY_BOOST_MAX_AP_3_DAY_WARNING_GIVEN = 'party_boost_max_ap_3_day_warning_given';

/**
 * Get bonus AP while active.
 */
class PartyMaxApBoost extends PartyBoost {
  /**
   * Get the description for this boost, including time remaining.
   *
   * @param {Character} character - The character to get the description for.
   *
   * @return {string}
   */
  getDescription(character) {
    return `+3 Maximum AP for ${this.getTimeRemainingText()}`;
  }

  /**
   * Get the flag set when the 3 day warning has been given.
   *
   * @return {string}
   */
  get3DayFlag() {
    return FLAG_PARTY_BOOST_MAX_AP_3_DAY_WARNING_GIVEN;
  }

  /**
   * Get the warning text to provide when 3 days remain on boost.
   *
   * @return {string}
   */
  get3DayWarningText() {
    return "Your Party Maximum AP Boost is running down!  (3 days remaining)";
  }

  /**
   * Get the text to display when boost has expired.
   *
   * @return {string}
   */
  getExpiredText() {
    return "Your Party Maximum AP Boost has expired!  You no longer have bonus Max AP.";
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
    return 3;
  }
}

module.exports = PartyMaxApBoost;