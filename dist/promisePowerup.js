(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.promisePowerup = {}));
}(this, function (exports) { 'use strict';

  function _typeof(obj) {
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  function isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;

    try {
      Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
      return true;
    } catch (e) {
      return false;
    }
  }

  function _construct(Parent, args, Class) {
    if (isNativeReflectConstruct()) {
      _construct = Reflect.construct;
    } else {
      _construct = function _construct(Parent, args, Class) {
        var a = [null];
        a.push.apply(a, args);
        var Constructor = Function.bind.apply(Parent, a);
        var instance = new Constructor();
        if (Class) _setPrototypeOf(instance, Class.prototype);
        return instance;
      };
    }

    return _construct.apply(null, arguments);
  }

  function _isNativeFunction(fn) {
    return Function.toString.call(fn).indexOf("[native code]") !== -1;
  }

  function _wrapNativeSuper(Class) {
    var _cache = typeof Map === "function" ? new Map() : undefined;

    _wrapNativeSuper = function _wrapNativeSuper(Class) {
      if (Class === null || !_isNativeFunction(Class)) return Class;

      if (typeof Class !== "function") {
        throw new TypeError("Super expression must either be null or a function");
      }

      if (typeof _cache !== "undefined") {
        if (_cache.has(Class)) return _cache.get(Class);

        _cache.set(Class, Wrapper);
      }

      function Wrapper() {
        return _construct(Class, arguments, _getPrototypeOf(this).constructor);
      }

      Wrapper.prototype = Object.create(Class.prototype, {
        constructor: {
          value: Wrapper,
          enumerable: false,
          writable: true,
          configurable: true
        }
      });
      return _setPrototypeOf(Wrapper, Class);
    };

    return _wrapNativeSuper(Class);
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _possibleConstructorReturn(self, call) {
    if (call && (typeof call === "object" || typeof call === "function")) {
      return call;
    }

    return _assertThisInitialized(self);
  }

  /**
   * @classdesc Adds the ability to give a promise a name so it can be waited on without passing stuff around or keeping it in the global scope
   */
  var NamedPromise =
  /*#__PURE__*/
  function (_Promise) {
    _inherits(NamedPromise, _Promise);

    /**
     * Holds all the named promise info
     */

    /**
     * @param executor A callback used to initialize the promise. This callback is passed two arguments: a resolve callback used to resolve the promise with a value or the result of another promise, and a reject callback used to reject the promise with a provided reason or error.
     * @description Creates the promise part of the named promise
     */
    function NamedPromise(executor) {
      var _this;

      _classCallCheck(this, NamedPromise);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(NamedPromise).call(this, executor));

      _defineProperty(_assertThisInitialized(_this), "_name", void 0);

      _this._name = undefined;
      return _possibleConstructorReturn(_this);
    }
    /**
     * name of the promise
     */


    _createClass(NamedPromise, [{
      key: "name",
      get: function get() {
        return this._name;
      },
      set: function set(name) {
        // Check and normalize parameters
        if ('string' !== typeof name) {
          throw new Error('name must be a string');
        }

        if (NamedPromise.IsCreated(name)) {
          throw new Error('Promise with name ' + name + ' already exists');
        }

        this._name = name;

        if ('object' !== _typeof(NamedPromise.namedPromiseStore[name])) {
          NamedPromise.CreateNamedPromise(name);
        }

        NamedPromise.namedPromiseStore[name].namedPromiseCreated = true;
        this.then(function (result) {
          NamedPromise.namedPromiseStore[name].resolve(result);
          return;
        }).catch(function (err) {
          NamedPromise.namedPromiseStore[name].reject(err);
          return;
        });
        return;
      }
      /**
       * @param name name of the promise
       * @return the new named promise
       * @description Creates the internal structure for the named promise
       */

    }], [{
      key: "CreateNamedPromise",
      value: function CreateNamedPromise(name) {
        var tempObject = {};

        if ("object" === _typeof(NamedPromise.namedPromiseStore[name])) {
          throw new Error('Promise with name ' + name + ' already exists');
        }

        tempObject.promise = new Promise(function SettleNamedPromise(resolve, reject) {
          tempObject.resolve = resolve;
          tempObject.reject = reject;
          return;
        });
        tempObject.namedPromiseCreated = false;
        NamedPromise.namedPromiseStore[name] = tempObject;
        return NamedPromise.namedPromiseStore[name].promise;
      }
      /**
       * @param name name of the promise
       * @returns Returns the named promise
       * @description Gets a named promise even if it has not been created yet.
       */

    }, {
      key: "GetNamedPromise",
      value: function GetNamedPromise(name) {
        var tempPromise;
        /**
        	 * Check and normalize parameters
        	 */

        if ('string' !== typeof name) {
          throw new Error('Name is not a string. name = ' + JSON.stringify(name));
        }

        if ('object' !== _typeof(NamedPromise.namedPromiseStore[name])) {
          tempPromise = NamedPromise.CreateNamedPromise(name);
        } else {
          tempPromise = NamedPromise.namedPromiseStore[name].promise;
        }

        return tempPromise;
      }
      /**
       * @param name name of the promise
       * @returns True if the promise has been created else false
       * @description Tests if the named promise has been created
       */

    }, {
      key: "IsCreated",
      value: function IsCreated(name) {
        /**
         * Check and normalize parameters
         */
        if ('string' !== typeof name) {
          throw new Error('Name is not a string. name = ' + JSON.stringify(name));
        }

        if ('object' === _typeof(NamedPromise.namedPromiseStore[name]) && true === NamedPromise.namedPromiseStore[name].namedPromiseCreated) {
          return true;
        }

        return false;
      }
    }]);

    return NamedPromise;
  }(_wrapNativeSuper(Promise));

  _defineProperty(NamedPromise, "namedPromiseStore", {});

  exports.NamedPromise = NamedPromise;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=promisePowerup.js.map
