"use strict";

const Encounter   = require('@app/content/encounters').Encounter;
const Actions     = require('slacksimple').Actions;
const Attachments = require('slacksimple').Attachments;
const Random      = require('@util/random');
const Locations   = require('@app/content/locations').Locations;

const CHARACTER_STATE = require('@constants').CHARACTER_STATE;
const COLORS          = require('@constants').COLORS;
const DIRECTIONS      = require('@constants').DIRECTIONS;
const FLAGS           = require('@constants').FLAGS;
const STATS           = require('@constants').STATS;

const WATERMOON_FAITH_PORTAL_ESSENCE_CRYSTALS  = require('@constants').WATERMOON_FAITH_PORTAL_ESSENCE_CRYSTALS;
const WATERMOON_SHADOW_PORTAL_ESSENCE_CRYSTALS = require('@constants').WATERMOON_SHADOW_PORTAL_ESSENCE_CRYSTALS;
const WATERMOON_DEATH_PORTAL_ESSENCE_CRYSTALS  = require('@constants').WATERMOON_DEATH_PORTAL_ESSENCE_CRYSTALS;

const ENCOUNTER_TYPE = 'watermoon-mystic-unlock_portal';

const ACTION_YES = 'yes';
const ACTION_NO  = 'no';

/**
 * Unlock a portal and enter the plane it connects to.
 */
class UnlockPortalEncounter extends Encounter {
  constructor() {
    super({
      type: ENCOUNTER_TYPE
    });
  }

  /**
   * Get the image for this encounter.
   *
   * @param {Character} character - The character currently in this encounter.
   *
   * @return {string}
   */
  getImage(character) {
    return `encounters/watermoon/portal_of_${this.info.plane}.png`;
  }

  /**
   * Get the description for this encounter.
   *
   * @param {Character} character - The character encountering.
   *
   * @return {string}
   */
  getDescription(character) {
    return __("You approach the %s portal, noting that it spins faster as you draw near.  The Essence Crystals in your pack grow noticably warmer.", this.getPortalColour());
  }

  /**
   * Gets an addendum to the location in the bot name, for clarificatino.
   *
   * @param {Character} character - The character currently in this encounter.
   *
   * @return {string}
   */
  getBotSuffix(character) {
    return __(": %s Portal", _.upperFirst(this.getPortalColour()));
  }

  /**
   *
   */
  getTitle(character) {
    return __("Do you want to use %d Essence Crystals to unlock this portal?", this.getPortalCost());
  }

  /**
   * Get the colour of the portal being unlocked.
   *
   * @return {string}
   */
  getPortalColour() {
    return this.info.plane === 'faith' ? 'golden' : (this.info.plane === 'shadow' ? 'misty' : 'inky');
  }

  /**
   * Get the cost of the portal being unlocked.
   *
   * @return {integer}
   */
  getPortalCost() {
    if (this.info.plane === 'faith') {
      return WATERMOON_FAITH_PORTAL_ESSENCE_CRYSTALS;
    }
    else if (this.info.plane === 'shadow') {
      return WATERMOON_SHADOW_PORTAL_ESSENCE_CRYSTALS;
    }

    return WATERMOON_DEATH_PORTAL_ESSENCE_CRYSTALS;
  }

  /**
   * Get the action buttons for this encounter.
   *
   * @param {Character} character - The character encountering.
   *
   * @return {array}
   */
  getActions(character) {
    let actions = new Actions();

    actions.addButton(__("Yes!"), 'encounter', { params: { type: ENCOUNTER_TYPE, action: ACTION_YES, plane: this.info.plane } });
    actions.addButton(__("Not now..."), 'encounter', { params: { type: ENCOUNTER_TYPE, action: ACTION_NO } });

    return actions;
  }

  /**
   * Perform one of this encounter's actions.
   *
   * @param {string} action - The action to perform.
   * @param {Character} character - The character performing the action.
   * @param {object} message - The message that preceeded this, for updating.
   */
  async doAction(action, character, message) {
    let title = '';
    let color = '';

    if (ACTION_YES === action) {

      character.inventory.remove('quest-watermoon-essence_crystal', this.getPortalCost());

      character.setFlag(this.info.plane + FLAGS._PORTAL_OPEN);
      character.location = Locations.new(`watermoon-mystic-plane_of_${this.info.plane}`);

      const layout = Random.between(0, 2);
      const { startLocation, bossLocation } = character.location.getLocations(layout);

      character.setFlag(this.info.plane + FLAGS._PLANE_LAYOUT, layout);
      character.setFlag(this.info.plane + FLAGS._LOCATION, startLocation);
      character.setFlag(this.info.plane + FLAGS._BOSS_LOCATION, bossLocation);
      character.setFlag(this.info.plane + FLAGS._DIRECTION, DIRECTIONS.NORTH);

      character.increaseStat(STATS.WATERMOON_PORTAL_OPENED, 1, this.info.plane);
      character.increaseStat(STATS.WATERMOON_ESSENCE_CRYSTALS_SPENT, this.getPortalCost());

      title = __("You hold the Essence Crystals in front of you as you approach the portal.  It whirls faster and faster, then, suddenly, stops.  A heartbeat later, the crystals disappear from your hand in a flash and the portal opens.");
      color = COLORS.GOOD;

      character.track('Portal Opened', { plane: this.info.plane });
    }
    else if (ACTION_NO === action) {
      title = __("You decide to come back later.");
    }
    else {
      throw new Error(`Uncrecognized action for ${this.type}: '${action}'`);
    }

    character.state = CHARACTER_STATE.IDLE;

    await this.updateLast({
      attachments: Attachments.one({ title, color }),
      doLook: true
    });
  }
}

module.exports = UnlockPortalEncounter;