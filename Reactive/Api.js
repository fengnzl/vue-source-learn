/**
 * vm.$watch(expOrFun, cb, [options]) 其返回一个unwatch函数用于取消响应式处理
 * options 里面有immediate 和deep两个属性
 * expOrFun 可以是一个表达式'a.b.c'也可以是个函数
 * 类似function() {
 *  return this.name + this.age;
 * }
 */
import { Watcher } from "./Watcher";
import { set } from './Observer'

Vue.prototype.$watch = function (expOrFun, cb, options) {
  const vm = this;
  const options = options || {};
  const watcher = new Watcher(vm, expOrFun, options);
  // 如果有immediate选项，则立即调用回调函数
  if (options.deep) {
    cb.call(vm, watcher.value);
  }
  return function unWatchFun () {
    // 取消观察数据，watcher实例从当前观察状态的依赖列表中移除
    watcher.teardown();
  }
}

/**
 * 参数：

{Object | Array} target
{string | number} propertyName/index
{any} value
返回值：设置的值。

向响应式对象中添加一个 property，并确保这个新 property 同样是响应式的，且触发视图更新。它必须用于向响应式对象上添加新 property，因为 Vue 无法探测普通的新增 property
 */
Vue.prototype.$set = set