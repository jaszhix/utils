type ArrayIterator<T, TResult> = (value: T, index: number) => TResult;
type tryFnCb<T> = (...args: any[]) => T;

function each<T>(
  obj: ArrayLike<T>,
  fn: (value: T, index: number | keyof T) => any,
): void;
function each<T>(
  obj: T,
  fn: (value: T[keyof T], index: keyof T | string) => any,
): void;
function each<T>(
  obj: ArrayLike<T> | T,
  fn: (value: T | T[keyof T], index: number | keyof T | string) => any,
): void {
  if (Array.isArray(obj)) {
    for (let i = 0, len = obj.length; i < len; i++) {
      if (fn(obj[i] as T, i) === false) {
        return;
      }
    }
  } else if (typeof obj === 'object') {
    let keys = Object.keys(obj) as (keyof T)[];


    for (let i = 0, len = keys.length; i < len; i++) {
      fn(((obj as T)[keys[i]] as T[keyof T]), keys[i]);
    }
  }
};

const rEach = <T>(
  array: ArrayLike<T>,
  fn: (element: T, index: number, nextIterationCallback: () => void) => void,
  finishFn: () => void,
  i: number = -1
): void => {
  i++;

  if (array[i] == null) {
    finishFn();
    return;
  }

  fn(array[i], i, () => rEach(array, fn, finishFn, i));
}

const findIndex = <T>(arr: ArrayLike<T>, fn: ArrayIterator<T, boolean>): number => {
  for (let i = 0, len = arr.length; i < len; i++) {
    if (fn(arr[i], i)) {
      return i;
    }
  }

  return -1;
}

const find = <T>(arr: ArrayLike<T>, fn: ArrayIterator<T, boolean>): T | null => {
  for (let i = 0, len = arr.length; i < len; i++) {
    if (fn(arr[i], i)) {
      return arr[i];
    }
  }

  return null;
}

const filter = <T>(arr: ArrayLike<T>, fn: ArrayIterator<T, boolean>): T[] => {
  let result = [];

  for (let i = 0, len = arr.length; i < len; i++) {
    if (fn(arr[i], i)) {
      result.push(arr[i]);
    }
  }

  return result;
};

const map = <T, TResult>(arr: T[] | null | undefined, fn: ArrayIterator<T, TResult>): TResult[] => {
  if (arr == null) {
    return [];
  }

  let len = arr.length;
  let out = Array(len);

  for (let i = 0; i < len; i++) {
    out[i] = fn(arr[i], i);
  }

  return out;
}

const tryFn = <T>(fn: tryFnCb<T>, errCb?: tryFnCb<T>): T | undefined => {
  try {
    return fn();
  } catch (e) {
    if (errCb) return errCb(e);
  }
};

function cloneDeep <T>(obj: T[], refs?: T[][]): T[]
function cloneDeep <T>(obj: T, refs?: T[] | ArrayLike<T>[]): T
function cloneDeep <T>(
  obj: T | T[] | T & ArrayLike<T> | (T & ArrayLike<T>)[],
  refs: T[] | ArrayLike<T>[] = []
): T | T[] {
  if (refs.indexOf(<T & ArrayLike<T>>obj) > -1) return obj;

  if (Array.isArray(obj)) {
    obj = obj.slice();

    for (let i = 0, len = obj.length; i < len; i++) {
      obj[i] = cloneDeep(obj[i]);
    }

    return obj;
  }

  if (obj == null || typeof obj !== 'object') return obj;

  refs.push(obj as (T & ArrayLike<T>));

  obj = {...obj};

  const keys = Object.keys(obj) as (keyof T)[];

  for (let i = 0, len = keys.length; i < len; i++) {
    let key = keys[i];

    switch (true) {
      case (Array.isArray(obj[key])): {
        obj[key] = (obj[key] as unknown as any & ArrayLike<any>).slice();

        let arr = obj[key] as unknown as any[];

        for (let z = 0, len = arr.length; z < len; z++) {
          if (arr[z] != null && typeof arr[z] === 'object') {
            arr[z] = cloneDeep(arr[z], refs);
          }
        }

        break;
      }

      case (obj[key] != null && typeof obj[key] === 'object'): {
        obj[key] = cloneDeep(obj[key] as unknown as T, refs) as unknown as T[keyof T];
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
