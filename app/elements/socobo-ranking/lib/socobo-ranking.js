var SocoboRanking = (function() {
  /**
   * Singleton Instance
   */
  var instance;
  /**
   * Init Functions
   * @param userId
   * @returns {{}}
   * @private
   */
  var _init = function(userId) {

    var _uId = userId;


    /**
     * Public API
     */
    return {


    }
  };

  return {
    /**
     * Get Singleton Instance
     * @param userId
     * @returns {Object}
     */
    getInstance: function(userId) {
      if (!instance) {
        instance = _init(userId);
      }
      return instance;
    }
  }
})();
