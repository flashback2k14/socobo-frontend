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
    // global refs for register
    var _refInventory = new Firebase(_inventoryRoute);
    var _refRecipes = new Firebase(_recipeRoute);
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
        _refInventory.once("value", function(snapshot) {
          snapshot.forEach(function(item) {
            inventoryItems.push(item.val());
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
        _refRecipes.orderByChild("userId").startAt(_userId).once("value", function(snapshot) {
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
     * Workaround for tracking changes in inventory items and recipes
     * @param context
     */
    var registerChangedListener = function(context) {
      // inventory
      _refInventory.on("child_added", function(snapshot) { context.fire("ranking_inventory_item_changed"); }, function(err) { context.fire("ranking_inventory_error", err.message); });
      _refInventory.on("child_changed", function(snapshot) { context.fire("ranking_inventory_item_changed"); }, function(err) { context.fire("ranking_inventory_error", err.message); });
      _refInventory.on("child_removed", function(snapshot) { context.fire("ranking_inventory_item_changed"); }, function(err) { context.fire("ranking_inventory_error", err.message); });
      // recipes
      _refRecipes.on("child_added", function(snapshot) { context.fire("ranking_recipes_item_changed"); }, function(err) { context.fire("ranking_recipes_error", err.message); });
      _refRecipes.on("child_changed", function(snapshot) { context.fire("ranking_recipes_item_changed"); }, function(err) { context.fire("ranking_recipes_error", err.message); });
      _refRecipes.on("child_removed", function(snapshot) { context.fire("ranking_recipes_item_changed"); }, function(err) { context.fire("ranking_recipes_error", err.message); });
    };
    /**
     * Public API
     */
    return {
      getData : getData,
      registerChangedListener : registerChangedListener
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
