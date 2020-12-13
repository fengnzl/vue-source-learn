// 设置对象的getter和setter,从而进行依赖收集和触发依赖
// 这里先假设依赖是一个函数保存到window.target中，
// 那么我们就需要将器保存到每个键值的收集数组中

function defineReactive (obj, key, val) {
  let dep = [];
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get () {
      // 依赖收集
      if (window.target) {
        dep.push(window.target);
      }
      return val;
    },
    set (newVal) {
      if (val === newVal) {
        return;
      }
      // 触发依赖
      dep.forEach(item => item(newVal, val));
      val = newVal;
    }
  })
}