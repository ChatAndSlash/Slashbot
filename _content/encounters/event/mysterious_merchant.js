const Actions       = require('slacksimple').Actions;
const Encounter     = require('@app/content/encounters').Encounter;
const Attachments   = require('slacksimple').Attachments;
const { getBuyUrl } = require('@util/text');

const CHARACTER_STATE = require('@constants').CHARACTER_STATE;
const ENCOUNTER_NAME  = 'event-mysterious_merchant';
const ACTION_LEAVE    = 'leave';

/**
 * Mysterious Merchant that appears during events.
 */
class MysteriousMerchantEncounter extends Encounter {
  constructor() {
    super({
      type: ENCOUNTER_NAME,
    });
  }

  /**
   * Get the description for this encounter.
   *
   * @param {Character} character - The character encountering.
   *
   * @return {string}
   */
  getDescription(character) {
    return `This hunched-over man straightens at your approach, revealing his true and surprising height.  He gestures to a few carts he has set up nearby.  "What're ya buying?" he asks.\n\nYou somehow know that if you need Dragon Scales, a *SALE* is happening right now:\n${getBuyUrl(character)}`;
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
    return __(": Mysterious Merchant");
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

    actions.addButton("Buy Pets", 'pets', { style: 'primary', params: { action: "buy", step: "list" } });
    actions.addButton("Change Pet", 'pets', { params: { action: "change", step: "list" } });

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
      const title = __(":white_check_mark: You back away slowly, not wanting to startle this strange man.");
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

module.exports = MysteriousMerchantEncounter;