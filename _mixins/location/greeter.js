"use strict";

const moment           = require('moment');
const { STATS, FLAGS } = require('@constants');

const GREETER_ENCOUNTER = 'greeter';

/**
 * Mixin to add to locations that can have a Greeter encounter appear.
 *
 * @return {Mixin}
 */
const GreeterLocation = () => {
  return (Location) => class extends Location {
    /**
     * Populate encounter choices to randomly draw from.
     * This can be overridden in specific locations to add/remove encounters from the population
     * base on the character.
     *
     * @param {Character} character - The character in this location.
     *
     * @return {array}
     */
    getEncounters(character) {
      if (this.shouldEncounterGreeter(character)) {
        return [{ value: GREETER_ENCOUNTER, weight: 100 }];
      }

      return super.getEncounters(character);
    }

    /**
     * Should only encounter greeter if haven't already, or if said "Maybe" and enough time
     * has passed.
     *
     * @param {Character} character - The charcter in this location.
     *
     * @return {boolean}
     */
    shouldEncounterGreeter(character) {
      // Don't encounter greeter if you have already
      if (character.hasStat(STATS.GREETER_COMPLETED)) {
        return false;
      }

      const greeterDelayUntil = character.getFlag(FLAGS.GREETER_DELAY_UNTIL, false);
      if (greeterDelayUntil && moment().isBefore(moment(greeterDelayUntil))) {
        return false;
      }

      return true;
    }
  };
};

module.exports = {
  GreeterLocation
};