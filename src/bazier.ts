export type Point = [x: number, y: number];

const fact = (n: number): number => {
  if (n == 0) {
    return 1;
  } else {
    return n * fact(n - 1);
  }
};

const comb = (n: number, k: number) => fact(n) / (fact(k) * fact(n - k));

export const bazier = (ps: readonly Point[], t: number) => {
  const n = ps.length - 1;
  return ps.reduce(
    (acc, cur, i) => {
      const factor = comb(n, i) * (1 - t) ** (n - i) * t ** i;
      return [acc[0] + cur[0] * factor, acc[1] + cur[1] * factor];
    },
    [0, 0]
  );
};
