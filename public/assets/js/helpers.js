function range(min, max, step = 1) {
  // eslint-disable-next-line no-shadow
  const range = [];

  for (let i = min; i <= max; i += step) {
    range.push(i);
  }

  return range;
}
