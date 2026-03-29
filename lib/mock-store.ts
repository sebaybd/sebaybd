import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import {
  dailyEssentialProblems,
  sampleBookings,
  sampleCategories,
  sampleMessages,
  sampleProviders,
  sampleServices,
} from "@/lib/sample-data";
import { MockStoreData } from "@/types/marketplace";

const storePath = path.join(process.cwd(), "data", "mock-store.json");

function mergeById<T extends { id: string }>(defaults: T[], stored?: T[]): T[] {
  const storedList = stored ?? [];
  const merged = [...storedList];
  const storedIds = new Set(storedList.map((item) => item.id));

  for (const item of defaults) {
    if (!storedIds.has(item.id)) {
      merged.push(item);
    }
  }

  return merged;
}

function getDefaultMockStore(): MockStoreData {
  return {
    categories: sampleCategories,
    providers: sampleProviders,
    services: sampleServices,
    essentialProblems: dailyEssentialProblems,
    bookings: sampleBookings,
    messages: sampleMessages,
    reviews: [],
  };
}

function ensureMockStore() {
  const directory = path.dirname(storePath);
  if (!existsSync(directory)) {
    mkdirSync(directory, { recursive: true });
  }

  if (!existsSync(storePath)) {
    writeFileSync(storePath, JSON.stringify(getDefaultMockStore(), null, 2), "utf8");
  }
}

export function readMockStore(): MockStoreData {
  ensureMockStore();
  const raw = readFileSync(storePath, "utf8");
  const parsed = JSON.parse(raw) as Partial<MockStoreData>;
  const defaults = getDefaultMockStore();

  return {
    ...defaults,
    ...parsed,
    categories: mergeById(defaults.categories, parsed.categories),
    providers: mergeById(defaults.providers, parsed.providers),
    services: mergeById(defaults.services, parsed.services),
    essentialProblems: mergeById(defaults.essentialProblems, parsed.essentialProblems),
    bookings: mergeById(defaults.bookings, parsed.bookings),
    messages: mergeById(defaults.messages, parsed.messages),
  } as MockStoreData;
}

export function writeMockStore(store: MockStoreData) {
  ensureMockStore();
  writeFileSync(storePath, JSON.stringify(store, null, 2), "utf8");
}

export function updateMockStore(updater: (store: MockStoreData) => MockStoreData): MockStoreData {
  const current = readMockStore();
  const updated = updater(current);
  writeMockStore(updated);
  return updated;
}
