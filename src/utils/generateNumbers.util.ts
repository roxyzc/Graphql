const generateNumber = (num?: number): string => {
  const len = num ?? 6;
  let str = "";
  const digits = "0123456789";
  for (let i = 0; i < Number(len); i++) {
    const math = Math.floor(Math.random() * 10);
    str += digits[math];
    if (i === 0 && str === "0") str = digits[math + Math.floor(Math.random() * 9) + 1];
    if (i === 5) break;
  }
  return str;
};

export { generateNumber };
