// ============================================================================
// In-memory fallback store
// ----------------------------------------------------------------------------
// Implements the small subset of the node-redis v4 API used by this project.
// It lets `npm run dev` work with zero external services. Production continues
// to use Redis whenever REDIS_URL is configured.
// ============================================================================

export class MemoryStore {
  constructor() {
    this.data = new Map();
    this.isOpen = true;
    this._expiry = new Map();
  }

  _now() { return Date.now(); }

  _alive(key) {
    const exp = this._expiry.get(key);
    if (exp && exp <= this._now()) {
      this.data.delete(key);
      this._expiry.delete(key);
      return false;
    }
    return true;
  }

  _match(pattern) {
    // Only the `prefix:*` patterns used by this app are supported.
    if (!pattern) return [...this.data.keys()];
    if (pattern.endsWith("*") && !pattern.slice(0, -1).includes("*")) {
      const prefix = pattern.slice(0, -1);
      return [...this.data.keys()].filter((key) => key.startsWith(prefix));
    }
    const escaped = pattern.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*");
    const re = new RegExp(`^${escaped}$`);
    return [...this.data.keys()].filter((key) => re.test(key));
  }

  async get(key) {
    if (!this._alive(key)) return null;
    return this.data.has(key) ? this.data.get(key) : null;
  }

  async mGet(keys) {
    return keys.map((key) => (this._alive(key) && this.data.has(key) ? this.data.get(key) : null));
  }

  async set(key, value, options = {}) {
    this._alive(key);
    if (options && options.NX && this.data.has(key)) return null;

    this.data.set(key, String(value));
    if (options && options.EX) this._expiry.set(key, this._now() + Number(options.EX) * 1000);
    else this._expiry.delete(key);
    return "OK";
  }

  async del(key) {
    this._alive(key);
    this._expiry.delete(key);
    return this.data.delete(key) ? 1 : 0;
  }

  async exists(key) {
    return this._alive(key) && this.data.has(key) ? 1 : 0;
  }

  async scan(cursor, options = {}) {
    // The in-memory store returns everything in a single page.
    const keys = this._match(options.MATCH || "*").sort();
    return { cursor: 0, keys };
  }

  async ping() { return "PONG"; }

  async quit() { this.isOpen = false; }
}

export default MemoryStore;
