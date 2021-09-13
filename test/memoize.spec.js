import { toBinary, power, sum } from "../src/lib";
import { memoize } from "../src/memo";
import { getOrderById, getTotalPrice } from './orders';

describe('Memoize', () => {
  it('should not expose the memoized data as a public function attribute', () => {
    const toBinary = value => (value).toString(2);

    const keysFnNotMemoized = Object.keys(toBinary);
    const memoizedToBinary = memoize(toBinary);
    const keysFnMemoized = Object.keys(memoizedToBinary);

    expect(keysFnNotMemoized.length).toEqual(keysFnMemoized.length);
  });

  it('should hold memoized data in separate namespaces for each memoized function', () => {
    // the same function `toBinarySpy` gets memoized
    const toBinarySpy = jasmine.createSpy('toBinarySpy', toBinary).and.callThrough();
    // but it gets memoized in two different "memoization containers"
    const memoizedToBinary1 = memoize(toBinarySpy);
    const memoizedToBinary2 = memoize(toBinarySpy);

    // invoking separate memoized functions with the same argument
    expect(toBinarySpy).not.toHaveBeenCalled();
    memoizedToBinary1(123);
    expect(toBinarySpy).toHaveBeenCalledTimes(1);
    // memoizing `toBinary(123)` in container 1 doesn't mean memoizing in container 2
    memoizedToBinary2(123);
    expect(toBinarySpy).toHaveBeenCalledTimes(2);
  });

  it('should use memoized results if the underlying function has already been called with the same arguments', () => {
    const toBinarySpy = jasmine.createSpy('toBinarySpy', toBinary).and.callThrough();
    const memoizedToBinary = memoize(toBinarySpy);

    expect(toBinarySpy).not.toHaveBeenCalled();
    
    expect(memoizedToBinary(123)).toBe('1111011');
    expect(toBinarySpy).toHaveBeenCalledTimes(1);
    
    expect(memoizedToBinary(123)).toBe('1111011');
    expect(toBinarySpy).toHaveBeenCalledTimes(1);
    
    expect(memoizedToBinary(123)).toBe('1111011');
    expect(toBinarySpy).toHaveBeenCalledTimes(1);
  });

  it('should store results separately for each different arguments passed to underlying function', () => {
    const toBinarySpy = jasmine.createSpy('toBinarySpy', toBinary).and.callThrough();
    const memoizedToBinary = memoize(toBinarySpy);

    expect(toBinarySpy).not.toHaveBeenCalled();
    
    expect(memoizedToBinary(123)).toBe('1111011');
    expect(toBinarySpy).toHaveBeenCalledTimes(1);
    
    expect(memoizedToBinary(123)).toBe('1111011');
    expect(toBinarySpy).toHaveBeenCalledTimes(1);
    
    expect(memoizedToBinary(1234)).toBe('10011010010');
    expect(toBinarySpy).toHaveBeenCalledTimes(2);

    expect(memoizedToBinary(1234)).toBe('10011010010');
    expect(toBinarySpy).toHaveBeenCalledTimes(2);
    
    expect(memoizedToBinary(12345)).toBe('11000000111001');
    expect(toBinarySpy).toHaveBeenCalledTimes(3);

    expect(memoizedToBinary(12345)).toBe('11000000111001');
    expect(toBinarySpy).toHaveBeenCalledTimes(3);
  });

  // take a look at orders.json data file and simple data processing in orders.js

  it('should store results based on object arguments', () => {
    const getTotalPriceSpy = jasmine.createSpy('getTotalPriceSpy', getTotalPrice).and.callThrough();
    const getTotalPriceMemoized = memoize(getTotalPriceSpy);

    const orderKory = getOrderById('a0a4bcdb-8c90-4c5c-8d48-054f354425d0');
    const orderMozelle = getOrderById('78ae15f9-ddb6-47ea-8b7c-207f9a65adfd');
    const orderMuhammad = getOrderById('21bb06db-20f4-4d90-a62c-290fd87af892');

    // order #1
    expect(getTotalPriceMemoized(orderKory)).toBe(27.8);
    expect(getTotalPriceSpy).toHaveBeenCalledTimes(1);
    
    expect(getTotalPriceMemoized(orderKory)).toBe(27.8);
    expect(getTotalPriceSpy).toHaveBeenCalledTimes(1);
    
    // order #2
    expect(getTotalPriceMemoized(orderMozelle)).toBe(67.97);
    expect(getTotalPriceSpy).toHaveBeenCalledTimes(2);
    
    expect(getTotalPriceMemoized(orderMozelle)).toBe(67.97);
    expect(getTotalPriceSpy).toHaveBeenCalledTimes(2);
    
    // order #3
    expect(getTotalPriceMemoized(orderMuhammad)).toBe(38.95);
    expect(getTotalPriceSpy).toHaveBeenCalledTimes(3);

    expect(getTotalPriceMemoized(orderMuhammad)).toBe(38.95);
    expect(getTotalPriceSpy).toHaveBeenCalledTimes(3);
  });

  it('should use the same results (store and retrieve) if two objects have exactly same content (key-value pairs), but the order of keys might be different', () => {
    const getTotalPriceSpy = jasmine.createSpy('getTotalPriceSpy', getTotalPrice).and.callThrough();
    const getTotalPriceMemoized = memoize(getTotalPriceSpy);

    const sampleOrder = {
      "orderId": "a7cb1846-8c90-4c5c-8d48-054f354425d0",
      "customer": "John Doe",
      "items": [
        {
          "name": "Ice Cream",
          "price": 1.99,
          "quantity": 4
        }
      ]
    };

    const { orderId, customer, items } = sampleOrder;
    const sampleOrderWithReorderedKeys_1 = { items, customer, orderId };
    const sampleOrderWithReorderedKeys_2 = { customer, items, orderId };

    expect(getTotalPriceMemoized(sampleOrder)).toBe(7.96);
    expect(getTotalPriceSpy).toHaveBeenCalledTimes(1);
    expect(getTotalPriceMemoized(sampleOrderWithReorderedKeys_1)).toBe(7.96);
    expect(getTotalPriceSpy).toHaveBeenCalledTimes(1);
    expect(getTotalPriceMemoized(sampleOrderWithReorderedKeys_2)).toBe(7.96);
    expect(getTotalPriceSpy).toHaveBeenCalledTimes(1);
  });

  it('should store results for two-argument functions', () => {
    const powerSpy = jasmine.createSpy('powerSpy', power).and.callThrough();
    const memoizedPower = memoize(powerSpy);

    expect(memoizedPower(3, 3)).toBe(27);
    expect(powerSpy).toHaveBeenCalledTimes(1);
    
    expect(memoizedPower(4, 4)).toBe(256);
    expect(powerSpy).toHaveBeenCalledTimes(2);

    expect(memoizedPower(3, 3)).toBe(27);
    expect(powerSpy).toHaveBeenCalledTimes(2);    
    
    expect(memoizedPower(4, 4)).toBe(256);
    expect(powerSpy).toHaveBeenCalledTimes(2);
  });

  it('should store results for multiple arguments functions', () => {
    const sumSpy = jasmine.createSpy('sumSpy', sum).and.callThrough();
    const memoizedSum = memoize(sumSpy);

    expect(memoizedSum(1)).toBe(1);
    expect(sumSpy).toHaveBeenCalledTimes(1);

    expect(memoizedSum(1, 2)).toBe(3);
    expect(sumSpy).toHaveBeenCalledTimes(2);

    expect(memoizedSum(1, 2, 3)).toBe(6);
    expect(sumSpy).toHaveBeenCalledTimes(3);

    expect(memoizedSum(1, 2, 3, 4)).toBe(10);
    expect(sumSpy).toHaveBeenCalledTimes(4);

    expect(memoizedSum(1)).toBe(1);
    expect(sumSpy).toHaveBeenCalledTimes(4);

    expect(memoizedSum(1, 2, 3, 4)).toBe(10);
    expect(sumSpy).toHaveBeenCalledTimes(4);
  });
});
