/* exported RecipeDao */
var RecipeDao = (function() {
  /**
   * Instance stores a reference to the Singleton
   */
  var instance;

  /**
   * Public API
   *
   * @param {Object} user
   * @returns {{add: add, update: update, remove: remove, getAll: getAll}}
   */
  function init(user) {

    /**
     * Private Variables
     *
     * @type {String|String}
     * @private
     */
    var _baseUrl = user.firebaseUrl;
    var _id = user.userId;

    /**
     * Get Global Recipes URL
     *
     * @returns {string}
     * @private
     */
    var _getGlobalRecipesUrl = function() {
      return _baseUrl + "recipes/";
    };

    /**
     * Get User Recipes URL
     *
     * @returns {string}
     * @private
     */
    var _getUserRecipesUrl = function() {
      return _baseUrl + "users/" + _id + "/recipes";
    };
    /**
     * Get measurements url
     *
     * @returns {string}
     * @private
     */
    var _getGlobalMeasurementsUrl = function() {
      return _baseUrl + "measurements/";
    };
    /**
     * Private Variables
     *
     * @type {String|String|String}
     * @private
     */
    var _recipesUrl = _getGlobalRecipesUrl();
    var _measurementsUrl = _getGlobalMeasurementsUrl();
    var _userUrl = _getUserRecipesUrl();

    /**
     * Check Object contains Property
     *
     * @param {Object} obj
     * @param {String} propName
     * @returns {boolean}
     * @private
     */
    var _checkProperty = function(obj, propName) {
      return obj.hasOwnProperty(propName);
    };

    /**
     * Fill Array withh Properties
     *
     * @param {Object} source
     * @param {Object} dest
     * @param {String} arrProp
     * @private
     */
    var _fillArrayProperty = function(source, dest, arrProp) {
      if (_checkProperty(dest, arrProp)) {
        for (var j in source[arrProp]) {
          if (_checkProperty(source[arrProp], j)) {
            (dest[arrProp]).push(source[arrProp][j]);
          }
        }
      }
    };

    /**
     * Add Recipe on DB
     *
     * @param {Object} obj
     * @returns {Promise}
     */
    var add = function(obj) {
      return new Promise(function(resolve, reject) {
        // set author to recipe object
        obj.userId = _id;
        // #1 save recipe under /recipes
        var dataGlobalRef = new Firebase(_recipesUrl);
        var recipeRef = dataGlobalRef.push(obj, function(error) {
          if (error) {
            reject({value: "Sorry a technical error occured while creating your recipe :("});
          } else {
            // #2 Get Ref Id from current saved recipe
            var recipeId = recipeRef.key();
            // #3 Save recipe ref id to /users/recipes
            var dataRef = new Firebase(_userUrl);
            dataRef.push({id: recipeId}, function(error) {
              if (error) {
                reject({value: "Sorry a technical error occured while saving your recipe :("});
              } else {
                resolve({value: "Element successfully saved!"});
              }
            });
          }
        });
      });
    };

    /**
     * Update Recipe on DB
     *
     * @param {Object} obj
     * @returns {Promise}
     */
    var update = function(obj) {
      // convert ref path to string
      var reference = obj.ref.toString();
      //
      var newObj = {};
      for (var e in obj) {
        if (e !== "ref" && e !== "info") {
          if (_checkProperty(obj, e)) {
            newObj[e] = obj[e];
          }
        }
      }
      // set author to recipe object
      newObj.userId = _id;
      //
      return new Promise(function(resolve, reject) {
        var dataRef = new Firebase(reference);
        dataRef.set(newObj, function(error) {
          if (error) {
            reject({value: "Sorry a technical error occured while updating your recipe :("});
          } else {
            resolve({value: "Element successfully updated!"});
          }
        });
      });
    };

    /**
     * Remove Recipe on DB
     *
     * @param {Object} obj
     * @returns {Promise}
     */
    var remove = function(obj)  {
      return new Promise(function(resolve, reject) {
        var dataRef = new Firebase(obj.ref.toString());
        var userRef = new Firebase(obj.refUser);
        var counter = 0;
        var onComplete = function(error) {
          if (error) {
            reject({value: "Sorry a technical error occured while deleting your recipe :("});
          } else {
            if (counter !== 1) {
              counter++;
            } else {
              resolve({value: "Element successfully removed!", item: obj});
            }
          }
        };
        dataRef.remove(onComplete);
        userRef.remove(onComplete);
      });
    };

    /**
     * Get Recipe Ids from /user/recipes
     *
     * @returns {Promise}
     * @private
     */
    var _getRecipesIds = function() {
      return new Promise(function(resolve, reject) {
        var idKeys = [];
        var ids = [];
        var dataRef = new Firebase(_userUrl);
        dataRef.once("value", function(snapshot) {
          snapshot.forEach(function(item) {
            idKeys.push(item.key());
            ids.push(item.val().id);
          });
          resolve({keys: idKeys, value: ids});
        }, function(err) {
          reject({value: err.message});
        });
      });
    };

    /**
     * Get specific Recipe from /recipes with id
     *
     * @param {String} key
     * @param {String} id
     * @returns {Promise}
     * @private
     */
    var _getRecipe = function(key, id) {
      return new Promise(function(resolve, reject) {
        var ref = new Firebase(_recipesUrl + "/" + id);
        ref.once("value", function(snapshot) {
          // recipe item from firebase
          var item = snapshot.val();
          // init recipe object
          var recipe = {};
          // fill recipe object with data
          recipe.ref = snapshot.ref().toString();
          recipe.refUser = _userUrl + "/" + key;
          recipe.desc = item.desc;
          recipe.info = item.info;
          recipe.image = item.image;
          recipe.ingredients = [];
          recipe.steps = [];
          recipe.text = item.text;
          _fillArrayProperty(item, recipe, "ingredients");
          _fillArrayProperty(item, recipe, "steps");
          // return recipe object
          resolve(recipe);
        }, function(err) {
          reject(err.message);
        });
      });
    };

    /**
     * Get all Recipes from /recipes with ids
     *
     * @param {Array} keys
     * @param {Array} ids
     * @returns {Promise}
     * @private
     */
    var _getRecipes = function(keys, ids) {
      return new Promise(function(resolve, reject) {
        // Promise Holder
        var recipePromise = [];
        // iterate over all recipe ids and get the recipe
        ids.forEach(function(id, index) {
          recipePromise.push(_getRecipe(keys[index], id));
        });
        // bundle all promise values to one promise
        Promise.all(recipePromise)
          .then(function(recipes) {
            resolve(recipes);
          })
          .catch(function(error) {
            reject(error.message);
          });
      });
    };

    /**
     * Get All Recipes from DB
     *
     * @returns {Promise}
     */
    var getAll = function() {
      return new Promise(function(resolve, reject) {
        _getRecipesIds()
          .then(function(ids) {
            _getRecipes(ids.keys, ids.value)
              .then(function(recipes) {
                resolve({value: recipes});
              });
          })
          .catch(function(error) {
            reject({value: "Sorry a technical error occured while fetching your recipes. " + error.value});
          });
      });
    };
    /**
     * Gets all measurements from the database
     *
     * @returns {Promise}
     */
    var getMeasurements = function() {
      return new Promise(function(resolve, reject) {
        var ref = new Firebase(_measurementsUrl);
        ref.once("value",function(data) {
          resolve(data.val());
        },function(error) {
          reject(error.message);
        });
      });
    };

    /**
     * Public Functions
     */
    return {
      add: add,
      update: update,
      remove: remove,
      getMeasurements: getMeasurements,
      getAll: getAll
    };
  }

  return {
    /**
     * Get the Singleton instance if one exist or create one if it doesn't
     *
     * @param {Object} user
     * @returns {Object}
     */
    getInstance: function(user) {
      if (!instance) {
        instance = init(user);
      }
      return instance;
    }
  };
})();
