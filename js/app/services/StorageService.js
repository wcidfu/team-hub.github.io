export class StorageService {
  constructor(namespace = 'ornnhub') {
    this.namespace = namespace;
  }

  get(key, fallback = null) {
    try {
      const rawValue = window.localStorage.getItem(this.#key(key));
      return rawValue === null ? fallback : JSON.parse(rawValue);
    } catch {
      return fallback;
    }
  }

  set(key, value) {
    try {
      window.localStorage.setItem(this.#key(key), JSON.stringify(value));
    } catch {
      // Сайт должен работать даже если localStorage недоступен.
    }
  }

  remove(key) {
    try {
      window.localStorage.removeItem(this.#key(key));
    } catch {
      // Безопасный no-op.
    }
  }

  #key(key) {
    return `${this.namespace}:${key}`;
  }
}
