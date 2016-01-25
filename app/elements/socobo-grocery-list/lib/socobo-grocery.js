var SocoboGrocery = (function() {
  /**
   * Singleton Instance
   */
  var instance;
  /**
   * Init Functions
   *
   * @param context
   * @param userLogin
   * @returns {{}}
   * @private
   */
  var _init = function(context, userLogin) {
    // get element
    var _ctx = context;
    // set login data
    var _baseUrl = userLogin.firebaseUrl;
    var _userId = userLogin.userId;
    /**
     * Create Grocery Firebase Path
     * @param section
     * @returns {string}
     * @private
     * @method _getGroceryItemPath
     */
    var _getGroceryItemPath = function (section) {
      return _baseUrl + "grocery/" + _userId + section
    };
    // specify routes
    var _activeItemsRoute = _getGroceryItemPath("/active");
    var _archiveItemsRoute = _getGroceryItemPath("/archive");
    // declare Firebase refs
    var _refActive = new Firebase(_activeItemsRoute);
    var _refArchive = new Firebase(_archiveItemsRoute);

    /**
     * Handle Errors for changed items
     * @param error
     * @private
     * @method _onErrorActive
     */
    var _onError = function(err) {
      if (err) {
        _ctx.fire("grocery-changed-error", err);
      }
    };

    /**
     * Register Changed Listener for active and archive Items
     * @method registerGroceryItemListeners
     */
    var registerGroceryItemListeners = function() {
      _registerGroceryActiveListeners();
      _registerGroceryArchiveListeners();
    };
    /**
     * Register Changed Listener for active Items
     * @private
     * @method _registerGroceryActiveListeners
     */
    var _registerGroceryActiveListeners = function() {
      _refActive.on("child_added", function(snapshot) {
        _ctx.fire("grocery-active-item-added", {key: snapshot.key(), desc: snapshot.val().desc});
      }, _onError);
      _refActive.on("child_removed", function(snapshot) {
        _ctx.fire("grocery-active-item-removed", {key: snapshot.key(), desc: snapshot.val().desc});
      }, _onError);
    };
    /**
     * Register Changed Listener for archive Items
     * @private
     * @method _registerGroceryArchiveListeners
     */
    var _registerGroceryArchiveListeners = function() {
      _refArchive.on("child_added", function(snapshot) {
        _ctx.fire("grocery-archive-item-added", {key: snapshot.key(), desc: snapshot.val().desc});
      }, _onError);
    };
    /**
     * Add Item to active List
     * @param item
     * @method addItemToActiveList
     */
    var addItemToActiveList = function(item) {
      _refActive.push(item, _onError);
    };
    /**
     * Remove Item from active List
     * @param item
     * @method removeItemFromActiveList
     */
    var removeItemFromActiveList = function(item) {
      var removePath = new Firebase(_activeItemsRoute + "/" + item.key);
      removePath.remove();
    };
    /**
     * Add Item to archive List
     * @param item
     * @method addItemToArchiveList
     */
    var addItemToArchiveList = function(item) {
      _refArchive.push(item, _onError);
    };
    /**
     * Remove Item from archive List
     * @param item
     * @method removeItemFromArchiveList
     */
    var removeItemFromArchiveList = function(item) {
      var removePath = new Firebase(_archiveItemsRoute + "/" + item.key);
      removePath.remove();
    };

    /**
     * Public API
     */
    return {
      registerGroceryItemListeners  : registerGroceryItemListeners,
      addItemToActiveList           : addItemToActiveList,
      removeItemFromActiveList      : removeItemFromActiveList,
      addItemToArchiveList          : addItemToArchiveList,
      removeItemFromArchiveList     : removeItemFromArchiveList
    }
  };

  return {
    /**
     * Get Singleton Instance
     * @param context
     * @param userLogin
     * @returns {Object}
     */
    getInstance: function(context, userLogin) {
      if (!instance) {
        instance = _init(context, userLogin);
      }
      return instance;
    }
  }
})();
