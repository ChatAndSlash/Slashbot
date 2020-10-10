"use strict";

const ContentDoesNotExistError = require('@app/errors').ContentDoesNotExistError;

module.exports = function(collection, names, types) {
  /**
   * Utility class for searching and creating content objects.
   */
  class Content {
    /**
     * Return all content, keyed by its type.
     *
     * @return {object}
     */
    static all() {
      return collection;
    }

    /**
     * Return the content class by its type.
     *
     * @param {string} type - The content type.
     *
     * @return {object}
     */
    static find(type) {
      let found = collection[type];

      if (_.isUndefined(found)) {
        throw new ContentDoesNotExistError(`Invalid type: '${type}'.`);
      }

      return found;
    }

    /**
     * Get the name of the content, given the type.
     *
     * @param {string} type - The type of the content.
     *
     * @return {string}
     */
    static getName(type) {
      let name = names[type];

      if (_.isUndefined(name)) {
        throw new ContentDoesNotExistError(`Invalid type: '${type}'.`);
      }

      return name;
    }

    /**
     * Get the type of content, given its name.
     *
     * @param {string} name - The name of the content.
     *
     * @return {string}
     */
    static getType(name) {
      let type = types.get(name.toLowerCase());

      if (_.isUndefined(type)) {
        throw new ContentDoesNotExistError(`Invalid name '${name}'.`);
      }

      return type;
    }

    /**
     * If there is valid content for the provided name.
     *
     * @param {string} name - The name of the content.
     *
     * @return {boolean}
     */
    static isValidName(name) {
      let type = types.get(name.toLowerCase());

      return type !== undefined;
    }

    /**
     * Return a new instance of content by its type.
     *
     * @param {string} type - The content type.
     * @param {array} args - Any extra args to pass along to the command.
     *
     * @return {object}
     */
    static new(type, ...args) {
      const found = this.find(type);
      return new found(...args);
    }
  }

  return Content;
};
