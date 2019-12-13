let depId = 0
export default class Dep {
  constructor () {
      this.id = depId++
      this.subs = []
  }
  
  addSub (sub) {
      this.subs.push(sub)
  }
  
  depend () {
      if (Dep.target) {
          Dep.target.addDep(this)
      }
  }
  
  notify () {
      this.subs.forEach((sub) => {
          sub.update()
      })
  }
}
