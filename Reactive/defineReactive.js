// 设置对象的getter和setter,从而进行依赖收集和触发依赖
// 这里先假设依赖是一个函数保存到window.target中，
// 那么我们就需要将器保存到每个键值的收集数组中
// 通过Dep类来进行依赖收集相关处理
import Dep from './Dep';

function defineReactive (obj, key, val) {
  let dep = new Dep();
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get () {
      // 依赖收集
      dep.depend();
      return val;
    },
    set (newVal) {
      if (val === newVal) {
        return;
      }
      // 触发依赖
      dep.notify();
      val = newVal;
    }
  })
}