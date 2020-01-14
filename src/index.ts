const each = function(obj: any, fn: (elementOrValue, indexOrKey) => any): undefined {
  if (Array.isArray(obj)) {
    for (let i = 0, len = obj.length; i < len; i++) {
      if (fn(obj[i], i) === false) {
        return;
      }
    }
  } else if (typeof obj === 'object') {
    let keys = Object.keys(obj);
    for (let i = 0, len = keys.length; i < len; i++) {
      fn(obj[keys[i]], keys[i]);
    }
  }
};

const rEach = function(array: any[], fn: (element, index, nextIterationCallback) => void, finishFn: () => void, i: number = -1): void {
  let next: Function;

  i++;

  if (array[i] === undefined) {
    if (typeof finishFn === 'function') finishFn();
    return;
  }

  next = () => rEach(array, fn, finishFn, i);
  fn(array[i], i, next);
}

const findIndex = function(arr: any[], fn: (element, index, array) => boolean): number {
  for (let i = 0, len = arr.length; i < len; i++) {
    if (fn(arr[i], i, arr)) {
      return i;
    }
  }

  return -1;
}

const find = function(arr: any[], fn: (element, index, array) => boolean): any {
  for (let i = 0, len = arr.length; i < len; i++) {
    if (fn(arr[i], i, arr)) {
      return arr[i];
    }
  }

  return null;
}

const filter = function (arr: any[], fn: (element, index, array) => boolean): any[] {
  let result = [];
  for (let i = 0, len = arr.length; i < len; i++) {
    if (fn(arr[i], i, arr)) {
      result.push(arr[i]);
    }
  }

  return result;
};

const map = function (arr: any[], fn: (element, index, array) => any): any[] {
  if (arr == null) {
    return [];
  }

  let len = arr.length;
  let out = Array(len);

  for (let i = 0; i < len; i++) {
    out[i] = fn(arr[i], i, arr);
  }

  return out;
}

const tryFn = function(fn: (...args: any[]) => any, errCb?: (e: Error) => any): any {
  try {
    return fn();
  } catch (e) {
    if (errCb) return errCb(e);
  }
};

const cloneDeep = function(obj: any, refs: object[] = []): any {
  if (refs.indexOf(obj) > -1) return obj;

  if (Array.isArray(obj)) {
    obj = obj.slice();

    for (let i = 0, len = obj.length; i < len; i++) {
      obj[i] = cloneDeep(obj[i]);
    }

    return obj;
  }

  if (obj == null || typeof obj !== 'object') return obj;

  refs.push(obj);

  obj = {...obj};

  const keys = Object.keys(obj);

  for (let i = 0, len = keys.length; i < len; i++) {
    let key = keys[i];

    switch (true) {
      case (Array.isArray(obj[key])): {
        obj[key] = obj[key].slice();

        let arr = obj[key];

        for (let z = 0, len = arr.length; z < len; z++) {
          if (arr[z] != null && typeof arr[z] === 'object') {
            arr[z] = cloneDeep(arr[z], refs);
          }
        }

        break;
      }

      case (obj[key] != null && typeof obj[key] === 'object'): {
        obj[key] = cloneDeep(obj[key], refs);
        break;
      }
    }
  }

  return obj;
}

export {
  each,
  rEach,
  findIndex,
  find,
  filter,
  map,
  tryFn,
  cloneDeep,
};
