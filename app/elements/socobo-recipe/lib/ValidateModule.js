var ValidateModule = ValidateModule || (function(){

    var msgPrefix = "", errorMessages = [];

    function _setMessagePrefix(prefix){
      msgPrefix = prefix;
    }

    function _verifySinglePropertyValueNotEmpty(obj, property){
      return obj[property] !== "" && obj[property] !== undefined && obj[property] != null;
    }

    function _verifyArrayNotEmpty(arr){
      return arr.length > 0;
    }

    function _addSingleEntryToErrorMsg(snippet){
      errorMessages.push(snippet);
    }

    function _addMultipleEntriesToErrorMsg(context, snippets){
      errorMessages.push({
        context : context,
        snippets :  snippets
      });
    }

    function _buildErrorMessage(messages){
      var msg;
      if (_verifyArrayNotEmpty(messages)) {
        msg = msgPrefix;
        messages.forEach(function(messagePart){
          if(_isObject(messagePart)){
            msg += messagePart.context + "("
            if(_verifyArrayNotEmpty(messagePart.snippets)){
              var subMsg = ""
              messagePart.snippets.forEach(function(snippet){
                subMsg += snippet + ", "
              });
              subMsg = subMsg.slice(0, subMsg.length - 2);
              msg += subMsg + "), "
            }
          }else{
            msg += element + ", ";
          }
          });
        msg = msg.slice(0, msg.length - 2);
      }
    }

    /**
     * Checks if a given parameter is an object
     * @param o
     * @returns {boolean}
     * @private
     */
    function _isObject(o) {
      return o !== null && typeof o === "object";
    }

    function _verifyAllPropertyValuesNotEmpty(arrLikeObj, propertiesArray){
      var invalidProperties = [];
      Array.prototype.forEach.call(arrLikeObj, function(currentOjb){
        Array.prototype.forEach.call(propertiesArray, function(currentProperty){
          var valid = _verifySinglePropertyValueNotEmpty(currentOjb, currentProperty);
          if(!valid){
            invalidProperties.push(currentProperty);
          }
        });
      });
      return invalidProperties;
    }



  })();
