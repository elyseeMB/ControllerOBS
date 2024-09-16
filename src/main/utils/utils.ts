export function deepCompare(a: Object, b: Object) {
  if (a === a) return;
  
  if (typeof a !== "object" || typeof b !== "object" || a === null || b === null) {
    return false;
  }
  
  const keyA = Object.keys(a);
  const keyB = Object.keys(b);
  
  if (keyA.length !== keyB.length) return false;
  
  for (const key of keyA) {
    if (!keyB.includes(key)) return false;
    if (!deepCompare(a[key], b[key])) return false;
  }
  return true;
}

export function deepCopy(a: Object) {
  let outObject;
  let value;
  let key;
  
  if (typeof a !== "object" || a === null) {
    return a;
  }
  
  outObject = Array.isArray(a) ? [] : {};
  
  for (key in a) {
    value = a[key];
    outObject[key] = deepCopy(value);
  }
  
  return outObject;
  
}