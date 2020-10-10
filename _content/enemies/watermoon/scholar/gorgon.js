"use strict";

const mix                 = require('mixwith').mix;
const WatermoonEnemy      = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const FuriousAction       = require('@mixins/enemy/actions/furious').FuriousAction;
const StunAction          = require('@mixins/enemy/actions/stun').StunAction;
const PoisonAction        = require('@mixins/enemy/actions/poison').PoisonAction;
const CurseAction         = require('@mixins/enemy/actions/curse').CurseAction;
const DropsMoondrop       = require('@mixins/enemy/loot/moondrop').DropsMoondrop;

const FLAGS = require('@constants').FLAGS;

const GazeAction = StunAction(0, {
  duration: 3,
  dodgeText: ":dash: %s gazes at you, but you manage to shake it off!",
  missText: "%s gazes as you, but you manage to avoid eye contact.",
  attackText: ":tired_face: %s gazes at you and turns you to stone, dealing %s damage and stunning you for %d turns!%s",
});

const SnakebiteAction = PoisonAction(20, {
  duration: 10,
  cooldown: 10,
  text: ":syringe: Snakes from %s's head bite you, inflicting a seemingly minor wound.  However, after a few short moments you can feel the poison begin to set in!",
});

const FLAG_FIRST_GAZE = 'first_gaze';
const FLAG_SECOND_GAZE = 'second_gaze';

class GorgonEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(20),
  GazeAction,
  SnakebiteAction,
  CurseAction(20),
  DropsMoondrop(3),
  WatermoonReputation(50)
) {
  constructor() {
    super({
      type: 'watermoon-scholar-gorgon',
      displayName: __("Gorgon"),
      description: __("A tiny, four-foot-nothing woman limps towards you, seemingly not threatening at all.  Suddenly, she stands up straight and removes her kerchief, revealing that she has long snakes for hair!  She smiles evilly and tries to catch your gaze."),
      isBoss: true,
      stats: {
        base: {
          maxHp: 75,
          force: 7,
          goldMin: 50,
          goldMax: 50
        },
        perLevel: {
          maxHp: 45,
          force: 2,
          goldMin: 20,
          goldMax: 25
        }
      },
    });
  }

  /**
   * Get the fight actions for this enemy.
   *
   * @param {Character} character - The character this enemy is fighting.
   * @param {object} actions - Actions passed in from mixed-in actions.
   *
   * @return {object}
   */
  getFightActions(character, actions = {}) {
    if (this.shouldGaze()) {
      this.setGazeFlag();
      return { doStun: 100 };
    }

    return super.getFightActions(character);
  }

  /**
   * Gaze once at the start of the round, and once again when below 50% HP.
   */
  shouldGaze() {
    return ! this.hasFlag(FLAG_FIRST_GAZE)
      || ( ! this.hasFlag(FLAG_SECOND_GAZE) && this.hp < (this.maxHp / 2));
  }

  /**
   * Set the first or second gaze flag, depending on which needs to be set.
   */
  setGazeFlag() {
    if ( ! this.hasFlag(FLAG_FIRST_GAZE)) {
      this.setFlag(FLAG_FIRST_GAZE);
    }
    else {
      this.setFlag(FLAG_SECOND_GAZE);
    }
  }

  /**
   * Set a flag indicating this boss has been defeated.
   *
   * @param {Character} character - The character who won the fight.
   * @param {array} messages - Any messages that have happened so far in combat.
   *
   * @return {array}
   */
  doFightSuccess(character, messages) {
    character.setFlag(FLAGS.BOSS_DEFEATED_ + this.type);

    character.track('Gorgon Defeated');

    return super.doFightSuccess(character, messages);
  }

  /**
   * Do any extra actions required when running.
   *
   * @param {Character} character - The character doing the running.
   * @param {array} message - The previously-generated messages.
   *
   * @return {array}
   */
  doFightRun(character, messages) {
    messages = super.doFightRun(character, messages);

    this.leaveLabyrinth(character);
    messages.push(__("The %s chases you right out of the Labyrinth!", this.getDisplayName(character)));

    return messages;
  }

  /**
   * Special actions to take when this enemy has won.
   *
   * NOTE: Any additionally enqueued messages NEED a delay in order to ensure they show up after
   * the action fight message.
   *
   * @param {Character} character - The character who lost the fight.
   *
   * @return array
   */
  doFightFailure(character, messages) {
    messages = super.doFightFailure(character, messages);

    this.leaveLabyrinth(character);
    messages.push("As you pass into unconsciousness, you can feel your body being dragged out of the Labyrinth.");

    return messages;
  }

  /**
   * Move the character out of the Labyrinth into the quad.
   *
   * @param {Character} character - The character being moved out of the Labyrinth.
   */
  leaveLabyrinth(character) {
    const Locations = require('@app/content/locations').Locations;
    character.location = Locations.new('watermoon-scholar-quad');
  }
}

module.exports = GorgonEnemy;