"use strict";

const Command     = require('@app/content/commands').Command;
const Actions     = require('slacksimple').Actions;
const Attachments = require('slacksimple').Attachments;

const STATS = require('@constants').STATS;
const FLAGS = require('@constants').FLAGS;
const TURNS_WELL_RESTED = require('@constants').TURNS_WELL_RESTED;

const COMMAND_NAME = 'rest';

const PAY_WITH_AP       = 'ap';
const PAY_WITH_GOLD     = 'gold';
const PAY_WITH_AMBROSIA = 'ambrosia';

const REST_TO_FULL = 'full';

const TYPE_AMBROSIA = 'consumables-ambrosia';

/**
 * Rest and heal your HP & MP.
 */
class RestCommand extends Command {
  /**
   * Execute the command.
   */
  async execute() {
    if (_.isUndefined(this.info.payWith)) {
      await this.showOptions();
    }
    else {
      await this.doRest();
    }
  }

  /**
   * Display options for resting.
   */
  async showOptions() {
    const character = this.character;
    const description = "You unsling your pack and sit down a moment to rest and recover.\n\nIf you spend *gold* or *Ambrosia* to recover, you won't lose any AP.  But if you spend *AP* to recover, you'll become _Well Rested_ and get double SP for your next two fights!";

    const styleApFull   = character.ap >= 1 ? false : 'danger';
    const styleGoldFull = character.gold >= character.getHealingCost() ? false : 'danger';
    const styleAmbrosia = character.inventory.has(TYPE_AMBROSIA) ? false : 'danger';

    let actions = new Actions();
    actions.addButton("Rest (1 AP)", COMMAND_NAME, { params: { payWith: PAY_WITH_AP, restTo: REST_TO_FULL }, style: styleApFull });
    actions.addButton(`Rest (${character.getHealingCost()} gold)`, COMMAND_NAME, { params: { payWith: PAY_WITH_GOLD, restTo: REST_TO_FULL }, style: styleGoldFull });
    actions.addButton("Rest (Ambrosia)", COMMAND_NAME, { params: { payWith: PAY_WITH_AMBROSIA, restTo: REST_TO_FULL }, style: styleAmbrosia });
    actions.addButton("Cancel", "look", { params: { resetDescription: "true" } });

    await this.updateLast({
      description,
      attachments: Attachments.one({
        title: "Do you want to spend time (AP) recovering or supplies (gold)?",
        actions,
      })
    });
  }

  /**
   * Rest up!
   */
  async doRest() {
    const character = this.character;
    const healingCost = character.getHealingCost();

    let title = '';

    // If nothing to rest
    if (character.hp === character.maxHp && character.mp === character.maxMp) {
      title = ":warning: You're already completely rested!  You have nothing you need to recover just now.";
    }
    // If not enough Action Points to rest
    else if (this.info.payWith === PAY_WITH_AP && character.ap < 1) {
      title = ":warning: You don't have enough Action Points to rest.  Consider waiting a while.  You'll recover 1 AP every fifteen minutes, and can then continue exploring.";
    }
    // If not enough Gold to rest
    else if (this.info.payWith === PAY_WITH_GOLD && character.gold < healingCost) {
      title = ":warning: You don't have enough gold to rest.  You'll need to rest using Action Points.";
    }
    // If not enough Ambrosia to rest
    else if (this.info.payWith === PAY_WITH_AMBROSIA && ! character.inventory.has(TYPE_AMBROSIA)) {
      title = ":warning: You don't have any Ambrosia.  Seek out a Premium Item seller to buy some.";
    }
    // If you got enough, rest!
    else {
      if (this.info.payWith === PAY_WITH_AP) {
        title = `:white_check_mark: You take the proper time required to tend to your injuries and are Well Rested for ${TURNS_WELL_RESTED} fights, gaining double SP!`;
        character.increaseStat(STATS.REST_AP);
        character.ap -= 1;
        character.setFlag(FLAGS.WELL_RESTED_TURNS, TURNS_WELL_RESTED);

        if (this.character.hasFlag(FLAGS.CHEST_CURSE_FRAILTY)) {
          this.character.decrementFlag(FLAGS.CHEST_CURSE_FRAILTY);
        }

        if (this.character.hasFlag(FLAGS.CHEST_CURSE_CLUMSY)) {
          this.character.decrementFlag(FLAGS.CHEST_CURSE_CLUMSY);
        }
      }
      else if (this.info.payWith === PAY_WITH_AMBROSIA) {
        title = ":yum: You uncork the bottle and imbibe the honey-like liquid inside, recovering all your HP and MP.";
        character.increaseStat(STATS.ITEMS_CONSUMED, 1, TYPE_AMBROSIA);
        character.inventory.remove(TYPE_AMBROSIA);
      }
      else {
        title = `:white_check_mark: You use up supplies worth ${healingCost} gold to rest yourself.  No time to lose!`;
        character.increaseStat(STATS.REST_GOLD);
        character.increaseStat(STATS.REST_GOLD_SPENT, healingCost);
        character.gold -= healingCost;
      }

      // Recover from wounds
      character.hp = character.maxHp;
      character.mp = character.maxMp;
    }

    await this.updateLast({
      attachments: Attachments.one({ title }),
      doLook: true
    });
  }
}

module.exports = RestCommand;