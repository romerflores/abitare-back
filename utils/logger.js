// utils/logger.js
export const log = (...args) => {
  console.log(new Date().toISOString(), ...args);
};

export const error = (...args) => {
  console.error(new Date().toISOString(), ...args);
};

export default { log, error };
