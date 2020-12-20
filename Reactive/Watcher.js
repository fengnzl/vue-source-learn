// 之前收集的依赖是window.target 但他究竟是什么，
// 即我们收集谁，对象的属性改变时，我们应该通知谁
// 这里可能是模板，也可能是用户写的watch，因此我们将他封装成一个类，通知也只需通知这个类，由她去负责通知其他地方
// watcher的一种比较经典的使用方式是
// vm.$watch('a.b.c',function(newVal, val) {})
// 这样就需要我们将Watcher添加到data.a.b.c的Dep中，然后值变化的时候通知watcher就行，watcher再执行回调函数
export class Watcher {
  constructor(vm, expOrFun, cb, options) {
    this.vm = vm;
    // 使用$watch函数的时候，是否添加了deep选项
    if (options) {
      this.deep = !!options.deep;
    } else {
      this.deep = false;
    }
    // 用来记录当前Watcher订阅了哪些Dep
    this.deps = [];
    this.depIds = new Set();

    if (typeof expOrFun === 'function') {
      // 如果expOrFun是一个函数，则直接赋予getter,不仅可以动态返回数据，还可以将读取的所有数据转换成响应式
      this.getter = expOrFun;
    } else {
      // 执行this.getter 函数即可获得a.b.c的值
      this.getter = parsePath(expOrFun);
    }
    this.cb = cb;
    this.value = this.get();
  }

  get () {
    // 将Watcher 实例挂载在window.target上
    window.target = this;
    // 读取data.a.b.c 的值，从而触发getter,将window.target 收集到依赖中
    const value = this.getter.call(this.vm, this.vm);
    // 如果$watch 设置了deep选项，则在取消挂载之前去触发子值的收集依赖逻辑
    if (this.deep) {
      traverse(value)
    }

    window.target = undefined;
    return value;
  }

  // 每当data.a.b.c 的值发生变化时，将依赖循环触发update方法，也就是Watcher中的update方法
  // 这时调用回调函数将oldValue和value作为参数
  update () {
    const oldValue = this.value;
    this.value = this.get();
    // 调用回调函数
    this.cb.call(this.vm, oldValue, this.value);
  }

  // 订阅Dep
  addDep (dep) {
    const depId = dep.id;
    // 如果没有订阅过则进行订阅
    if (!this.depIds.has(depId)) {
      this.depIds.add(depId);
      this.deps.push(dep);
      dep.addSub(this);
    }
  }

  // 取消当前Watcher的观察状态，即将当前实例订阅的Dep移除
  teardown () {
    const length = this.deps.length;
    while (length--) {
      this.deps[i].removeSub(this);
    }
  }
}


/**
 * 简单解析路径函数
 */
const bailRE = /[^\w.$]/ // 不匹配字母、数字、下划线、点号和$符号
function parsePath (path) {
  if (bailRE.test(path)) {
    return;
  }
  const segments = path.split('.');
  return function (obj) {
    segments.forEach(item => {
      if (!obj) return;
      obj = obj[item];
    })
    return obj;
  }
}