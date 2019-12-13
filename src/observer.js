import Dep from './dep'

function defineReactive (obj, key, val) {
  const dep = new Dep()
  Object.defineProperty(obj, key, {
      configurable: true,
      enumerable: true,
      get: function reactiveGetter () {
          if (Dep.target) {
              dep.depend()
          }
          return val
      },
      set: function reactiveSetter (newVal) {
          if (newVal === val) {
           return   
          }
          val = newVal
          dep.notify()
      }
  })
}

export default function Observer (value) {
  Object.keys(value).forEach(key => {
      defineReactive(value, key, value[key])
  })   
}

