const addHours = (date: Date, hours: number): number => {
  return date.setHours(date.getHours() + hours);
};

export { addHours };
