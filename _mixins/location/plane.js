"use strict";

const Actions = require('slacksimple').Actions;
const Options = require('slacksimple').Options;
const Random  = require('@util/random');
const Num     = require('@util/num');

const FLAGS      = require('@constants').FLAGS;
const DIRECTIONS = require('@constants').DIRECTIONS;

const FLAG_LAST_DOWSE_DIRECTION_ = 'last_dowse_direction_';

const DOWSE_LATITUDE  = 1;
const DOWSE_LONGITUDE = 2;
const MINIMAP_DRAW_DISTANCE = 2;

/**
 * Mystic Plane common functions.
 *
 * @return {Mixin}
 */
const PlaneLocation = () => {
  return (Location) => class extends Location {
    /**
     * Change the direction this character is facing.
     *
     * @param {Character} character - The character doing the dowsing.
     * @param {string} direction - The direction to change to.
     */
    changeDirection(character, direction) {
      character.setFlag(this.getPlaneType(character) + FLAGS._DIRECTION, direction);
    }

    /**
     * Identify N/S, E/W, or rough distance.
     *
     * @param {Character} character - The character doing the dowsing.
     * @param {integer} dowseType - The type of direction returned by the dowsing.
     *
     * @return {string}
     */
    dowse(character, dowseType = 0) {
      const playerLocation = this.getPlayerLocation(character);
      const bossLocation   = this.getBossLocation(character);
      const planeType      = this.getPlaneType(character);

      // If boss has been defeated, no more dowsing
      if (this.hasPlaneSoulGem(character)) {
        if (this.hasAllSoulGems(character)) {
          return __(":crystal_ball: You already have all the Soul Gems required to challenge the Necrodragon.  Return to the Mystic District and enter the Catacombs to issue your challenge!");
        }

        return __(":crystal_ball: You already have the Soul Gem for this plane.  No boss remains to fight.  Return to the Mystic District and enter another plane to procure further Soul Gems.");
      }
      // If at boss location, say so!
      else if (this.isAtBoss(character)) {
        return __("Your target stands before you.");
      }
      else if (DOWSE_LATITUDE === dowseType) {
        // If at boss latitude, dowse longitude
        if (playerLocation.y === bossLocation.y) {
          return this.dowse(character, DOWSE_LONGITUDE);
        }

        character.setFlag(FLAG_LAST_DOWSE_DIRECTION_ + planeType, DOWSE_LATITUDE);

        const direction = playerLocation.y < bossLocation.y ? __('south') : __('north');

        return __(":crystal_ball: You can sense your target's presence to the %s.", direction);
      }
      else if (DOWSE_LONGITUDE === dowseType) {
        // If at boss longitude, dowse latitude
        if (playerLocation.x === bossLocation.x) {
          return this.dowse(character, DOWSE_LATITUDE);
        }

        character.setFlag(FLAG_LAST_DOWSE_DIRECTION_ + planeType, DOWSE_LONGITUDE);

        const direction = playerLocation.x < bossLocation.x ? __('east') : __('west');

        return __(":crystal_ball: You can sense your target's presence to the %s.", direction);
      }

      // No dowseType set?  Pick one at random!
      return this.dowse(character, this.getRandomDowseType(
        character,
        [DOWSE_LATITUDE, DOWSE_LONGITUDE]
      ));
    }

    /**
     * Get the distance between the player and the boss.
     *
     * @param {Character} character - The character to get the distance for.
     *
     * @return {float}
     */
    getBossDistance(character) {
      const playerLocation = this.getPlayerLocation(character);
      const bossLocation   = this.getBossLocation(character);

      const xDiff = bossLocation.x - playerLocation.x;
      const yDiff = bossLocation.y - playerLocation.y;

      return Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2));
    }

    /**
     * Get a random dowse type filtered to exclude the last dowse type.
     * Prevents double-dowsing.
     *
     * @param {Character} character - The character dowsing.
     * @param {array} dowseArray - The entries to filter.
     *
     * @return {integer}
     */
    getRandomDowseType(character, dowseArray) {
      const planeType     = this.getPlaneType(character);
      const lastDosweType = character.getFlag(FLAG_LAST_DOWSE_DIRECTION_ + planeType);

      return Random.fromArray(dowseArray.filter((dowseType) => {
        return dowseType !== lastDosweType;
      }));
    }

    /**
     * Move character in direction.
     *
     * @param {Character} character - The character who won the fight.
     * @param {array} messages - Messages that have already been generated.
     *
     * @return {array}
     */
    doFightSuccess(character, messages) {
      // No need to move if you defeated a boss.
      if (character.enemy.isBoss) {
        return messages;
      }

      let { x, y }    = this.getPlayerLocation(character);
      const direction = this.getDirection(character);
      const layout    = this.getLayout(character);

      switch (direction) {
        case DIRECTIONS.NORTH: y -= 1; break;
        case DIRECTIONS.EAST:  x += 1; break;
        case DIRECTIONS.WEST:  x -= 1; break;
        case DIRECTIONS.SOUTH: y += 1; break;
      }

      if (this.isOutOfRange(x, y)) {
        messages.push(__(":warning: You cannot travel any further in your current direction."));
        return messages;
      }

      const tile = this.getTile(layout, x, y);
      messages.push(this.getTileTravelText(tile, direction));

      if (this.isTilePassable(tile)) {
        this.setPlayerLocation(character, x, y);
      }

      const plane = this.getPlaneType(character);
      const steps = character.getFlag(`steps_${plane}`);
      character.setFlag(`steps_${plane}`, steps + 1);

      return messages;
    }

    /**
     * Get text describing how far away the character is from their target.
     *
     * @param {Character} character - The character to get text for.
     *
     * @return {string}
     */
    getDistanceText(character) { }

    /**
     * If the character has the soul gem for this plane.
     *
     * @param {Character} character - The character to check for.
     *
     * @return {boolean}
     */
    hasPlaneSoulGem(character) {
      return character.inventory.has(`quest-watermoon-${this.getPlaneType(character)}_soul_gem`);
    }

    /**
     * If the character has all the soul gems.
     *
     * @param {Character} character - The character to check for.
     *
     * @return {boolean}
     */
    hasAllSoulGems(character) {
      return character.inventory.has(`quest-watermoon-faith_soul_gem`)
        && character.inventory.has(`quest-watermoon-shadow_soul_gem`)
        && character.inventory.has(`quest-watermoon-death_soul_gem`);
    }

    /**
     * Get the location of the player on this plane.
     *
     * @param {Character} character - The character to get the location of.
     *
     * @return {object}
     */
    getPlayerLocation(character) {
      return character.getFlag(this.getPlaneType(character) + FLAGS._LOCATION);
    }

    /**
     * Set the player's location in this plane.
     *
     * @param {Character} character - The character to set the location for.
     * @param {integer} x - The x location of the character.
     * @param {integer} y - The y location of the character.
     */
    setPlayerLocation(character, x, y) {
      character.setFlag(this.getPlaneType(character) + FLAGS._LOCATION, {
        x: Num.bound(x, 0, this.getPlaneSize(character)),
        y: Num.bound(y, 0, this.getPlaneSize(character))
      });
    }

    /**
     * Get the location of the boss on this plane.
     *
     * @param {Character} character - The character to get the boss location for.
     *
     * @return {object}
     */
    getBossLocation(character) {
      return character.getFlag(this.getPlaneType(character) + FLAGS._BOSS_LOCATION);
    }

    /**
     * Get the direction the character is facing in this plane.
     *
     * @param {Character} character - The character to get the direction of.
     *
     * @return {string}
     */
    getDirection(character) {
      return character.getFlag(this.getPlaneType(character) + FLAGS._DIRECTION);
    }

    /**
     * Get the layout of the plane the character is on.
     *
     * @param {Character} character - The character to get the layout for.
     *
     * @return {integer}
     */
    getLayout(character) {
      return character.getFlag(this.getPlaneType(character) + FLAGS._PLANE_LAYOUT);
    }

    /**
     * Gets the type of this plane.
     *
     * @param {Character} character - The character to check.
     *
     * @return string
     */
    getPlaneType(character) { }

    /**
     * Identifies if a location is out of range for this plane.
     *
     * @param {integer} x - The x position of the location to check.
     * @param {integer} y - The y position of the location to check.
     *
     * @return {Boolean}
     */
    isOutOfRange(x, y) {
      if (x < 0) {
        return true;
      }
      else if (y < 0) {
        return true;
      }
      else if (x > this.getPlaneSize()) {
        return true;
      }
      else if (y > this.getPlaneSize()) {
        return true;
      }

      return false;
    }

    /**
     * Get the size of this plane.
     *
     * @return {integer}
     */
    getPlaneSize() { }

    /**
     * Get the text to display for actions in this location.
     *
     * @param {Character} character - The character looking.
     *
     * @return {string}
     */
    getLookTitle(character) {
      return __('Actions:');
    }

    /**
     * Get the actions for this location and character.
     * Allows for custom logic on a per-character basis.
     *
     * @param {Character} character - The character getting actions.
     *
     * @return {array}
     */
    getActions(character) {
      const playerDirection = this.getDirection(character);

      let actions = super.getActions(character, new Actions());

      let options = new Options;
      for (let direction of ["north", "east", "west", "south"]) {
        if (direction !== playerDirection) {
          options.add(__(_.upperFirst(direction)), { action: 'direction', direction });
        }
      }
      actions.addSelect(__("Change Direction"), 'plane_action', options.getCollection());

      const style = character.ap > 0 ? 'default' : 'danger';
      actions.addButton(__("Dowse (1 AP)"), 'plane_action', { params: { action: 'dowse' }, style });

      return actions;
    }

    /**
     * Get the description for this location and character.
     * Add location, direction, and nearby landmarks.
     *
     * @param {Character} character - The character getting location description.
     *
     * @return {array}
     */
    getDescription(character) {
      let description = this._description;
      const layout = this.getLayout(character);
      const { x, y } = this.getPlayerLocation(character);
      const direction = this.getDirection(character);

      description += __("\n\nYou are currently located at X: %d, Y: %d, travelling %s.", x + 1, y + 1, __(_.upperFirst(direction)));

      description += this.buildMiniMap(character);

      description += this.getLocationDescription(character, __("North"), layout, x, y - 1);
      description += this.getLocationDescription(character, __("East"), layout, x + 1, y);
      description += this.getLocationDescription(character, __("West"), layout, x - 1, y);
      description += this.getLocationDescription(character, __("South"), layout, x, y + 1);

      return description;
    }

    /**
     * Build a minimap of the character's surroundsings.
     *
     * @param {Character} character - The character to build the map for.
     *
     * @return {string}
     */
    buildMiniMap(character) {
      let map = '```';

      const layout    = this.getLayout(character);
      const direction = this.getDirection(character);
      const { x, y }  = this.getPlayerLocation(character);

      for (let mapY = y - MINIMAP_DRAW_DISTANCE; mapY <= y + MINIMAP_DRAW_DISTANCE; mapY++) {
        // Don't draw off map borders
        if (mapY < 0 || mapY > this.getPlaneSize()) {
          continue;
        }

        let row = [];
        for (let mapX = x - MINIMAP_DRAW_DISTANCE; mapX <= x + MINIMAP_DRAW_DISTANCE; mapX++) {
          // Don't draw off map borders
          if (mapX < 0 || mapX > this.getPlaneSize()) {
            continue;
          }

          if (x === mapX && y === mapY) {
            switch (direction) {
              case DIRECTIONS.NORTH: row.push("↑"); break;
              case DIRECTIONS.EAST:  row.push("→"); break;
              case DIRECTIONS.WEST:  row.push("←"); break;
              case DIRECTIONS.SOUTH: row.push("↓"); break;
            }
          }
          else {
            row.push(this.getTile(layout, mapX, mapY));
          }
        }
        map += `|${row.join('|')}|\n`;
      }

      map += '```';

      return map;
    }

    /**
     * Get the enemy type of the boss.
     *
     * @param {Character} character - The character fighting the boss.
     *
     * @return {string}
     */
    getBossType(character) { }

    /**
     * Only add Cursed Chest if not at boss.
     *
     * @param {Character} character - The character to add the chest for.
     *
     * @return boolean
     */
    shouldAddCursedChest(character) {
      return ! this.isAtBoss(character);
    }

    /**
     * Populate encounter choices to randomly draw from.
     * This can be overridden in specific locations to add/remove encounters from the population
     * base on the character.
     *
     * @param {Character} character - The character in this location.
     *
     * @return {array}
     */
    getEncounters(character) {
      let encounters = [
        { value: 'fight', weight: 95 }
      ];

      if ( ! this.isAtBoss(character)) {
        encounters.push({ value: 'watermoon-mystic-tunnel', weight: 5 });

        if (character.accessory.type === 'equipment-accessories-watermoon-050_goldscale_ring') {
          encounters = character.accessory.addGoldDrakeEncounter(encounters);
        }
      }

      return encounters;
    }

    /**
     * Populate enemy choices to randomly draw from.
     * This can be overridden in specific locations to add/remove enemies from the population based
     * on the character.
     *
     * @param {Character} character - The character in this location.
     *
     * @return {array}
     */
    getEnemies(character) {
      if (this.isAtBoss(character)) {
        return [ { value: this.getBossType(character), weight: 100 } ];
      }

      return super.getEnemies(character);
    }

    /**
     * Check if the character is at the boss's location.
     *
     * @param {Character} character - The character to check the location of.
     *
     * @return {boolean}
     */
    isAtBoss(character) {
      const playerLocation = this.getPlayerLocation(character);
      const bossLocation = this.getBossLocation(character);

      return playerLocation.x === bossLocation.x && playerLocation.y === bossLocation.y;
    }

    /**
     * Get the description for a specific location.
     *
     * @param {Character} character - The character doing the looking.
     * @param {string} direction - The direction being checked.
     * @param {integer} layout - The layout being checked.
     * @param {integer} x - The X position of the location being checked.
     * @param {integer} y - The Y position of the location being checked.
     *
     * @return string
     */
    getLocationDescription(character, direction, layout, x, y) {
      if (this.isOutOfRange(x, y)) {
        return __('\nTo the %s, you see an impassible hazy mist.', direction);
      }

      return this.getTileDescription(this.getTile(layout, x, y), direction);
    }

    /**
     * Gets the description of a tile.
     *
     * @param {string} tile - The letter tile to get a description of.
     * @param {string} direction - The direction the tile lays in.
     *
     * @return {string}
     */
    getTileDescription(tile, direction) {
      switch (tile) {
        case 'R': return __('\nTo the %s, you see a burbling river that you cannot ford.', direction);
        case '=': return __('\nTo the %s, you see a bridge.', direction);
        case 'L': return __('\nTo the %s, you see a still lake that you cannot swim.', direction);
        case 'W': return __('\nTo the %s, you see a high wall that you cannot scale.', direction);
        case 'T': return __('\nTo the %s, you see a huge tree that you must walk around.', direction);
        case 'F': return __('\nTo the %s, you see a light fog.', direction);
        case 'D': return __('\nTo the %s, you see an open door.', direction);
        case 'G': return __('\nTo the %s, you see an immense gravestone that you must walk around.', direction);
        default: return '';
      }
    }

    /**
     * Get a specific tile from a specific layout.
     *
     * @param {integer} layout - The layout requested.
     * @param {integer} x - The x location.
     * @param {integer} y - The y location.
     *
     * @return {string}
     */
    getTile(layout, x, y) {
      return this.getTiles(layout)[y][x];
    }

    /**
     * Get the tiles for the requested layout.
     *
     * @param {integer} layout - The layout requested.
     *
     * @param {array}
     */
    getTiles(layout) { }

    /**
     * Returns if the provided tile is passable or not.
     *
     * @param {string} tile - The tile to check.
     *
     * @return {boolean}
     */
    isTilePassable(tile) {
      switch (tile) {
        case "R": return false;
        case "=": return true;
        case "L": return false;
        case "W": return false;
        case 'T': return false;
        case 'F': return true;
        case 'D': return true;
        case 'G': return false;
      }

      return true;
    }

    /**
     * Get the text returned when trying to travel to this tile.
     *
     * @param {string} tile - The tile to attempt to travel onto.
     * @param {string} direction - The direction being travelled.
     *
     * @return {string}
     */
    getTileTravelText(tile, direction) {
      switch (tile) {
        case "R": return __(":warning: Your path to the %s is blocked by a river.", __(_.upperFirst(direction)));
        case "=": return __(":mans_shoe: You travel across the bridge to the %s.", __(_.upperFirst(direction)));
        case "L": return __(":warning: Your path to the %s is blocked by a lake.", __(_.upperFirst(direction)));
        case "W": return __(":warning: Your path to the %s is blocked by a wall.", __(_.upperFirst(direction)));
        case 'T': return __(":warning: Your path to the %s is blocked by a huge tree.", __(_.upperFirst(direction)));
        case 'F': return __(":mans_shoe: You travel through the fog to the %s, unsure what lies beyond.", __(_.upperFirst(direction)));
        case 'D': return __(":mans_shoe: You pass through the open door to the %s.", __(_.upperFirst(direction)));
        case 'G': return __(":warning: Your path to the %s is blocked by an immense gravestone.", __(_.upperFirst(direction)));
      }

      return __(":mans_shoe: You travel to the %s.", __(_.upperFirst(direction)));
    }

    /**
     * Get a random start/boss location for the provided layout & quadrant.
     *
     * @param {integer} layout - The layout to choose from.
     * @param {integer} quadrant - The quadrant to choose from.
     *
     * @return {object} The X & Y co-ordinates of the chosen location.
     */
    getRandomLocation(layout, quadrant) {
      return Random.fromArray(this.getPossibleLocations(layout, quadrant));
    }

    /**
     * Randomly choose the start and boss locations.
     *
     * @param {integer} layout - The layout to choose from.
     *
     * @return {object} The start and end locations.
     */
    getLocations(layout) {
      const opposites = {
        0: 3,
        1: 2,
        2: 1,
        3: 0
      };

      const startQuadrant = Random.between(0, 3);
      const bossQuadrant = opposites[startQuadrant];

      return {
        startLocation: this.getRandomLocation(layout, startQuadrant),
        bossLocation: this.getRandomLocation(layout, bossQuadrant)
      };
    }
  };
};

module.exports = {
  PlaneLocation
};