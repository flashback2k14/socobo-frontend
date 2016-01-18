var SocoboGrocery = (function() {
  /**
   * Singleton Instance
   */
  var instance;
  /**
   * Init Functions
   * @param userLogin
   * @returns {{}}
   * @private
   */
  var _init = function(userLogin) {

    var _baseUrl = userLogin.firebaseUrl;
    var _userId = userLogin.userId;


    /**
     * Public API
     */
    return {


    }
  };

  return {
    /**
     * Get Singleton Instance
     * @param userLogin
     * @returns {Object}
     */
    getInstance: function(userLogin) {
      if (!instance) {
        instance = _init(userLogin);
      }
      return instance;
    }
  }
})();
