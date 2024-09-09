export const numberinput = (value: string): number => {
  const number = value.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1");
  return +number;
};
