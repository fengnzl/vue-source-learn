/**
 * Observer类会附加到每一个被侦测的object上，
 * 一旦附加上，那么Observer会将object的所有属性转换为getter/setter形式
 * 来收集属性的依赖，并当属性发生变化的时候通知这些依赖
 */
import Dep from './Dep';
import { def, hasProto, copyPrototype, augmentPrototype, isValidArrayIndex, hasOwn } from './utils';
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
  // 将变量转换成响应式
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

export function set (target, key, val) {
  // 如果是数组，则需要判断索引是否合法然后通过splice改变数据即可，因为我们已经劫持了其splice方法，可以将其转换成响应式
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.length = Math.max(target.length, key);
    target.splice(key, 1, val);
    return val;
  }

  // 如果已经存在对象中的属性则直接赋值即可
  if (key in target && !(key in Object.prototype)) {
    target[key] = val;
    return val;
  }

  const ob = target.__ob__;
  // 如果是Vue实例或者或者 Vue 实例的根数据对象则进行报错
  if (target._isVue || (ob && ob.vmCount)) {
    process.env.NODE_ENV !== 'production' && console.warn(
      `Avoid adding reactive properties to a Vue instance or its root $data at runtime - declare it upfront in the data option.`
    )
  }
  // 如果该对象不是响应式的则直接赋值
  if (!ob) {
    target[key] = val;
    return val;
  }

  // 将属性变成响应式
  defineReactive(target, key, val);
  // 通知依赖
  ob.dep.notify();
  return val;

}

export function del (target, key) {
  // 如果是数组，则需要判断索引是否合法然后通过splice删除数据即可，因为我们已经劫持了其splice方法，在数组数据改变的时候进行依赖通知
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.splice(key, 1);
    return;
  }
  // 如果不是target对象上的属性
  if (!hasOwn(target, key)) {
    return;
  }

  const ob = target.__ob__;
  // 如果是Vue实例或者或者 Vue 实例的根数据对象则进行报错
  if (target._isVue || (ob && ob.vmCount)) {
    process.env.NODE_ENV !== 'production' && console.warn(
      `Avoid deleting properties on a Vue instance or its root $data at runtime - just set it to null.`
    )
  }

  delete target[key];
  // 如果式响应式的数据
  if (ob) {
    // 通知依赖
    ob.dep.notify();
  }
}

