/**
 * Simple object check.
 * @param item
 * @returns {boolean}
 */
export function isObject(item) {
  return (item && typeof item === 'object' && !Array.isArray(item));
}

/**
 * Deep merge two objects.
 * @param target
 * @param ...sources
 */
export function mergeDeep(target, ...sources) {

  if (!sources.length)
    return target;

  const source = sources.shift();

  if (isObject(target) && isObject(source)) {

    for (const key in source) {

      if (isObject(source[key])) {

        if (!target[key])
          Object.assign(target, { [key]: {} });

        mergeDeep(target[key], source[key]);

      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return mergeDeep(target, ...sources);
}

export function ObjectFilter(obj) {

  const propNames = Object.getOwnPropertyNames(obj);

  for (let i = 0; i < propNames.length; i++) {
    let propName = propNames[i];

    if (obj[propName] === null || obj[propName] === undefined || obj[propName] === "") {
      delete obj[propName];
    }
    else if (isObject(obj[propName])) {
      ObjectFilter(obj[propName]);
    }
  }
}