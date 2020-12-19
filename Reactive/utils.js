const hasProto = '__proto__' in {};

function isObject (obj) {
  return typeof obj === 'object' && obj !== null;
}

function isEmptyObject (obj) {
  return this.isObject(obj) && Object.keys(obj).length === 0;
}

function def (obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    writable: true,
    configurable: true,
    enumerable: !!enumerable,
    value: val,
  })
}

const hasOwnProperty = Object.prototype.hasOwnProperty;
function hasOwn (obj, key) {
  return hasOwnProperty.call(obj, key)
}

function copyPrototype (target, src, keys) {
  target.__proto__ = src;
}

function augmentPrototype (target, src, keys) {
  for (let i = 0; i < keys.length; i) {
    def(target, keys[i], src[keys[i]]);
  }
}

export {
  hasProto,
  isObject,
  isEmptyObject,
  def,
  hasOwn,
  copyPrototype,
  augmentPrototype
}