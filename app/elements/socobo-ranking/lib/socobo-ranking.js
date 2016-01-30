/* exported SocoboRanking */
var SocoboRanking = (function() {
  /**
   * Singleton Instance
   */
  var instance;
  /**
   * Singleton Public Functions
   *
   * @param {Object} userLogin
   * @returns {{
   *  getData: getData,
   *  registerChangedListener: registerChangedListener
   * }}
   * @private
   */
  var _init = function(userLogin) {
    /**
     * Private Variables
     *
     * @type {String|String|String|String|Object|Object}
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
     * Get Data from Inventory
     *
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
     *
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
     * Fire Event if inventory item changed
     * this is context from registerChangedListener
     *
     * @private
     */
    var _onCompleteInventory = function() {
      this.fire("ranking_inventory_item_changed");
    };
    /**
     * Fire Event if recipe item changed
     * this is context from registerChangedListener
     *
     * @private
     */
    var _onCompleteRecipe = function() {
      this.fire("ranking_recipes_item_changed");
    };
    /**
     * Fire Event if inventory or recipe throws an error
     * this is context from registerChangedListener
     *
     * @private
     */
    var _onError = function(err) {
      this.fire("ranking_changed_error", err);
    };
    /**
     * tracking changes in inventory items and recipes
     *
     * @param {Object} context
     */
    var registerChangedListener = function(context) {
      // inventory
      _refInventory.on("child_added", _onCompleteInventory, _onError, context);
      _refInventory.on("child_changed", _onCompleteInventory, _onError, context);
      _refInventory.on("child_removed", _onCompleteInventory, _onError, context);
      // recipes
      _refRecipes.on("child_added", _onCompleteRecipe, _onError, context);
      _refRecipes.on("child_changed", _onCompleteRecipe, _onError, context);
      _refRecipes.on("child_removed", _onCompleteRecipe, _onError, context);
    };
    /**
     * Public API
     */
    return {
      getData: getData,
      registerChangedListener: registerChangedListener
    };
  };
  /**
   * Get Singleton Instance
   */
  return {
    /**
     * Get Singleton Instance
     *
     * @param {Object} userLogin
     * @returns {Object}
     */
    getInstance: function(userLogin) {
      if (!instance) {
        instance = _init(userLogin);
      }
      return instance;
    }
  };
})();
