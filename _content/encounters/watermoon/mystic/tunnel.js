"use strict";

const Encounter   = require('@app/content/encounters').Encounter;
const Actions     = require('slacksimple').Actions;
const Attachments = require('slacksimple').Attachments;
const Random      = require('@util/random');

const CHARACTER_STATE = require('@constants').CHARACTER_STATE;
const COLORS          = require('@constants').COLORS;
const DIRECTIONS      = require('@constants').DIRECTIONS;
const STATS           = require('@constants').STATS;

const FLAG_TUNNEL_COST_MULTIPLIER = 'tunnel_cost_multiplier';
const COST_PER_SQUARE_PER_LEVEL = 3;

const ENCOUNTER_TYPE = 'watermoon-mystic-tunnel';

const ACTION_YES = 'yes';
const ACTION_NO  = 'no';

/**
 * Tunnel that moves you 3-5 squares closer to your target.
 */
class TunnelEncounter extends Encounter {
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
    return `encounters/watermoon/tunnel.png`;
  }

  /**
   * Gets an addendum to the location in the bot name, for clarificatino.
   *
   * @param {Character} character - The character currently in this encounter.
   *
   * @return {string}
   */
  getBotSuffix(character) {
    return __(": Secret Tunnel!");
  }

  /**
   * Get the description for this encounter.
   *
   * @param {Character} character - The character encountering.
   *
   * @return {string}
   */
  getDescription(character) {
    return __("As you walk along, you nearly step on a tiny worm.  You definitely would have, if he hadn't cried out at the last second.\n\n\"Oi!  Have a care!\"  You look down at him, mouth agape.\n\n\"Well!\" he continues.  \"If you'd just been civil, I'd have shown you this here secret tunnel, free of charge.  But since you've gone and been rude - twice no less! - it'll cost you.  %d gold, or you can continue on the _slow_ way.\"", this.getGoldCost(character));
  }

  /**
   * Get the title to display to the character.
   *
   * @param {Character} character - The character encountering.
   *
   * @return {string}
   */
  getTitle(character) {
    return __("Do you want to pay the worm %d gold for him to show you the secret tunnel?", this.getGoldCost(character));
  }

  /**
   * Get the cost to travel through this tunnel.
   *
   * @param {Character} character - The character doing the travelling.
   *
   * @return {integer}
   */
  getGoldCost(character) {
    if ( ! character.hasFlag(FLAG_TUNNEL_COST_MULTIPLIER)) {
      character.setFlag(FLAG_TUNNEL_COST_MULTIPLIER, Random.between(2, 4));
    }

    const multiplier = character.getFlag(FLAG_TUNNEL_COST_MULTIPLIER);

    return character.level * COST_PER_SQUARE_PER_LEVEL * multiplier;
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
    const style = character.gold >= this.getGoldCost(character) ? 'default' : 'danger';

    actions.addButton(__("Yes!"), 'encounter', { params: { type: ENCOUNTER_TYPE, action: ACTION_YES }, style });
    actions.addButton(__("Yeah, no..."), 'encounter', { params: { type: ENCOUNTER_TYPE, action: ACTION_NO } });

    return actions;
  }

  /**
   * Get a direction to travel that is a valid way to get closer to the boss.
   *
   * @param {Character} character - The character to get the direction for.
   *
   * @return {string}
   */
  getTravelDirection(character) {
    const playerLocation = character.location.getPlayerLocation(character);
    const bossLocation = character.location.getBossLocation(character);

    // Still need to travel on X axis and randomly chose it?
    if (Random.between(1, 2) === 1 && playerLocation.x !== bossLocation.x) {
      if (playerLocation.x > bossLocation.x) {
        return DIRECTIONS.WEST;
      }
      else {
        return DIRECTIONS.EAST;
      }
    }
    else if (playerLocation.y > bossLocation.y) {
      return DIRECTIONS.NORTH;
    }
    else {
      return DIRECTIONS.SOUTH;
    }
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
    let color = COLORS.GOOD;

    if (ACTION_YES === action) {

      if (character.gold >= this.getGoldCost(character)) {
        const gold = this.getGoldCost(character);
        character.gold -= gold;
        character.clearFlag(FLAG_TUNNEL_COST_MULTIPLIER);

        const direction = this.getTravelDirection(character);
        const layout    = character.location.getLayout(character);
        let { x, y }    = character.location.getPlayerLocation(character);
        let distance    = Random.between(3, 5);

        switch (direction) {
          case DIRECTIONS.NORTH: y -= distance; break;
          case DIRECTIONS.EAST:  x += distance; break;
          case DIRECTIONS.WEST:  x -= distance; break;
          case DIRECTIONS.SOUTH: y += distance; break;
        }

        let tile = character.location.getTile(layout, x, y);
        while ( ! character.location.isTilePassable(tile)) {
          // Move back until passable
          switch (direction) {
            case DIRECTIONS.NORTH: y += 1; break;
            case DIRECTIONS.EAST:  x -= 1; break;
            case DIRECTIONS.WEST:  x += 1; break;
            case DIRECTIONS.SOUTH: y -= 1; break;
          }
          distance--;
          tile = character.location.getTile(layout, x, y);
        }

        character.location.setPlayerLocation(character, x, y);

        character.increaseStat(STATS.PLANE_TUNNEL_TAKEN, 1, character.location.getPlaneType(character));

        title = __("You pay the worm %d gold, which mysteriously disappears when it lands near him, and he points towards a tunnel that is open in front of you, obvious to anyone looking.  You're astounded you didn't notice it before.  \"Well, go ahead!\" he says.  \"You paid your money, don't waste the opportunity!\"\n\nYou duck into the tunnel, follow it for what feels like only a few steps then pop up, %d spaces further to the %s.", gold, distance, __(direction));
      }
      else {
        title = __("The little worm _tsks_ at you.\n\n\"You don't even have %d gold?  Well, be off with you then!\"  You spend a moment trying to identify where the secret tunnel is by yourself, but eventually leave, unable to bear the worm's scolding.");
        color = COLORS.DANGER;
      }
    }
    else if (ACTION_NO === action) {
      title = __("You shake your head as you walk away.  A talking worm?  Who would even believe such a thing?");
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

module.exports = TunnelEncounter;