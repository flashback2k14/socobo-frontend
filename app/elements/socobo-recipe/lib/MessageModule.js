MessageModule = (function(){

  var msgPrefix, errorMessages;

  function MessageModule(){
    msgPrefix = "";
    errorMessages = [];
  }

  function _setMessagePrefix(prefix){
    msgPrefix = prefix;
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

  function _buildErrorMessage(){
    var msg;
    if (_verifyArrayNotEmpty(errorMessages)) {
      msg = msgPrefix;
      errorMessages.forEach(function(messagePart){
        if(_isObject(messagePart)){
          msg += messagePart.context + "(";
          if(_verifyArrayNotEmpty(messagePart.snippets)){
            var subMsg = "";
            messagePart.snippets.forEach(function(snippet){
              subMsg += snippet + ", "
            });
            subMsg = subMsg.slice(0, subMsg.length - 2);
            msg += subMsg + "), "
          }
        }else{
          msg += messagePart + ", ";
        }
      });
      msg = msg.slice(0, msg.length - 2);
    }
    return msg;
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

  function _verifyArrayNotEmpty(arr){
    return arr.length > 0;
  }

  MessageModule.prototype.addMsgPart = _addSingleEntryToErrorMsg;
  MessageModule.prototype.addMsgParts = _addMultipleEntriesToErrorMsg;
  MessageModule.prototype.buildMsg = _buildErrorMessage;
  MessageModule.prototype.setPrefix = _setMessagePrefix;

  return MessageModule;

})();


