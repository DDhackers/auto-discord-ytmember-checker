export const random = (max: number, min = 0) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
};

export const randomDate = () => {
  const month = random(12, 1);
  const bigMonth = [1, 3, 5, 7, 8, 10, 12];
  const day = random(bigMonth.includes(month) ? 31 : 30, 1);
  const hour = random(24, 0);
  const min = random(59, 0);

  const add0 = (num: number): string => {
    return num < 10 ? `0${num}` : `${num}`;
  };

  return `2021-${add0(month)}-${add0(day)} ${add0(hour)}:${add0(min)}`;
};

export const getRandomFrom = (arr: Array<any>): any => {
  return (() => arr[Math.floor(Math.random() * arr.length)])();
};

export const randomNumString = (length = 0): string => {
  let counter = 0;
  let output = '';
  while (counter < length) {
    output += `${random(9, 0)}`;
    counter++;
  }
  return output;
};

export const randomAlphabat = (): string => {
  const alphabats = [
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z'
  ];
  const alpabat = getRandomFrom(alphabats);
  return Math.random() > 0.5 ? alpabat : alpabat.toUpperCase();
};

export const randomNAString = (length = 0): string => {
  let counter = 0;
  let output = '';
  while (counter < length) {
    output += `${Math.random() > 0.5 ? randomAlphabat() : random(9, 0)}`;
    counter++;
  }
  return output;
};
