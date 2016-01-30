var ValidateModule = ValidateModule || (function () {

    'use strict';

    function _verifySinglePropertyValueNotEmpty(obj, property) {
      return obj[property] !== "" && obj[property] !== undefined && obj[property] !== null;
    }

    function _verifyAllPropertyValuesNotEmpty(obj, propertiesArray) {
      var invalidProperties = [], prop, valid;
      for (prop in propertiesArray) {
        valid = _verifySinglePropertyValueNotEmpty(obj, propertiesArray[prop]);
        if (!valid) {
          invalidProperties.push(propertiesArray[prop]);
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

    return {
      verifySingleProperty : _verifySinglePropertyValueNotEmpty,
      verifyMultipleProperties : _verifyAllPropertyValuesNotEmpty,
      verifyAll : _verifyAllPropertyValuesOfAllObjectsNotEmpty,
      verifyArrayNotEmpty : _verifyArrayNotEmpty
    };

  }());
