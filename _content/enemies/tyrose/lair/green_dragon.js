"use strict";

const mix              = require('mixwith').mix;
const Enemy            = require('@app/content/enemies').Enemy;
const FuriousAction    = require('@mixins/enemy/actions/furious').FuriousAction;
const PoisonAction     = require('@mixins/enemy/actions/poison').PoisonAction;
const DropsCrystalAcid = require('@mixins/enemy/loot/crystal_acid').DropsCrystalAcid;

const FLAGS      = require('@constants').FLAGS;
const PROPERTIES = require('@constants').PROPERTIES;

class GreenDragon extends mix(Enemy).with(
  FuriousAction(20),
  PoisonAction(10),
  DropsCrystalAcid(100, 10, 12)
) {
  constructor() {
    super({
      type: 'tyrose-lair-green_dragon',
      displayName: 'Green Dragon',
      description: 'This is it. This is the beast you were sent here to slay. Many times larger than you, it towers above you, and looks down upon you with disdain. Its wings flex slowly, but generate enough wind with each beat that you have to lean into it. Acid drips from its maw and sizzles on the stone floor below.',
      levelBonus: 2,
      isBoss: true,
      scales: 3,
      stats: {
        base: {
          maxHp: 75,
          force: 7,
          defence: 10,
          goldMin: 50,
          goldMax: 50
        },
        perLevel: {
          maxHp: 35,
          force: 1,
          defence: 2,
          goldMin: 20,
          goldMax: 25
        }
      },
      fightActions: {
        breatheIn: 20
      },
    });

    this.fightActionProperties.breathAttack = [
      PROPERTIES.IS_ATTACK,
      PROPERTIES.RANGED_ATTACK,
    ];
  }

  /**
   * Choose the fight action for this enemy, green dragon can have a breath attack!
   *
   * @param {Character} character - The character this enemy is fighting.
   *
   * @return {string}
   */
  chooseFightAction(character) {
    // If a breath weapon attack is prepared
    if (this.hasFlag(FLAGS.IS_BREATHING_IN)) {
      return 'breathAttack';
    }

    return super.chooseFightAction(character);
  }

  /**
   * Do nothing this turn, but get ready to do a furious attack next turn.
   *
   * @param {Character} character - The character being attacked.
   *
   * @return {array}
   */
  breatheIn(character) {
    this.setFlag(FLAGS.IS_BREATHING_IN);
    return [__("%s breathes deeply, preparing a devastating breath attack!", this.getDisplayName(character))];
  }

  /**
   * Perform an acidic breath attack.
   *
   * @param {Character} character - The character being attacked.
   *
   * @return {array}
   */
  breathAttack(character) {
    let messages = [];

    // Enemy attacks character
    let attackInfo = this.getAttackInfo(character);

    // Dodged?  No damage!
    if (attackInfo.didDodge) {
      messages.push(__(":dash: %s breathes a stream of acid at you, but you dodge!", this.getDisplayName(character)));
    }

    // Missed?  No damage!
    else if (attackInfo.didMiss) {
      messages.push(__("%s breathes a stream of acid at you, but misses!", this.getDisplayName(character)));
    }

    // Otherwise, character got hurt
    else {
      // Breath weapon attacks do 1.5x damage
      attackInfo.damage = Math.floor(attackInfo.damage * 1.5);

      let critText   = attackInfo.didCrit ? __(' _Critical hit!_') : '';
      let attackText = attackInfo.damage > 0 ? `*${attackInfo.damage}*` : __('no');
      messages.push(__(":dragon_face: %s breathes a stream of acid at you, dealing %s damage.%s", this.getDisplayName(character), attackText, critText));
      character.decreaseHp(attackInfo.damage);
    }

    // No longer breathing in
    this.clearFlag(FLAGS.IS_BREATHING_IN);

    return messages;
  }

  /**
   * Special actions to take when this enemy has been beaten.
   *
   * NOTE: Any additionally enqueued messages NEED a delay in order to ensure they show up after
   * the action fight message.
   *
   * @param {Character} character - The character who won the fight.
   * @param {array} messages - Any messages that have happened so far in combat.
   *
   * @return {array}
   */
  doFightSuccess(character, messages) {
    // Gotta define this in here to avoid circular content file references
    const Locations = require('@app/content/locations').Locations;

    character.clearFlag(FLAGS.FOREST_DRAGON_TRACKS_COUNT);
    character.clearFlag(FLAGS.FOREST_CAVE_DISCOVERED);
    character.clearFlag(FLAGS.CAVE_DEAD_ENDS_COUNT);
    character.clearFlag(FLAGS.GREEN_LAIR_DISCOVERED);
    character.clearFlag(FLAGS.GREEN_DRAKE_ACID_LOOTED);

    character.setFlag(FLAGS.IN_CUTSCENE);

    character.location = Locations.new('stagecoach');

    character.track('Green Dragon Killed');

    character.slashbot.tellStory(messages.concat([
      __("You land the killing blow, collect your loot, and head out of the lair.  Suddenly, you hear a shuddering intake of breath behind you.  You turn around and to your horror, see the *Green Dragon* stand back up, hatred alight in its eyes."),
      __("The *Green Dragon* senses your fear and closes in, its broad jaws grinning.  Suddenly, something stirs inside of you, a heat that quickly spreads through your body."),
      __("Flames blaze up around you and outwards, embracing and consuming the dragon in an inferno.  It roars in fury and pain, but is quickly reduced to ash."),
      __("The fire subsides and you return to your nomal temperature.  It takes a moment to process what has happened, but it becomes clear that the *Phoenix Soul* that *Phaera* imbued within you has helped you defeat this dragon."),
      __("You take a moment to collect yourself, then head back to town.  The townspeople are jubilant at your success and buy you round after round in the tavern."),
      __("The defeat of the *Green Dragon* changes the town.  Weeks go by, and all the refugees return, bringing more with them.  Many closed shoppes re-open, and even the stagecoach starts running again, making it easy to travel again."),
      { text: __("Eventually, you tire of the constant praise and adulation, and feel the need to return to your mission.  One day, you gather your belongings and head to the stagecoach to move on and find the next dragon to slay.") }
    ]), character);

    return [];
  }
}

module.exports = GreenDragon;