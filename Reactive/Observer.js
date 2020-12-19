/**
 * Observer类会附加到每一个被侦测的object上，
 * 一旦附加上，那么Observer会将object的所有属性转换为getter/setter形式
 * 来收集属性的依赖，并当属性发生变化的时候通知这些依赖
 */
import Dep from './Dep';
import { def, hasProto, copyPrototype, augmentPrototype } from './utils';
import { interceptArr } from './array'
class Observer {
  constructor(value) {
    this.value = value;
    // 将当前Observe的实例挂载到value上，从而可以在数组拦截器中访问从而触发依赖
    // 一方面 是标记数据是否被侦测了变化（一个数据只被侦测一次，转换响应式
    // 另一放面 通过数据获取__ob__，以得到Observe的实例上保存的依赖，从而拦截到数据变化的时候，通知依赖
    this.dep = new Dep();
    def(value, '__ob__', this);

    // 如果是对象，而不是数组
    if (!Array.isArray(value)) {
      this.walk(value);
    } else {
      // 如果是数组，则需要将数组的原型进行劫持，为兼容老版本，如果不能直接获取原型则将侦听的方法替换
      const augment = hasProto ? copyPrototype : augmentPrototype;
      const keys = Object.keys(value);
      augment(value, interceptArr, keys);
      // 将数组里面的元素都转换成响应式的
      this.observeArray(value)
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

  /**
   * 将数组中的元素转换为响应式
   */
  observeArray (array) {
    for (let i = 0; i < array.length; i++) {
      observe(array[i]);
    }
  }
}

function defineReactive (obj, key, val) {
  // 将
  const childOb = observe(obj);
  const dep = new Dep();
  Object.defineProperty(obj, key, {
    configurable: true,
    enumerable: true,
    get () {
      // 收集依赖
      dep.depend();
      if (childOb) {
        childOb.dep.depend();
      }
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

/**
 * 判断变量转换成响应式，如果不是响应式则转换成响应式
 * 判断对象是否存在__ob__属性，即是否式Observer的实例
 * 如果存在，则返回其Observer实例
 * 否则创建新的实例返回
 */
function observe (obj) {
  if (!isObject(obj)) return;
  if (hasOwn(obj, '__ob__' && obj instanceof Observe)) {
    return obj.__ob__
  } else {
    return new Observe(obj)
  }
}
