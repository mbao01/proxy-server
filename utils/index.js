const isEmpty = (obj) => {
  return (
    obj === undefined ||
    obj === null ||
    (typeof obj === 'object' && Object.keys(obj).length === 0) ||
    (Array.isArray(obj) && obj.length === 0) ||
    (typeof obj === 'string' && obj.trim().length === 0)
  );
};

const isEmptyObject = (obj) => {
  return !(typeof obj === 'object' && Object.keys(obj).length > 0);
};

const keepDefinedValues = (data) => {
  if (!isEmpty(data)) {
    return Object.entries(data).reduce((acc, [key, value]) => {
      if (
        typeof value !== 'undefined' &&
        value !== null &&
        value !== undefined
      ) {
        acc[key] = value;
      }

      return acc;
    }, {});
  }

  return data;
};

module.exports = {
  isEmpty,
  isEmptyObject,
  keepDefinedValues,
};
