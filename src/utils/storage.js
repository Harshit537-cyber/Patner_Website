const PREFIX = 'astronarhari_partner_';

export const storage = {
  get(key) {
    try {
      const value = localStorage.getItem(PREFIX + key);
      return value ? JSON.parse(value) : null;
    } catch {
      return null;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value));
    } catch {
      /* storage unavailable */
    }
  },
  remove(key) {
    localStorage.removeItem(PREFIX + key);
  },
  clear() {
    Object.keys(localStorage)
      .filter((k) => k.startsWith(PREFIX))
      .forEach((k) => localStorage.removeItem(k));
  },
};
