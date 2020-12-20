// Dep类专门用来收集依赖、依赖通知及对依赖删除的管理
// Watcher 和 Dep 其实是一种多对多的形式，如果Watcher中的expOrfun 是一个函数，如下所示
// function() {return this.name + this.age; }
// 那么Watcher内部收集两个Dep name和age的，同时这两个Dep也会收集Wacher，从而其中某一个数据发生变化都会进行通知
let uid = 0;
class Dep {
  constructor() {
    this.subs = [];
    // 当前Dep实例的ID，用于在Watcher中判断当前Dep是否订阅过
    this.id = uid++;
  }
  // 添加依赖
  depend () {
    // 判断Watcher实例是否存在 存在则在Watcher中订阅Dep的同时  Dep添加依赖
    if (window.target) {
      window.target.addDep(this);
    }
  }

  addSub (sub) {
    this.subs.push(sub);
  }

  // 删除依赖
  removeSub (sub) {
    remove(this.subs, sub);
  }

  // 依赖通知
  notify () {
    // 复制当前的依赖，防止进行依赖通知的时候有相应改动
    const subs = this.subs.slice();
    subs.forEach(sub => sub.update());
  }

}

function remove (arr, item) {
  if (arr.length) {
    const index = arr.indexOf(item);
    if (index !== -1) {
      return arr.splice(index, 1);
    }
  }
}