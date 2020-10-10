"use strict";

const Command     = require('@app/content/commands').Command;
const Attachments = require('slacksimple').Attachments;

const CHARACTER_STATE = require('@constants').CHARACTER_STATE;
const FLAGS           = require('@constants').FLAGS;
const RECOVER_AP      = require('@constants').RECOVER_AP;

/**
 * Recover after being killed in combat.
 */
class RecoverCommand extends Command {
  /**
   * Execute the command.
   */
  async execute() {
    let title = '';

    // If not enough Action Points to recover
    if (this.info.payWith === 'ap' && this.character.ap < RECOVER_AP) {
      title = __(":warning: You don't have enough Action Points to recover.  Consider waiting a while.  You'll recover 1 AP every fifteen minutes, and can then continue exploring.");

      // If not enough Gold to recover
    }
    else if (this.info.payWith === 'gold' && this.character.gold < this.character.getRecoveryCost()) {
      title = __(":warning: You don't have enough gold to recover.  You'll need to recover using Action Points.");

      // If you got enough, recover!
    }
    else {
      title = __(":white_check_mark: Phaera's wings enfold you and you can feel warmth and life flooding your limbs again. You're alive! ");

      // Pay cost
      if (this.info.payWith === 'ap') {
        this.character.ap -= RECOVER_AP;
        title += __("Though you feel a little more tired than before...");
      }
      else {
        this.character.gold -= this.character.getRecoveryCost();
        title += __("Though your purse feels a little lighter than before...");
      }

      // Recover from wounds
      this.character.clearFlag(FLAGS.IN_CUTSCENE);
      this.character.state = CHARACTER_STATE.IDLE;
      this.character.increaseHp(this.character.maxHp, '');
      this.character.mp = this.character.maxMp;
    }

    await this.updateLast({
      attachments: Attachments.one({ title }),
      doLook: true
    });
  }
}

module.exports = RecoverCommand;