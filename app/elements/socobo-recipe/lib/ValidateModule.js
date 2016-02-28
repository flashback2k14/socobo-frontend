/* exported ValidateModule */
/**
 * Provides different methods to validate data
 *
 * @type {{verifySinglePropertyNotEmpty, verifySingleProperty, verifyMultipleProperties,
 * verifyAll, verifyArrayNotEmpty, isNumber, isString, isBoolean}}
 */
var ValidateModule = ValidateModule || (function() {

  "use strict";
  /**
   * Verifies that a single property is not empty
   *
   * @param {object} obj
   * @param {*} property
   * @returns {boolean}
   * @private
   */
  function _verifySinglePropertyValueNotEmpty(obj, property) {
    return !!obj[property];
  }
  /**
   * Verifies that a single property is not empty
   * and that it is of the defined type
   *
   * @param {Object} obj
   * @param {*} property
   * @param {String} type
   * @returns {boolean}
   * @private
   */
  function _verifySingleProperty(obj, property, type) {
    var valid = _verifySinglePropertyValueNotEmpty(obj, property);
    if (type && valid) {
      valid = (typeof obj[property]) === type;
    }
    return valid;
  }
  /**
   * Verifies all properties of the given object are not empty
   * and of the given type. The types of the properties are specified
   * in the properties object like var props = [{value: name, type: string}, ...]
   * The properties are defined over the assigned array
   *
   * @param {Object} obj
   * @param {Array} propertiesArray
   * @returns {Array}
   * @private
   */
  function _verifyAllPropertyValuesNotEmpty(obj, propertiesArray) {
    var invalidProperties = [];
    var prop;
    var valid;
    for (prop in propertiesArray) {
      valid = _verifySingleProperty(obj, propertiesArray[prop].value, propertiesArray[prop].type);
      if (!valid) {
        invalidProperties.push(propertiesArray[prop].value);
      }
    }
    return invalidProperties;
  }
  /**
   * Verifies all properties of all objects
   *
   * @param {Array} objArray
   * @param {Array} propertiesArray
   * @returns {Array}
   * @private
   */
  function _verifyAllPropertyValuesOfAllObjectsNotEmpty(objArray, propertiesArray) {
    var invalidProperties = [];
    var objProp;
    var tmp;

    function elementInList(element) {
      if (invalidProperties.indexOf(element) < 0) {
        invalidProperties.push(element);
      }
    }

    for (objProp in objArray) {
      tmp = _verifyAllPropertyValuesNotEmpty(objArray[objProp], propertiesArray);
      tmp.forEach(elementInList);
    }
    return invalidProperties;
  }
  /**
   * Verifies that array.length > 0
   *
   * @param {Array} arr
   * @returns {boolean}
   * @private
   */
  function _verifyArrayNotEmpty(arr) {
    return arr.length > 0;
  }
  /**
   * Verifies that the input value is of type number
   *
   * @param {*} input
   * @returns {boolean}
   * @private
   */
  function _isNumber(input) {
    return typeof parseInt(input) === "number";
  }
  /**
   * Verifies that the input value is of type string
   *
   * @param {*} input
   * @returns {boolean}
   * @private
   */
  function _isString(input) {
    return typeof input === "string";
  }
  /**
   * Verifies that the input value is of type boolean
   *
   * @param {*} input
   * @returns {boolean}
   * @private
   */
  function _isBoolean(input) {
    return typeof input === "boolean";
  }

  return {
    verifySinglePropertyNotEmpty: _verifySinglePropertyValueNotEmpty,
    verifySingleProperty: _verifySingleProperty,
    verifyMultipleProperties: _verifyAllPropertyValuesNotEmpty,
    verifyAll: _verifyAllPropertyValuesOfAllObjectsNotEmpty,
    verifyArrayNotEmpty: _verifyArrayNotEmpty,
    isNumber: _isNumber,
    isString: _isString,
    isBoolean: _isBoolean
  };

}());
