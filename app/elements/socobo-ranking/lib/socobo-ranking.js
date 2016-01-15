var SocoboRanking = (function() {
  /**
   * Singleton Instance
   */
  var instance;
  /**
   * Singleton Public Functions
   * @param userLogin
   * @returns {{getData: getData}}
   * @private
   */
  var _init = function(userLogin) {
    /**
     * Private Variables
     * @type {string|string|string|string}
     * @private
     */
    var _baseUrl = userLogin.firebaseUrl;
    var _userId = userLogin.userId;
    var _inventoryRoute = _baseUrl + "inventory/" + _userId;
    var _recipeRoute = _baseUrl + "recipes";
    /**
     * Public Get Data Function
     */
    var getData = function() {
      return new Promise(function(resolve, reject) {
        var dataPromises = [];
        // collect promises
        dataPromises.push(_getDataFromInventory());
        dataPromises.push(_getDataFromRecipe());
        // resolve / reject promises
        Promise.all(dataPromises)
          .then(function(data) {
            resolve(data);
          })
          .catch(function(err) {
            reject(err);
          });
      });
    };
    /**
     * Get Data from Inventory
     * @returns {Promise}
     * @private
     */
    var _getDataFromInventory = function() {
      return new Promise(function(resolve, reject) {
        var inventoryItems = [];
        var ref = new Firebase(_inventoryRoute);
        ref.on("value", function(snapshot) {
          snapshot.forEach(function(item) {
            var invItem = {
              id   : item.key(),
              name : item.val().name
            };
            inventoryItems.push(invItem);
          });
          resolve(inventoryItems);
        }, function(err) {
          reject(err);
        });
      });
    };
    /**
     * Get Data from Recipes (only for specific user)
     * @returns {Promise}
     * @private
     */
    var _getDataFromRecipe = function() {
      return new Promise(function(resolve, reject) {
        var recipeItems = [];
        var ref = new Firebase(_recipeRoute);
        ref.orderByChild("userId").startAt(_userId).on("value", function(snapshot) {
          snapshot.forEach(function(item) {
            var recItem = item.val();
            recItem.id = item.key();
            recipeItems.push(recItem);
          });
          resolve(recipeItems);
        }, function(err) {
          reject(err);
        });
      });
    };
    /**
     * Public API
     */
    return {
      getData : getData
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
