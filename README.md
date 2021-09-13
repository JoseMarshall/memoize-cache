# Memoize your functions

__two versions__ of a generic memoization mechanism. A _memoized function_ keeps track of the results it has already calculated and, if possible, will avoid recalculating the results in the future by simply retrieving them from the storage.

- You are required to implement the below tasks using the Functional Programming paradigm. The tests will enforce that (otherwise they fail).
- The test assumes your knowledge of ES6/ES2015.
- A model memoized function will keep track of all its results (and their corresponding arguments that the original function was called with). If a memoized function `memo_fn` gets invoked twice with identical parameters, for example, `memo_fn(1, 2); memo_fn(1, 2);`, the underlying function `fn` will get invoked only once: `fn(1, 2)`, next time the result will be immediately retrieved from the cache.

## Tasks

- The `memoize` function:
  - Supports functions with a different number of parameters.
  - Allows function parameters to be objects.
  - Normalizes object values (key-value pairs and their order), i.e. if a memoized function accepts objects and it is given two or more objects that have exactly the same key-value pairs, but the order of the pairs appears to be different, then the memoized function will treat them as if they were the same object.

- The `cache` function:
  - Same as the `memoize` function, but also supports additional features (through a different API):
  - Allows for checking on how many occasions the result has been retrieved from the cache without recalculation (hitCount).
  - Allows for clearing the cache (both the cached results and hit counts).

The above requirements are explicitly stated as the name of each test anyway.

# Tests Overview

The tests are based on Jasmine testing framework. You will find multiple snippets similar to the following:
```js
const toBinarySpy = jasmine.createSpy('toBinarySpy', toBinary).and.callThrough();
const memoizedToBinary = memoize(toBinarySpy);
```

Please note that:
- `toBinary` is just a function that does some original calculations.
- `toBinarySpy` is the `toBinary` function wrapped in a Jasmine spy, i.e. it additionally keeps track of all the times it has been invoked.
- `memoizedToBinary` is the memoized version of the spy function.
All in all, when the `memoizedToBinary` function is called, the memoization mechanism will first get into play (that's your part!). Then, if a certain result is not available, the control is handed over to the spy function. It calls the original function and remembers how many times it has been invoked.

The main point is that if we are calling a memoized function with the same arguments over and over again, the _spy function should not be reached more than once_.

# Setup

1. `npm install` – installs dependencies.
2. `npm test` – runs all tests once (this will be used to evaluate your solutions).
3. `npm run test:watch` - runs all tests in the _watch mode_ (optionally, you can use it locally if you prefer).
