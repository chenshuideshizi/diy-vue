(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.Vue = factory());
}(this, function () { 'use strict';

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

  var depId = 0;

  var Dep =
  /*#__PURE__*/
  function () {
    function Dep() {
      _classCallCheck(this, Dep);

      this.id = depId++;
      this.subs = [];
    }

    _createClass(Dep, [{
      key: "addSub",
      value: function addSub(sub) {
        this.subs.push(sub);
      }
    }, {
      key: "depend",
      value: function depend() {
        if (Dep.target) {
          Dep.target.addDep(this);
        }
      }
    }, {
      key: "notify",
      value: function notify() {
        this.subs.forEach(function (sub) {
          sub.update();
        });
      }
    }]);

    return Dep;
  }();

  function defineReactive(obj, key, val) {
    var dep = new Dep();
    Object.defineProperty(obj, key, {
      configurable: true,
      enumerable: true,
      get: function reactiveGetter() {
        if (Dep.target) {
          dep.depend();
        }

        return val;
      },
      set: function reactiveSetter(newVal) {
        if (newVal === val) {
          return;
        }

        val = newVal;
        dep.notify();
      }
    });
  }

  function Observer(value) {
    Object.keys(value).forEach(function (key) {
      defineReactive(value, key, value[key]);
    });
  }

  var Watcher =
  /*#__PURE__*/
  function () {
    function Watcher(vm, expOrFn, cb, options) {
      _classCallCheck(this, Watcher);

      this.vm = vm;

      if (typeof expOrFn === 'function') {
        this.getter = expOrFn;
      } else {
        this.getter = function (vm) {
          return vm[expOrFn];
        };
      }

      this.cb = cb;
      this.deps = [];
      this.depIds = [];

      if (options) {
        this.lazy = options.lazy; // 计算属性
      }

      this.dirty = this.lazy;
      this.value = this.lazy ? undefined : this.get();
    }

    _createClass(Watcher, [{
      key: "get",
      value: function get() {
        Dep.target = this;
        var vm = this.vm;
        var val = this.getter.call(vm, vm);
        Dep.target = null;
        return val;
      }
    }, {
      key: "addDep",
      value: function addDep(dep) {
        var depId = dep.id;

        if (!this.depIds.includes(depId)) {
          this.deps.push(dep);
          this.depIds.push(depId);
          dep.addSub(this);
        }
      }
    }, {
      key: "depend",
      value: function depend() {
        var i = this.deps.length;

        while (i--) {
          this.deps[i].depend();
        }
      }
    }, {
      key: "evaluate",
      value: function evaluate() {
        this.value = this.get();
        this.dirty = false;
      }
    }, {
      key: "run",
      value: function run() {
        var value = this.get();
        var oldValue = this.value;
        this.value = value;
        this.cb.call(this.vm, value, oldValue);
      }
    }, {
      key: "update",
      value: function update() {
        if (this.lazy) {
          this.dirty = true;
        } else if (this.sync) ; else {
          console.log(this);
          this.run(); // queueWatcher(this)
        }
      }
    }]);

    return Watcher;
  }();

  var Vue =
  /*#__PURE__*/
  function () {
    function Vue(options) {
      var _this = this;

      _classCallCheck(this, Vue);

      var vm = this;
      this.$el = document.querySelector(options.el);
      this.$options = options;
      this._data = options.data;
      this._watchers = [];

      if (options.data) {
        Object.keys(options.data).forEach(function (k) {
          Object.defineProperty(_this, k, {
            configuragle: true,
            enumerable: true,
            set: function proxySetter(val) {
              this._data[k] = val;
            },
            get: function proxyGetter() {
              return this._data[k];
            }
          });
        });
      }

      if (options.data) {
        var data = options.data;
        Observer(data);
      }

      if (options.computed) {
        var computed = options.computed;
        vm._computedWatchers = {};
        Object.keys(computed).forEach(function (key) {
          var getter = computed[key];
          var watcher = vm._computedWatchers[key] = new Watcher(vm, getter, function () {}, {
            lazy: true
          });

          vm._watchers.push(watcher);

          Object.defineProperty(vm, key, {
            configurable: true,
            enumerable: true,
            set: function set() {},
            get: function get() {
              if (watcher.dirty) {
                watcher.evaluate();
              }

              console.log(watcher);

              if (Dep.target) {
                watcher.depend();
              }

              return watcher.value;
            }
          });
        });
      }

      if (options.watch) {
        var watch = options.watch;
        Object.keys(watch).forEach(function (key) {
          vm.$watch(key, watch[key]);
        });
      }
    }

    _createClass(Vue, [{
      key: "$watch",
      value: function $watch(expOrFn, cb) {
        var vm = this;
        var watcher = new Watcher(vm, expOrFn, cb, {
          user: true
        });

        vm._watchers.push(watcher);
      }
    }]);

    return Vue;
  }();

  return Vue;

}));
