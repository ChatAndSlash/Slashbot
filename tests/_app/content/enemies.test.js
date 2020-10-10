/*eslint-env mocha */
"use strict";

const Character = require('@app/character').Character;
const Enemy     = require('@app/content/enemies').Enemy;

const FLAGS      = require('@constants').FLAGS;
const PROPERTIES = require('@constants').PROPERTIES;

// -- Tests ----------------------------------------------------------------------------------------

describe('Enemy', () => {
  let enemy     = {};
  let character = {};

  beforeEach(() => {
    character = {
      defence: 10,
      dodge: 0,
      hasFlag: (flag) => false,
      decreaseHp: (hp) => {},
      doDefenderPostAttackProcessing: (attackInfo, attacker) => attackInfo,
      defenderModifyAttackParameters: (params, attacker) => params,
      isAtRange: () => false,
    };

    enemy = new Enemy({
      type: 'type',
      displayName: 'displayName',
      description: 'description',
      stats: {
        base: {
          maxHp: 15,
          minDamage: 1,
          maxDamage: 1,
          force: 5,
          crit: 0,
          defence: 1,
          dodge: 5,
          goldMin: 4,
          goldMax: 8
        },
        perLevel: {
          maxHp: 3,
          minDamage: 1,
          maxDamage: 1,
          force: 2.5,
          crit: 0,
          defence: 0.75,
          dodge: 0,
          goldMin: 2,
          goldMax: 4
        }
      },
    });
    enemy.setLevel(1);
  });

  describe('load()', () => {
    it('should complain when it can\'t load an enemy', async () => {
      try {
        await cleanDatabase();
        const connection = await DB_POOL.getConnection();

        await Enemy.load({ id: 'id' }, connection);
        connection.release();
      }
      catch (err) {
        expect(err.message).toBe("No enemy loaded for character ID: 'id'");
      }
    });
  });

  describe('save()', () => {
    it('should save correctly', async () => {
      await cleanDatabase();
      const connection = { query: jest.fn() };

      await enemy.save('id', connection);

      expect(connection.query).toHaveBeenCalledWith(
        "UPDATE enemies SET ? WHERE character_id = ?",
        [{ flags: "{}", hp: 15, level: 1, type: "type"}, "id"]
      );
    });
  });

  describe('getDescription()', () => {
    it('should return the description', () => {
      expect(enemy.getDescription()).toBe('description');
    });
  });

  describe('setLevel()', () => {
    it('should set stats correctly', () => {
      enemy.setLevel(5);

      expect(enemy.maxHp).toBe(27);
      expect(enemy._hp).toBe(27);
      expect(enemy.force).toBe(15);
      expect(enemy.crit).toBe(0);
      expect(enemy.defence).toBe(4);
      expect(enemy.dodge).toBe(5);
      expect(enemy.goldMin).toBe(12);
      expect(enemy.goldMax).toBe(24);
    });
  });

  describe('getXp()', () => {
    it('should calculate XP correctly', () => {
      enemy.level = 1;
      expect(enemy.getXp({ level: 1 })).toBe(50);

      enemy.level = 5;
      expect(enemy.getXp({ level: 5 })).toBe(250);

      // 80%
      enemy.level = 5;
      expect(enemy.getXp({ level: 6 })).toBe(200);

      // 60%
      enemy.level = 5;
      expect(enemy.getXp({ level: 7 })).toBe(150);

      // 40%
      enemy.level = 5;
      expect(enemy.getXp({ level: 8 })).toBe(100);

      // 0%
      enemy.level = 5;
      expect(enemy.getXp({ level: 9 })).toBe(0);
    });
  });

  describe('getSp()', () => {
    it('should calculate SP correctly', () => {
      enemy.setLevel(10);
      expect(enemy.getSp({ level: 10, profession: { maxSp: 100, sp: 0, spSpent: 0 }, pet: { type: 'equipment-pets-000_no_pet' }, hasFlag: () => false, hasBoost: () => false, })).toBe(5);
      expect(enemy.getSp({ level: 11, profession: { maxSp: 100, sp: 0, spSpent: 0 }, pet: { type: 'equipment-pets-000_no_pet' }, hasFlag: () => false, hasBoost: () => false, })).toBe(4);
      expect(enemy.getSp({ level: 12, profession: { maxSp: 100, sp: 0, spSpent: 0 }, pet: { type: 'equipment-pets-000_no_pet' }, hasFlag: () => false, hasBoost: () => false, })).toBe(3);
      expect(enemy.getSp({ level:  9, profession: { maxSp: 100, sp: 0, spSpent: 0 }, pet: { type: 'equipment-pets-000_no_pet' }, hasFlag: () => false, hasBoost: () => false, })).toBe(5);

      expect(enemy.getSp({ level: 10, profession: { maxSp: 100, sp: 0, spSpent: 95 }, pet: { type: 'equipment-pets-000_no_pet' }, hasFlag: () => false, hasBoost: () => false, })).toBe(5);
      expect(enemy.getSp({ level: 10, profession: { maxSp: 100, sp: 0, spSpent: 100 }, pet: { type: 'equipment-pets-000_no_pet' }, hasFlag: () => false, hasBoost: () => false, })).toBe(5);

      expect(enemy.getSp({ level: 10, profession: { maxSp: 100, sp: 0, spSpent: 0 }, pet: { type: 'equipment-pets-000_no_pet' }, hasFlag: () => true, hasBoost: () => false, })).toBe(10);

      expect(enemy.getSp({ level: 10, profession: { maxSp: 100, sp: 0, spSpent: 0 }, pet: { type: 'equipment-pets-aisling' }, hasFlag: () => false, hasBoost: () => false, })).toBe(6);
    });
  });

  describe('attackHelper()', () => {
    it('should handle dodging/missing/successful attacks', () => {

      enemy.getAttackInfo = jest.fn(() => {
        return {
          didDodge: true,
          extraMessages: [],
        };
      });
      expect(enemy.attackHelper(character), () => []).toEqual([
        ":dash: displayName attacks, but you dodge!"
      ]);

      enemy.getAttackInfo = jest.fn(() => {
        return {
          didMiss: true,
          extraMessages: [],
        };
      });
      expect(enemy.attackHelper(character), () => []).toEqual([
        "displayName attacks, but misses!"
      ]);

      const successFunction = jest.fn(() => []);
      enemy.getAttackInfo = jest.fn(() => {
        return {
          extraMessages: [],
        };
      });
      enemy.attackHelper(character, successFunction);
      expect(successFunction).toHaveBeenCalledWith(expect.any(Object));
    });
  });

  describe('doFightSuccess()', () => {
    it('should return no messages by default', () => {
      expect(enemy.doFightSuccess({}, [])).toEqual([]);
    });
  });

  describe('doFightFailure()', () => {
    it('should return no messages by default', () => {
      expect(enemy.doFightFailure({}, [])).toEqual([]);
    });
  });

  describe('getFightActions()', () => {
    it('should get default fight actions', () => {
      expect(enemy.getFightActions()).toEqual({ doAttack: 100 });
    });

    it('should add new actions in', () => {
      expect(enemy.getFightActions(character, { doSpin: 50 })).toEqual({ doAttack: 50, doSpin: 50 });
    });

    it('should default to 100% attack', () => {
      expect(enemy.getFightActions(character)).toEqual({ doAttack: 100 });
    });
  });

  describe('getWeightedFightActions()', () => {
    it('should convert actions into weighted actions', () => {
      expect(enemy.getWeightedFightActions()).toEqual([{ value: "doAttack", weight: 100 }]);
    });
  });

  describe('doFightAction()', () => {
    it('should be stunned when stunned', () => {
      enemy.setFlag(FLAGS.STUNNED_TURNS, 1);
      expect(enemy.doFightAction(character)).toEqual(["displayName is stunned and can do nothing this turn."]);
    });

    it('should blow around an enemy trying to enter a windwal', () => {
      let character = new Character();
      enemy.isMeleeAttackingAtRange = jest.fn(() => true);
      character.setFlag(FLAGS.IS_RANGED);
      enemy.setFlag(FLAGS.IS_RANGED);
      enemy.setFlag(FLAGS.WINDWALL_TURNS);
      enemy.blow = jest.fn();

      enemy.doFightAction('any', character);

      expect(enemy.blow).toHaveBeenCalledWith(character);
    });

    it('should close distance when at range', () => {
      let character = new Character();
      enemy.isMeleeAttackingAtRange = jest.fn(() => true);
      character.setFlag(FLAGS.IS_RANGED);
      enemy.setFlag(FLAGS.IS_RANGED);

      expect(enemy.doFightAction('any', character)).toEqual([
        "displayName is too far away to reach you.  It rushes you to close the distance!"
      ]);
      expect(character.hasFlag(FLAGS.IS_RANGED)).toBe(false);
      expect(enemy.hasFlag(FLAGS.IS_RANGED)).toBe(false);
    });

    it('should do a simple attack by default', () => {
      expect(enemy.chooseFightAction(character)).toEqual("doAttack");
    });
  });

  describe('isMeleeAttackingAtRange()', () => {
    it('should identify when melee attacking at range', () => {
      let character = new Character();

      // Melee action being used at range
      enemy.buildActionProperties = jest.fn(() => [PROPERTIES.IS_ATTACK]);
      character.isAtRange = jest.fn(() => true);
      enemy.properties = [];
      expect(enemy.isMeleeAttackingAtRange(character, 'any')).toBe(true);

      // Ranged action
      enemy.buildActionProperties = jest.fn(() => [PROPERTIES.IS_ATTACK, PROPERTIES.RANGED_ATTACK]);
      character.isAtRange = jest.fn(() => true);
      enemy.properties = [];
      expect(enemy.isMeleeAttackingAtRange(character, 'any')).toBe(false);

      // Ranged enemy
      enemy.buildActionProperties = jest.fn(() => [PROPERTIES.IS_ATTACK]);
      character.isAtRange = jest.fn(() => true);
      enemy.properties = [PROPERTIES.RANGED_ATTACK];
      expect(enemy.isMeleeAttackingAtRange(character, 'any')).toBe(false);

      // Not at range
      enemy.buildActionProperties = jest.fn(() => [PROPERTIES.IS_ATTACK]);
      character.isAtRange = jest.fn(() => false);
      enemy.properties = [];
      expect(enemy.isMeleeAttackingAtRange(character, 'any')).toBe(false);

      // Not an attack
      enemy.buildActionProperties = jest.fn(() => []);
      expect(enemy.isMeleeAttackingAtRange(character, 'any')).toBe(false);
    });
  });

  describe('buildActionProperties()', () => {
    it('should combine action and enemy properties', () => {
      enemy.fightActionProperties.castIcicle = [
        PROPERTIES.IS_ATTACK,
        PROPERTIES.CHILL_ATTACK,
      ];

      enemy.attackProperties = [
        PROPERTIES.IS_ATTACK,
        PROPERTIES.BURN_ATTACK,
      ];

      expect(enemy.buildActionProperties('castIcicle')).toEqual([
        'is_attack',
        'burn_attack',
        'chill_attack'
      ]);
    });
  });

  describe('chooseFightAction()', () => {
    it('should randomly choose an attack', () => {
      expect(enemy.chooseFightAction()).toBe('doAttack');
    });
  });

  describe('doAttack()', () => {
    it('should describe a normal attack', () => {
      expect(enemy.doAttack(character)).toEqual([":frowning: displayName attacks, dealing *1* damage to you."]);
    });

    it('should describe a dodge', () => {
      enemy.getAttackInfo = jest.fn(() => {
        return {
          damage: 1,
          didCrit: false,
          didDodge: true,
          didMiss: false,
          extraMessages: [],
        };
      });
      expect(enemy.doAttack(character)).toEqual([":dash: displayName attacks, but you dodge!"]);
    });

    it('should describe a miss', () => {
      enemy.getAttackInfo = jest.fn(() => {
        return {
          damage: 1,
          didCrit: false,
          didDodge: false,
          didMiss: true,
          extraMessages: [],
        };
      });
      expect(enemy.doAttack(character)).toEqual(["displayName attacks, but misses!"]);
    });

    it('should describe a critical hit', () => {
      enemy.getAttackInfo = jest.fn(() => {
        return {
          damage: 1,
          didCrit: true,
          didDodge: false,
          didMiss: false,
          extraMessages: [],
        };
      });
      expect(enemy.doAttack(character)).toEqual([":frowning: displayName attacks, dealing *1* damage to you. _Critical hit!_"]);
    });
  });

  describe('beStunned()', () => {
    it('should be stunned for a turn', () => {
      expect(enemy.beStunned()).toEqual(["displayName is stunned and can do nothing this turn."]);
    });
  });

});