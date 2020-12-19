// 劫持数组的七种方法，从而可以在通过这几种方法更改数组时通知依赖
const arrayProto = Array.prototype

const interceptArr = Object.create(arrayProto);

;[
  'push',
  'pop',
  'splice',
  'shift',
  'unshift',
  'reverse',
  'sort',
].forEach(method => {
  const original = arrayProto[method];
  Object.defineProperty(interceptor, method, {
    enumerable: true,
    writable: true,
    configurable: true,
    value (...args) {
      // 通知依赖，并将新增的数据转换成响应式
      let params;
      if (['push', 'shift'].includes(method)) {
        params = args;
      }
      if (method === 'splice') {
        params = args.slice(2);
      }
      // 获取当前数据的Observer实例
      const ob = this.__ob__;
      ob.observeArray(params);

      // 通知依赖更新
      ob.dep.notify();

      return original.apply(this, args);
    }
  });
})

export { interceptArr }