const { PartyBoost } = require('@app/content/boosts/party');
const moment         = require('moment');

const BOOST_TYPE = 'party-1_sp';
const FLAG_PARTY_BOOST_1_SP_3_DAY_WARNING_GIVEN = 'party_boost_1_sp_3_day_warning_given';

/**
 * Get +1 SP while active.
 */
class PartyOneSpBoost extends PartyBoost {
  /**
   * Get the description for this boost, including time remaining.
   *
   * @param {Character} character - The character to get the description for.
   *
   * @return {string}
   */
  getDescription(character) {
    return `+1 SP for ${this.getTimeRemainingText()}`;
  }

  /**
   * Get the flag set when the 3 day warning has been given.
   *
   * @return {string}
   */
  get3DayFlag() {
    return FLAG_PARTY_BOOST_1_SP_3_DAY_WARNING_GIVEN;
  }

  /**
   * Get the warning text to provide when 3 days remain on boost.
   *
   * @return {string}
   */
  get3DayWarningText() {
    return "Your Party +1 SP Boost is running down!  (3 days remaining)";
  }

  /**
   * Get the text to display when boost has expired.
   *
   * @return {string}
   */
  getExpiredText() {
    return "Your Party +1 SP Boost has expired!  You no longer have bonus SP in fights.";
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
}

module.exports = PartyOneSpBoost;