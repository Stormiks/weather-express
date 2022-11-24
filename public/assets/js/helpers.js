const stringifyParam = (param) => {
  switch (typeof (param)) {
    case 'boolean':
      return param === true ? 'true' : 'false';
    case 'string':
      return encodeURIComponent(param);
    default:
      return param;
  }
};

const stringify = (params, baseURL = '') => {
  let query = '';

  Object.keys(params).forEach((p, i) => {
    if (i !== 0) query += '&';

    query += `${p}=${stringifyParam(params[p])}`;
  });

  return `${baseURL}?${query}`;
};

function range(min, max, step = 1) {
  // eslint-disable-next-line no-shadow
  const range = [];

  for (let i = min; i <= max; i += step) {
    range.push(i);
  }

  return range;
}
