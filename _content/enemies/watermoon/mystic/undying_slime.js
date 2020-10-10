"use strict";

const mix                         = require('mixwith').mix;
const { sprintf }                 = require("sprintf-js");
const { WatermoonBonusBossEnemy } = require('@app/content/enemies/watermoon/bonus_boss');
const { WatermoonReputation }     = require('@mixins/enemy/reputation/watermoon');
const { StunAction }              = require('@mixins/enemy/actions/stun');
const { PoisonAction }            = require('@mixins/enemy/actions/poison');
const { CrippleAction }           = require('@mixins/enemy/actions/cripple');
const { DrainLifeAction }         = require('@mixins/enemy/actions/drain_life');
const { DropsMoondrop }           = require('@mixins/enemy/loot/moondrop');
const { fromArray }               = require('@util/random');

const { FLAGS, PROPERTIES } = require('@constants');

const FLAG_TIMES_DIED        = 'times_died';
const FLAG_FLAVOUR           = 'flavour';
const FLAG_FLAMING_PSEUDOPOD = 'flaming_pseudopod';

const FLAVOUR_CHERRY    = 'cherry';
const FLAVOUR_KIWI      = 'kiwi';
const FLAVOUR_BLUEBERRY = 'blueberry';

class UndyingSlimeEnemy extends mix(WatermoonBonusBossEnemy).with(
  StunAction(0, {
    dodgeText: ":dash: %s fires a supercold blast of slime at you, but you dodge!",
    missText: "%s fires a supercold blast of slime at you, but misses you!",
    attackText: ":new_moon: %s hits you with a supercold blast of slime, dealing %s damage and stunning you for %d turn!%s",
  }),
  PoisonAction(0, {
    text: ":syringe: %s stabs you with a thin tentacle.  It doesn't hurt very much, but after a few short moments you can feel the poison begin to set in!",
  }),
  CrippleAction(0, {
    text: "Undying Slime emits a green-grey-brown fog.  It causes you to cough violently, crippling your %s by %s for %d turns!",
  }),
  DrainLifeAction(0, {
    damageMultiplier: 0.75,
    healMultiplier: 0.5,
    attackText: "%s shoots a needle-thin tentacle into you and sucks some of your blood, dealing %s damage and gaining %s health.%s"
  }),
  DropsMoondrop(100, 20),
  WatermoonReputation(150)
) {
  constructor() {
    super({
      type: 'watermoon-mystic-undying_slime',
      displayName: "Undying Slime",
      description: "",
      stats: {
        perLevel: {
          maxHp: 100,  // Reduced HP because comes back many times
        }
      },
    });

    this.districtBosses = [
      'watermoon-mystic-lich_queen',
      'watermoon-mystic-skeleton_army',
      'watermoon-mystic-undying_slime',
    ];

    this.bossFlag = FLAGS.MYSTIC_BOSS;
  }

  /**
   * Get the description for this enemy and character.
   * Allows for custom logic on a per-character basis.
   *
   * @param {Character} character - The character getting enemy description.
   *
   * @return {array}
   */
  getDescription(character) {
    let description = super.getDescription(character);

    switch (this.getFlavour()) {
      case FLAVOUR_CHERRY:
        description += "You've seen many a slime in your time, but not one this deep a red, nor one that smells this strongly of cherries.  Despite its pleasant smell, a powerful heat radiates from this slime.  You'd better keep your distance lest you burn to a crisp!";
        break;

      case FLAVOUR_BLUEBERRY:
        description += "A tiny ice slick surrounds this dark blue slime, and while a scent of blueberries hangs on the air, you're not tempted to get a better whiff and expose yourself to icy danger!";
        break;

      case FLAVOUR_KIWI:
        description += "This slime is a bright, pleasant green, and a faint smell of kiwi lingers in your nostrils.  However, the ground behind this slime bubbles ominously, and any bugs that were in its path flail around in agony.";
        break;
    }

    switch (this.getTimesDied()) {
      case 1:
        description += "\nThe slime seems more powerful than before.";
        break;

      case 2:
        description += "\nEgads!  The slime seems even more powerful!";
        break;

      case 3:
        description += "\nHm, the slime seems less powerful than before...";
        break;

      case 4:
        description += "\nThe slime is visibly dissolving in front of your eyes.";
        break;
    }

    return description;
  }

  /**
   * Get the number of times this enemy has "died"
   *
   * @return {integer}
   */
  getTimesDied() {
    return this.getFlag(FLAG_TIMES_DIED, 0);
  }

  /**
   * Get the "flavour" of this slime.
   *
   * @return {string}
   */
  getFlavour() {
    return this.getFlag(FLAG_FLAVOUR, FLAVOUR_CHERRY);
  }

  /**
   * Override max HP based on how many times slime has died.
   *
   * @param {integer} level - The level to set them to.
   * @param {integer} levelBonus - A location-based level bonus to add/subtract.
   */
  setLevel(level, levelBonus = 0) {
    super.setLevel(level, levelBonus);

    this.setNewMaxHp();
  }

  /**
   * Set the max HP that this new form of the Slime should have.
   */
  setNewMaxHp() {
    let modifier;
    switch (this.getTimesDied()) {
      case 0: modifier = 0.33; break;
      case 1: modifier = 0.66; break;
      case 2: modifier = 1; break;
      case 3: modifier = 0.66; break;
      case 4: modifier = 0.33; break;
    }

    // First level only gets base stats
    let increaseBy = this.level + this.getLevelBonus() - 1;

    this.maxHp = this.stats.base.maxHp + Math.floor(increaseBy * this.stats.perLevel.maxHp * modifier);
    this._hp   = this.maxHp;
  }

  /**
   * Not dead until you've killed it 5 times!
   *
   * @return boolean
   */
  isDead() {
    return super.isDead() && this.getTimesDied() >= 4;
  }

  /**
   * Every time slime "dies", come back as a new slime.
   *
   * @param {Combatant} opponent - The current combatant's opponent.
   *
   * @return {array} Messages generated by these actions.
   */
  doPostRoundActions(opponent) {
    let messages = super.doPostRoundActions(opponent);

    // If at < 0 health, but can still "respawn", pick a new flavour.
    const timesDied = this.getTimesDied();
    if (this.hp <= 0 && timesDied < 4) {
      const possibleFlavours = [
        FLAVOUR_CHERRY,
        FLAVOUR_BLUEBERRY,
        FLAVOUR_KIWI,
      ].filter(flavour => flavour != this.getFlavour());

      this.setFlag(FLAG_TIMES_DIED, timesDied + 1);
      this.setFlag(FLAG_FLAVOUR, fromArray(possibleFlavours));
      this.setNewMaxHp();

      messages.push("You splatter the Undying Slime to bits, only to watch in horror as it reforms in front of your eyes!");

      switch (this.getFlavour()) {
        case FLAVOUR_CHERRY:
          messages.push(":cherries: The slime is a deep red colour and smells of... cherries?");
          break;

        case FLAVOUR_BLUEBERRY:
          messages.push(":large_blue_circle: The slime is a dark blue colour and smells of... blueberries?");
          break;

        case FLAVOUR_KIWI:
          messages.push(":kiwifruit: The slime is a bright green colour and smells of... kiwi?");
          break;
      }

      switch (this.getTimesDied()) {
        case 1:
          messages.push("The slime seems more powerful than before.");
          break;

        case 2:
          messages.push("Egads!  The slime seems even more powerful!");
          break;

        case 3:
          messages.push("Hm, the slime seems less powerful than before...");
          break;

        case 4:
          messages.push("The slime is visibly dissolving in front of your eyes.");
          break;
      }
    }

    return messages;
  }

  /**
   * Return the fight actions of this enemy as a weighted array for Random.
   *
   * @param {Character} character - The character this enemy is fighting.
   *
   * @return {array}
   */
  getWeightedFightActions(character) {
    switch (this.getFlavour()) {
      case FLAVOUR_CHERRY:
        if (this.hasFlag(FLAG_FLAMING_PSEUDOPOD)) {
          return [{ value: 'flamingPseudopod', weight: 100 }];
        }
        return [
          { value: 'burningGunk', weight: 50 },
          { value: 'blazingGoo', weight: 30 },
          { value: 'prepareFlamingPseudopod', weight: 20 },
        ];

      case FLAVOUR_KIWI:
        return [
          { value: 'poisonAttack', weight: 20 },
          { value: 'cripple', weight: 20 },
          { value: 'drainLife', weight: 60 },
        ];

      case FLAVOUR_BLUEBERRY:
        return [
          { value: 'iceBall', weight: 60 },
          { value: 'iceSpear', weight: 30 },
          { value: 'doStun', weight: 10 },
        ];
    }
  }

  // -- Cherry flavoured attacks -----------------------------------------------------------------

  /**
   * Performs a burning attack.
   *
   * @param {Character} character - The character being attacked.
   * @param {float} multiplier - The power of the attack.
   * @param {string} attackText - The text to display when the attack lands.
   * @param {string} dodgeText - The text to display when the attack is dodged.
   * @param {string} missText - The text to display when the attack misses.
   *
   * @return {array}
   */
  burningAttack(character, multiplier, attackText, dodgeText, missText) {
    const attackProperties = [
      PROPERTIES.IS_ATTACK,
      PROPERTIES.BURN_ATTACK,
    ];

    return this.attackHelper(character, (attackInfo) => {
      let messages = [];

      attackInfo.damage = Math.ceil(attackInfo.damage * multiplier);

      character.decreaseHp(attackInfo.damage);

      const critText   = attackInfo.didCrit && attackInfo.damage > 0 ? __(' _Critical hit!_') : '';
      const damageText = attackInfo.damage > 0 ? `*${attackInfo.damage}*` : __('no');
      messages.push(sprintf(attackText, this.getDisplayName(character), damageText, critText));

      messages = messages.concat(character.addStatusBurned());

      return messages;
    }, dodgeText, missText, attackProperties);
  }

  /**
   * Splatter the character with some burning gunk.
   *
   * @param {Character} character - The character being burned.
   *
   * @return {array}
   */
  burningGunk(character) {
    return this.burningAttack(character, 0.5,
      ":fire: %s splatters you with some burning slimy gunk, dealing %s damage and burning you.%s",
      ":dash: %s attempts to splatter you with some burning gunk but you dodge!",
      "%s splatters some burning gunk in your direction, but misses!",
    );
  }

  /**
   * Splatter the character with some blazing goo.
   *
   * @param {Character} character - The character being burned.
   *
   * @return {array}
   */
  blazingGoo(character) {
    return this.burningAttack(character, 1,
      ":fire: %s squirts some blazing goo on you, dealing %s damage and burning you.%s",
      ":dash: %s attempts to squirt some blazing goo at you, but you dodge!",
      "%s squirts some blazing goo in your direction, but misses!",
    );
  }

  /**
   * Prepare to attack the character with a flaming pseudopod.
   *
   * @param {Character} character - The character about to be attacked.
   *
   * @return {array}
   */
  prepareFlamingPseudopod(character) {
    this.setFlag(FLAG_FLAMING_PSEUDOPOD);

    return [`:rage::fire: ${this.getDisplayName(character)} sprouts a long pseudopod, covered in flame.  It winds up, ready to swing with a mighty attack!`];
  }

  /**
   * Attack the character with a flaming pseudopod.
   *
   * @param {Character} character - The character being attacked.
   *
   * @return {array}
   */
  flamingPseudopod(character) {
    return this.burningAttack(character, 2,
      ":fire: %s slams you with a flaming pseudopod, dealing %s damage and burning you.%s",
      ":dash: %s attempts hit you with a flaming pseudopod, but you dodge!",
      "%s swings a flaming pseudopod in your direction, but misses!",
    );
  }

  // -- Blueberry flavoured attacks --------------------------------------------------------------

  /**
   * Performs a chilling attack.
   *
   * @param {Character} character - The character being attacked.
   *
   * @return {array}
   */
  chillingAttack(character, multiplier, attackText, dodgeText, missText) {
    return this.attackHelper(character, (attackInfo) => {
      let messages = [];

      attackInfo.damage = Math.ceil(attackInfo.damage * multiplier);

      const critText   = attackInfo.didCrit && attackInfo.damage > 0 ? __(' _Critical hit!_') : '';
      const damageText = attackInfo.damage > 0 ? `*${attackInfo.damage}*` : __('no');

      character.decreaseHp(attackInfo.damage);

      messages.push(sprintf(attackText, this.getDisplayName(character), damageText, critText));
      messages = messages.concat(character.addStatusChilled());

      return messages;
    }, dodgeText, missText);
  }

  /**
   * Hit the character with a ball of icey slime.
   *
   * @param {Character} character - The character being iced.
   *
   * @return {array}
   */
  iceBall(character) {
    return this.chillingAttack(character, 1,
      ":snowflake: %s smacks you with a ball of icey slime, dealing %s damage and chilling you.%s",
      ":dash: %s throws a ball of icey slime at you, but you dodge!",
      "%s throws a ball of icey slime at you, but misses!",
    );
  }

  /**
   * Impale the character with a spear made of ice.
   *
   * @param {Character} character - The character being iced.
   *
   * @return {array}
   */
  iceSpear(character) {
    return this.chillingAttack(character, 2,
      ":snowflake: %s impales with a spear of freezing cold slime, dealing %s damage and chilling you.%s",
      ":dash: %s waves a spear of freezing cold slime at you, but you dodge!",
      "%s attacks you with a spear of freezing cold slime, but misses!",
    );
  }

  /**
   * Clear all Mystic flags.
   *
   * @param {Character} character - The character who won the fight.
   * @param {array} messages - Any messages that have happened so far in combat.
   *
   * @return {array}
   */
  doFightSuccess(character, messages) {
    character.clearFlag(FLAGS.NECRODRAGON_DEFEATS);
    character.clearFlag(FLAGS.NECRODRAGON_HEALTH);
    character.clearFlag(FLAGS.CATACOMBS_OPEN);
    character.clearFlag(FLAGS.FAITH_PORTAL_OPEN);
    character.clearFlag(FLAGS.SHADOW_PORTAL_OPEN);
    character.clearFlag(FLAGS.DEATH_PORTAL_OPEN);
    character.clearFlag(FLAGS.FAITH_BOSS_DEFEATED);
    character.clearFlag(FLAGS.SHADOW_BOSS_DEFEATED);
    character.clearFlag(FLAGS.DEATH_BOSS_DEFEATED);

    return super.doFightSuccess(character, messages);
  }
}

module.exports = UndyingSlimeEnemy;