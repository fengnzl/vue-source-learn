// Dep类专门用来收集依赖、依赖通知及对依赖删除的管理
class Dep {
  constructor() {
    this.subs = [];
  }
  // 添加依赖
  depend () {
    if (window.target) {
      addSub(window.target);
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