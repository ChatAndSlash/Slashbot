"use strict";

const mix               = require('mixwith').mix;
const WatermoonLocation = require('@app/content/locations/watermoon').WatermoonLocation;
const HallwayLocation   = require('@mixins/location/hallway').HallwayLocation;
const { pluralize }     = require('@util/text');
const { between, getWeighted, fromArray } = require('@util/random');

/**
 * Tricky hallway.  Length is random between 5 and 15.
 */
class TrickyHallwayLocation extends mix(WatermoonLocation).with(HallwayLocation()) {
  constructor() {
    super({
      type: 'watermoon-scholar-hallway-tricky',
      displayName: __('Tricky Hallway'),
      image: 'locations/watermoon/tricky-hallway.png',
      enemies: [
        { value: 'watermoon-scholar-hallways-centaur_archer', weight: 1 },
        { value: 'watermoon-scholar-hallways-centaur_slasher', weight: 1 },
        { value: 'watermoon-scholar-hallways-harpy_mistress', weight: 1 },
        { value: 'watermoon-scholar-hallways-harpy_witch', weight: 1 },
        { value: 'watermoon-scholar-hallways-winged_serpent', weight: 1 },
        { value: 'watermoon-scholar-hallways-starving_lion', weight: 1 },
        { value: 'watermoon-scholar-hallways-manticore', weight: 1 },
        { value: 'watermoon-scholar-hallways-myrmekes', weight: 1 },
      ],
    });
  }

  /**
   * Gets the description for this location.
   *
   * @param {Character} character - The character getting the description.
   *
   * @return {string}
   */
  getDescription(character) {
    const progressText = this.getProgressText(character);
    return __("*Watermoon, Scholar District*\nThis hallway is so full of twists and turns, it's hard to determine just now long it actually is.%s", progressText);
  }

  /**
   * Tricky hallways display weird text, incorrect to wildly incorrect text, or emojis.
   *
   * @param {Character} character - The character to get the progress text for.
   *
   * @return {string}
   */
  getProgressText(character) {
    let text;
    let remaining;

    switch (this.getProgressType()) {
      case 'standard': {
        remaining = between(1, 15);
        /* eslint-disable no-fallthrough */
      }

      case 'wild': {
        remaining = remaining || between(50, 100);
        text = __(
          "\n\n%d %s %s until the end of the hallway.",
          remaining,
          pluralize("fight", remaining),
          1 === remaining ? __("remains") : __("remain"),
        );
        break;
      }

      case 'crazy': {
        const emoji = fromArray([
          ':doughnut:',
          ':monkey_face:',
          ':sunglasses:',
          ':tongue:',
          ':cyclone:',
        ]);
        text = __("\n\n:interrobang:%s:interrobang: remaining until the end of the hallway.", emoji);
        break;
      }
    }

    return text;
  }

  /**
   * Choose the type of "weird" response to display.
   *
   * @return {string}
   */
  getProgressType() {
    return getWeighted([
      { weight: 80, value: 'standard' },
      { weight: 19, value: 'wild' },
      { weight: 1, value: 'crazy' },
    ]);
  }

  /**
   * Gets the length of this hallway.
   *
   * @return {integer}
   */
  getLength() {
    return between(5, 15);
  }
}

module.exports = TrickyHallwayLocation;