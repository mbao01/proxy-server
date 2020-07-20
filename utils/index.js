export const keepDefinedValues = (data: { [key: string]: any } | any) => {
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
