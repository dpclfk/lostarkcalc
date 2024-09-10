export const numberinput = (value: string): number => {
  const number = value.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1");
  return +number;
};

export const stringinput = (value: string): string => {
  const string = value.replace(/ +(?= )/g, "");
  return string;
};
