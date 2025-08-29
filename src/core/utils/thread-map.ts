const THREAD_MAP_KEY = "thread_map";

class ThreadMapStorage {
  static getMap(): Record<string, string> {
    const raw = localStorage.getItem(THREAD_MAP_KEY);
    return raw ? JSON.parse(raw) : {};
  }

  private static saveMap(map: Record<string, string>) {
    localStorage.setItem(THREAD_MAP_KEY, JSON.stringify(map));
  }

  static set(threadId: string, id: string) {
    const map = this.getMap();
    map[threadId] = id;
    this.saveMap(map);
  }

  static get(threadId: string): string | undefined {
    const map = this.getMap();
    return map[threadId];
  }

  static remove(threadId: string) {
    const map = this.getMap();
    delete map[threadId];
    this.saveMap(map);
  }
}

export default ThreadMapStorage;