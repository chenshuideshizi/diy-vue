import Dep from './dep'

export default class Watcher {
  constructor (vm, expOrFn, cb, options) {
      this.vm = vm

      if (typeof expOrFn === 'function') {
        this.getter = expOrFn
      } else {
        this.getter = function (vm) {
          return vm[expOrFn]
        }
      }
      this.cb = cb
      
      this.deps = []
      this.depIds = []
      
      if (options) {
          this.lazy = options.lazy // 计算属性
      }

      this.dirty = this.lazy
      
      this.value = this.lazy ? undefined : this.get()
  }
  
  get () {
      Dep.target = this
      const vm = this.vm
      let val = this.getter.call(vm, vm)
      Dep.target = null
      
      return val
  }
  
  addDep (dep) {
      let depId = dep.id
      if (!this.depIds.includes(depId)) {
          this.deps.push(dep)
          this.depIds.push(depId)
          dep.addSub(this)
      }
  }
  
  depend () {
      let i = this.deps.length
      while (i--) {
        this.deps[i].depend()
      }
  }
  
  evaluate () {
      this.value = this.get()
      this.dirty = false
  }

  run () {
    const value = this.get()
    const oldValue = this.value
    this.value = value
    this.cb.call(this.vm, value, oldValue)
  }
  
  update () {
      if (this.lazy) {
        this.dirty = true
      } else if (this.sync) {
        // this.run()
      } else {
        console.log(this)
        this.run()
        // queueWatcher(this)
      }
  }
}