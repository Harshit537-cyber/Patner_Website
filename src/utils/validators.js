export const isValidEmail = (value = '') =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

export const isValidPhone = (value = '') =>
  /^[6-9]\d{9}$/.test(value.trim());

export const isValidOTP = (value = '') =>
  /^\d{6}$/.test(value.trim());

export const isValidPAN = (value = '') =>
  /^[A-Z]{5}\d{4}[A-Z]$/.test(value.trim().toUpperCase());

export const isValidIFSC = (value = '') =>
  /^[A-Z]{4}0[A-Z0-9]{6}$/.test(value.trim().toUpperCase());

export const isRequired = (value) => value !== undefined && value !== null && String(value).trim().length > 0;

export const minLength = (value = '', len = 8) => value.trim().length >= len;
