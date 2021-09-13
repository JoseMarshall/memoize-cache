import { toBinary } from "../src/lib";
import { cache } from "../src/memo";
import { getOrderById, getTotalPrice } from './orders';

describe('Cache', () => {
  it('should use memoized results if the underlying function has already been called with the same arguments', () => {
    const toBinarySpy = jasmine.createSpy('toBinarySpy', toBinary).and.callThrough();
    const { fn: toBinaryCache } = cache(toBinarySpy);

    expect(toBinarySpy).not.toHaveBeenCalled();
    
    expect(toBinaryCache(123)).toBe('1111011');
    expect(toBinarySpy).toHaveBeenCalledTimes(1);
    
    expect(toBinaryCache(123)).toBe('1111011');
    expect(toBinarySpy).toHaveBeenCalledTimes(1);
  });

  it('should store results separately for each different arguments passed to underlying function', () => {
    const toBinarySpy = jasmine.createSpy('toBinarySpy', toBinary).and.callThrough();
    const { fn: toBinaryCache } = cache(toBinarySpy);

    expect(toBinarySpy).not.toHaveBeenCalled();
    
    expect(toBinaryCache(123)).toBe('1111011');
    expect(toBinarySpy).toHaveBeenCalledTimes(1);
    
    expect(toBinaryCache(123)).toBe('1111011');
    expect(toBinarySpy).toHaveBeenCalledTimes(1);
    
    expect(toBinaryCache(1234)).toBe('10011010010');
    expect(toBinarySpy).toHaveBeenCalledTimes(2);
    
    expect(toBinaryCache(1234)).toBe('10011010010');
    expect(toBinarySpy).toHaveBeenCalledTimes(2);
    
    expect(toBinaryCache(12345)).toBe('11000000111001');
    expect(toBinarySpy).toHaveBeenCalledTimes(3);
    
    expect(toBinaryCache(12345)).toBe('11000000111001');
    expect(toBinarySpy).toHaveBeenCalledTimes(3);
  });

  // take a look at orders.json data file and simple data processing in orders.js

  it('should store results based on object arguments', () => {
    const getTotalPriceSpy = jasmine.createSpy('getTotalPriceSpy', getTotalPrice).and.callThrough();
    const { fn: getTotalPriceCache } = cache(getTotalPriceSpy);

    const orderKory = getOrderById('a0a4bcdb-8c90-4c5c-8d48-054f354425d0');
    const orderMozelle = getOrderById('78ae15f9-ddb6-47ea-8b7c-207f9a65adfd');
    const orderMuhammad = getOrderById('21bb06db-20f4-4d90-a62c-290fd87af892');

    // order #1
    expect(getTotalPriceCache(orderKory)).toBe(27.8);
    expect(getTotalPriceSpy).toHaveBeenCalledTimes(1);
    
    expect(getTotalPriceCache(orderKory)).toBe(27.8);
    expect(getTotalPriceSpy).toHaveBeenCalledTimes(1);
    
    // order #2
    expect(getTotalPriceCache(orderMozelle)).toBe(67.97);
    expect(getTotalPriceSpy).toHaveBeenCalledTimes(2);
    
    expect(getTotalPriceCache(orderMozelle)).toBe(67.97);
    expect(getTotalPriceSpy).toHaveBeenCalledTimes(2);
    
    // order #3
    expect(getTotalPriceCache(orderMuhammad)).toBe(38.95);
    expect(getTotalPriceSpy).toHaveBeenCalledTimes(3);

    expect(getTotalPriceCache(orderMuhammad)).toBe(38.95);
    expect(getTotalPriceSpy).toHaveBeenCalledTimes(3);
  });

  it('should track how many times a cached result has been used', () => {
    const toBinarySpy = jasmine.createSpy('toBinarySpy', toBinary).and.callThrough();
    const { fn: toBinaryCache, hitCount } = cache(toBinarySpy);

    expect(hitCount(123)).toBe(0);
    
    expect(toBinaryCache(123)).toBe('1111011');
    expect(hitCount(123)).toBe(0);

    expect(toBinaryCache(123)).toBe('1111011');
    expect(hitCount(123)).toBe(1);

    expect(toBinaryCache(123)).toBe('1111011');
    expect(hitCount(123)).toBe(2);
  });

  it('should clear all memoized results when .clear() called', () => {
    const toBinarySpy = jasmine.createSpy('toBinarySpy', toBinary).and.callThrough();
    const { fn: toBinaryCache, hitCount, clear: clearCache } = cache(toBinarySpy);

    expect(toBinarySpy).toHaveBeenCalledTimes(0);
    expect(hitCount(123)).toBe(0);

    expect(toBinaryCache(123)).toBe('1111011');
    expect(toBinarySpy).toHaveBeenCalledTimes(1);
    expect(hitCount(123)).toBe(0);
    
    expect(toBinaryCache(123)).toBe('1111011');
    expect(toBinarySpy).toHaveBeenCalledTimes(1);
    expect(hitCount(123)).toBe(1);

    expect(toBinaryCache(123)).toBe('1111011');
    expect(toBinarySpy).toHaveBeenCalledTimes(1);
    expect(hitCount(123)).toBe(2);
    
    clearCache();

    expect(toBinarySpy).toHaveBeenCalledTimes(1);
    expect(hitCount(123)).toBe(0);

    expect(toBinaryCache(123)).toBe('1111011');
    expect(toBinarySpy).toHaveBeenCalledTimes(2);
    expect(hitCount(123)).toBe(0);
  })
});
