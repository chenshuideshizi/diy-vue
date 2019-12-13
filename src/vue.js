import Observer from './observer'
import Watcher from './watcher'
import Dep from './dep'
class Vue {
  constructor (options) {
      const vm = this
      this.$el = document.querySelector(options.el)
      this.$options = options
      this._data = options.data
      this._watchers = []

      if (options.data) {
          Object.keys(options.data).forEach(k => {
              Object.defineProperty(this, k, {
                  configuragle: true,
                  enumerable: true,
                  set: function proxySetter (val) {
                      this._data[k] = val
                  },
                  get: function proxyGetter () {
                      return this._data[k]
                  }
              })
          })
      }
      
      if (options.data) {
          const data = options.data
          Observer(data)
      }
      
      if (options.computed) {
          const computed = options.computed
          vm._computedWatchers = {}

          Object.keys(computed).forEach(key => {
              let getter = computed[key]

              let watcher = vm._computedWatchers[key] = new Watcher(vm, getter, function () {}, {lazy: true})
                vm._watchers.push(watcher)  


              Object.defineProperty(vm, key, {
                  configurable: true,
                  enumerable: true,
                  set: function () {},
                  get: function () {
                      if (watcher.dirty) {
                          watcher.evaluate()
                      }
                      console.log(watcher)
                      
                      if (Dep.target) {
                          watcher.depend()    
                      }
                      
                      return watcher.value
                  }
              })
          })
          

          
      }
      
      if (options.watch) {
            const watch = options.watch
            Object.keys(watch).forEach(key => {
                vm.$watch( key, watch[key])
            })
      }
      
  }

  $watch (expOrFn, cb) {
    const vm = this
    const watcher = new Watcher(vm, expOrFn, cb, {user: true})
    vm._watchers.push(watcher)
}
}

export default Vue