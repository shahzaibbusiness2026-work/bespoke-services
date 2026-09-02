import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { DatabaseSchema } from '../types';
import { INITIAL_DATABASE } from './seed';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname);
const STORE_PATH = path.join(DATA_DIR, 'store.json');
const TEMP_PATH = path.join(DATA_DIR, 'store.json.tmp');

class DataStore {
  private cache: DatabaseSchema | null = null;

  constructor() {
    this.initialize();
  }

  private initialize(): void {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(STORE_PATH)) {
        const raw = fs.readFileSync(STORE_PATH, 'utf-8');
        this.cache = JSON.parse(raw) as DatabaseSchema;
        if (!this.cache.collections || !Array.isArray(this.cache.collections) || this.cache.collections.length === 0) {
          this.cache.collections = INITIAL_DATABASE.collections;
          this.flush();
        }
      } else {
        this.cache = INITIAL_DATABASE;
        this.flush();
      }
    } catch (err) {
      console.warn('[DataStore] Warning reading persistent store, falling back to seed:', err);
      this.cache = INITIAL_DATABASE;
      this.flush();
    }
  }

  public get<K extends keyof DatabaseSchema>(collection: K): DatabaseSchema[K] {
    if (!this.cache) this.initialize();
    return this.cache![collection];
  }

  public update<K extends keyof DatabaseSchema, R>(
    collection: K,
    mutator: (data: DatabaseSchema[K]) => R
  ): R {
    if (!this.cache) this.initialize();
    const result = mutator(this.cache![collection]);
    this.flush();
    return result;
  }

  public transaction<R>(fn: (db: DatabaseSchema) => R): R {
    if (!this.cache) this.initialize();
    const result = fn(this.cache!);
    this.flush();
    return result;
  }

  private flush(): void {
    if (!this.cache) return;
    try {
      const serialized = JSON.stringify(this.cache, null, 2);
      fs.writeFileSync(TEMP_PATH, serialized, 'utf-8');
      fs.renameSync(TEMP_PATH, STORE_PATH);
    } catch (err) {
      console.error('[DataStore] Error flushing to store.json:', err);
    }
  }
}

export const db = new DataStore();
