// src/utils.js

// Returns current date in YYYY-MM-DD format
export const getToday = () => {
  const today = new Date();
  return today.toISOString().split("T")[0];
};

// Formats a number to 2 decimal places
export const money = (val) => {
  if (!val && val !== 0) return "";
  return Number(val).toFixed(2);
};
