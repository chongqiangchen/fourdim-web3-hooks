const splitArray = <T>(arr: T[], flag = 50): T[][] => {
  const len = arr.length;
  const temp = [];
  if (len <= flag) {
    return [arr].filter((item) => item && item.length !== 0);
  }
  const count = Math.ceil(len / flag);
  for (let i = 0; i < count; i++) {
    temp.push(arr.slice(flag * i, flag * (1 + i)));
  }
  return temp.filter((item) => item && item.length !== 0);
};

export default splitArray;