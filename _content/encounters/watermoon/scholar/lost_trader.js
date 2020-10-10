const Actions     = require('slacksimple').Actions;
const Encounter   = require('@app/content/encounters').Encounter;
const Attachments = require('slacksimple').Attachments;

const CHARACTER_STATE = require('@constants').CHARACTER_STATE;
const ENCOUNTER_NAME  = 'watermoon-scholar-lost_trader';
const ACTION_LEAVE    = 'leave';

/**
 * Shopkeep in the Labyrinth.
 */
class LostTraderEncounter extends Encounter {
  constructor() {
    super({
      type: ENCOUNTER_NAME,
      description: __("You come across a shabby woman pushing a rusted cart.  As you approach, she holds up her hands in a gesture of submission.\n\n\"I see you're stuck down here just as I am,\" she says.  \"Perhaps I can help you out.  Though you'll find I charge a bit more than in town, due to the circumstances we find ourselves in.\"\n\nShe gestures towards the cart, which you can see is full of useful, if expensive items."),
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
    return 'encounters/watermoon/lost_trader.png';
  }

  /**
   * Gets an addendum to the location in the bot name, for clarificatino.
   *
   * @param {Character} character - The character currently in this encounter.
   *
   * @return {string}
   */
  getBotSuffix(character) {
    return __(": Lost Trader");
  }

  /**
   * Get the actions for this encounter.
   *
   * @param {Character} character - The character encountering.
   *
   * @return {Actions}
   */
  getActions(character) {
    let actions = new Actions();
    const items = character.location.getShopItems(character);

    for (const [type, details] of Object.entries(items)) {
      actions.addButton(
        details.shopText,
        'buy',
        {
          params: { action: "list", type },
          style: _.get(details, 'style', 'default')
        }
      );
    }

    actions.addButton(__("Leave"), "encounter", { params: { type: ENCOUNTER_NAME, action: ACTION_LEAVE }});

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
    if (ACTION_LEAVE === action) {
      const title = __(":white_check_mark: You thank the woman for her time and head back into the halls of the labyrinth.  You feel refreshed after a rest, and gain +1 AP.");
      character.ap++;
      character.state = CHARACTER_STATE.IDLE;

      await this.updateLast({
        attachments: Attachments.one({ title }),
        doLook: true
      });
    }
    else {
      throw new Error(`Unknown action: ${action}.`);
    }
  }
}

module.exports = LostTraderEncounter;