var UtilsModule = UtilsModule || (function() {

  "use strict";

  /**
   * Verifies that an given array has a length > 0
   *
   * @param {Array} arr
   * @returns {boolean}
   * @private
   */
  function _verifyArrayNotEmpty(arr) {
    return arr.length > 0;
  }
  /**
   * Checks if a given parameter is an object
   *
   * @param {object} o
   * @returns {boolean}
   * @private
   */
  function _isObject(o) {
    return o !== null && typeof o === "object";
  }
  /**
   * Checks if a given parameter is an array
   *
   * @param {object} o
   * @returns {boolean}
   * @private
   */
  function _isArray(o) {
    return Object.prototype.toString.call(o) === "[object Array]";
  }

  return {
    arrayNotEmpty: _verifyArrayNotEmpty,
    isObject: _isObject,
    isArray: _isArray
  };
}());

/**
 * Enables building a message based on particular pieces
 * - add single message pieces
 * - add arrays of message pieces
 * - provide mappings to translate specific pieces of the message
 *
 * Dependency: UtilsModule
 */
var MessageModule = (function(utils) {

  "use strict";

  var msgPrefix;
  var errorMessages;
  var wordMap;

  /**
   *
   * @constructor
   */
  function MessageModule() {
    msgPrefix = "";
    errorMessages = [];
  }
  /**
   *
   * Set a message prefix which will be placed in from of
   * the main message
   *
   * @param {String} prefix
   * @private
   */
  function _setMessagePrefix(prefix) {
    msgPrefix = prefix;
  }
  /**
   *
   * Provide a object with particular mappings.
   * mappings = {original: newValue, ...}
   * These phrases will be replace in the resulting message
   *
   * @param {Object} mappings
   * @private
   */
  function _setMappings(mappings) {
    wordMap = mappings;
  }
  /**
   *
   * Applies the provided mappings on a given message
   *
   * @param {String} messageString
   * @returns {String}
   * @private
   */
  function _applyWordMap(messageString) {
    var word;
    var tmpMsg = messageString;
    var regex;
    console.log("Map", wordMap);
    if (wordMap) {
      for (word in wordMap) {
        regex = new RegExp(word, "g");
        tmpMsg = tmpMsg.replace(regex, wordMap[word]);
      }
    }
    return tmpMsg;
  }
  /**
   * Add a single entry to the message
   *
   * @param {String} snippet
   * @private
     */
  function _addSingleEntryToErrorMsg(snippet) {
    errorMessages.push(snippet);
  }
  /**
   * Add multiple entries to the message. The specified context
   * describes where the entries belong to
   *
   * @param {String} context
   * @param {Array} snippets
   * @private
   */
  function _addMultipleEntriesToErrorMsg(context, snippets) {
    errorMessages.push({
      context: context,
      snippets:  snippets
    });
  }
  /**
   * Builds the message based on the added pieces
   *
   * @returns {String}
   * @private
   */
  function _buildErrorMessage() {
    var msg = "";
    if (utils.arrayNotEmpty(errorMessages)) {
      msg = msgPrefix;
      errorMessages.forEach(function(messagePart) {
        if (utils.isObject(messagePart)) {
          msg += messagePart.context + "(";
          if (utils.arrayNotEmpty(messagePart.snippets)) {
            var subMsg = "";
            messagePart.snippets.forEach(function(snippet) {
              subMsg += snippet + ", ";
            });
            subMsg = subMsg.slice(0, subMsg.length - 2);
            msg += subMsg + "), ";
          }
        } else {
          msg += messagePart + ", ";
        }
      });
      msg = msg.slice(0, msg.length - 2);
    }
    return _applyWordMap(msg);
  }

  //Define the public interface
  MessageModule.prototype.addMsgPart = _addSingleEntryToErrorMsg;
  MessageModule.prototype.addMsgParts = _addMultipleEntriesToErrorMsg;
  MessageModule.prototype.buildMsg = _buildErrorMessage;
  MessageModule.prototype.setPrefix = _setMessagePrefix;
  MessageModule.prototype.setMappings = _setMappings;

  return MessageModule;

}(UtilsModule));
