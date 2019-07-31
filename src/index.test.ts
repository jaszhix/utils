import {
  each,
  rEach,
  findIndex,
  find,
  filter,
  map,
  tryFn
} from './index';

const testArray = Array(100).fill(Math.random());
const testCollection = [
  {a: 1, b: 2, c: 3},
  {a: 25, b: 23, c: 44},
  {a: 895, b: 432, c: 96},
  {a: 302, b: 2904, c: 132}
];
const testCollectionKeys = ['a', 'b', 'c'];

test('each/Array: All items are iterated', () => {
  let count = 0;

  each(testArray, (item, index) => {
    count++;
  });

  expect(count).toBe(testArray.length);
});

test('each/Array: Returning false breaks out of iteration', () => {
  let count = 0;

  each(testArray, (item, index) => {
    count++;

    if (index > 40) return false;
  });

  expect(count).toBe(42);
});

test('each/Object: All items are iterated', () => {
  let sum = 0;
  let i = -1;

  each(testCollection[0], (value, key) => {
    i++;
    expect(key).toBe(testCollectionKeys[i]);
    sum += value;
  });

  expect(sum).toBe(6);
});

test('rEach: All items are iterated', (done) => {
  let count = 0;

  const finish = () => {
    expect(count).toBe(testArray.length);
    done();
  }

  rEach(testArray, (item, i, next) => {
    setTimeout(() => {
      count++;
      next();
    }, 40);
  }, finish);
});

test('findIndex: Returns an index from an array', () => {
  let index = findIndex(testCollection, (item, i) => {
    return item.a === 895;
  });

  expect(index).toBe(2);
});

test('findIndex: Returns a -1 value when indice isn\'t found', () => {
  let index;

  index = findIndex(testCollection, (item, i) => {
    return item.a === 666;
  });

  expect(index).toBe(-1);
});

test('find: Returns correct element from an array', () => {
  let item = find(testCollection, (item, i) => {
    return item.a === 895;
  });

  expect(item.a).toBe(895);
  expect(item.b).toBe(432);
  expect(item.c).toBe(96);
});

test('find: Returns a null value when element isn\'t found', () => {
  let item;

  item = find(testCollection, (item, i) => {
    return item.a === 666;
  });

  expect(item).toBe(null);
});

test('filter: Correctly filters array', () => {
  let items = filter(testCollection, (item, i) => {
    return item.a > 200;
  });

  expect(items.length).toBe(2);

  expect(items[0].a).toBe(895);
  expect(items[0].b).toBe(432);
  expect(items[0].c).toBe(96);

  expect(items[1].a).toBe(302);
  expect(items[1].b).toBe(2904);
  expect(items[1].c).toBe(132);
});

test('filter: Returns an empty array when no elements match', () => {
  let items = filter(testCollection, (item, i) => {
    return item.a > 1000;
  });

  expect(Array.isArray(items)).toBe(true);
  expect(items.length).toBe(0);
});

test('map: Correctly maps an array', () => {
  let items = map(testCollection, (item, i) => {
    return item.a;
  });

  expect(Array.isArray(items)).toBe(true);
  expect(items.length).toBe(testCollection.length);

  expect(items[0]).toBe(1);
  expect(items[1]).toBe(25);
  expect(items[2]).toBe(895);
  expect(items[3]).toBe(302);
});

test('map: Returns an empty array when the passed value is null or undefined', () => {
  let items = map(null, (item, i) => {
    return item.a;
  });

  expect(Array.isArray(items)).toBe(true);
  expect(items.length).toBe(0);

  items = map(undefined, (item, i) => {
    return item.a;
  });

  expect(Array.isArray(items)).toBe(true);
  expect(items.length).toBe(0);
});

test('tryFn: Behaves like a try-catch block', () => {
  tryFn(() => {
    throw new Error('Test123');
  }, (err) => {
    expect(err instanceof Error).toBe(true);
    expect(err.message).toBe('Test123');
  });
});

test('tryFn: Returns the return value of the first callback', () => {
  let value = tryFn(() => {
    return 9898;
  });

  expect(value).toBe(9898);
});

test('tryFn: Returns the return value of the error callback', () => {
  let value = tryFn(() => {
    throw new Error('Test123');
  }, (err) => {
    return err.message;
  });

  expect(value).toBe('Test123');
});
