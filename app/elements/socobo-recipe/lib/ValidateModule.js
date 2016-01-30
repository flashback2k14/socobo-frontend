var ValidateModule = ValidateModule || (function () {

    'use strict';

    function _verifySinglePropertyValueNotEmpty(obj, property) {
      return (!obj[property]) ? false : true;
    }

    function _verifySingleProperty(obj, property, type){
      var valid;
      valid = _verifySinglePropertyValueNotEmpty(obj, property);
      if (type && valid) {
        valid = (typeof obj[property]) === type;
      }
      return valid;
    }

    function _verifyAllPropertyValuesNotEmpty(obj, propertiesArray) {
      var invalidProperties = [], prop, valid;
      for (prop in propertiesArray) {
        valid = _verifySingleProperty(obj, propertiesArray[prop].value, propertiesArray[prop].type);
        if (!valid) {
          invalidProperties.push(propertiesArray[prop].value);
        }
      }
      return invalidProperties;
    }

    function _verifyAllPropertyValuesOfAllObjectsNotEmpty(objArray, propertiesArray) {
      var invalidProperties = [], objProp, tmp;

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

    function _verifyArrayNotEmpty(arr) {
      return arr.length > 0;
    }
    function _isNumber(input) {
      return typeof parseInt(input) === "number";
    }
    function _isString(input) {
      return typeof input === "string";
    }
    function _isBoolean(input) {
      return typeof input === "boolean";
    }

    return {
      verifySinglePropertyNotEmpty: _verifySinglePropertyValueNotEmpty,
      verifySingleProperty: _verifySingleProperty,
      verifyMultipleProperties: _verifyAllPropertyValuesNotEmpty,
      verifyAll: _verifyAllPropertyValuesOfAllObjectsNotEmpty,
      verifyArrayNotEmpty : _verifyArrayNotEmpty,
      isNumber: _isNumber,
      isString: _isString,
      isBoolean: _isBoolean

    };

  }());
