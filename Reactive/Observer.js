/**
 * Observer类会附加到每一个被侦测的object上，
 * 一旦附加上，那么Observer会将object的所有属性转换为getter/setter形式
 * 来收集属性的依赖，并当属性发生变化的时候通知这些依赖
 */
import Dep from './Dep';
class Observer {
  constructor(value) {
    this.value = value;

    // 如果是对象，而不是数组
    if (!Array.isArray(value)) {
      this.walk(value);
    }
  }

  /**
   * walk方法将对象每个属性转换为getter/setter形式
   */
  walk (value) {
    for (let i in value) {
      defineReactive(value, i, value[i]);
    }
  }
}

function defineReactive (obj, key, val) {
  // 递归子属性，将子对象属性转换为getter和setter
  if (typeof val === 'object') {
    new Observer(val);
  }
  const dep = new Dep();
  Object.defineProperty(obj, key, {
    configurable: true,
    enumerable: true,
    get () {
      // 收集依赖
      dep.depend();
      return val;
    },
    set (newVal) {
      if (val === newVal) return;
      val = newVal;
      // 触发依赖
      dep.notify();
    }
  })
}