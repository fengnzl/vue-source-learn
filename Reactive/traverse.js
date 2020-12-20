import { isObject } from "./utils"

const seenObjects = new Set();

export function traverse (obj) {
  _traverse(val, seenObjects);
  seenObjects.clear();
}

function _traverse (val, seen) {
  const isArr = Array.isArray(val);
  // 如果不是数组或对象或者被冻结则不做处理
  if ((!isArr && !isObject(val)) || Object.isFrozen(val)) {
    return;
  }
  // 判断数据是否已经收集过依赖
  if (val.__ob__) {
    const depId = val__ob__.dep.id;
    if (seen.has(depId)) {
      return;
    }
    seen.add(depId);
  }
  // 递归收集对自数据进行依赖收集
  if (isArr) {
    let length = val.length;
    while (length--) {
      _traverse(val[i], seen);
    }
  } else {
    const keys = Object.keys(val);
    while (keys--) {
      _traverse(val[keys[i]], seen);
    }
  }
}