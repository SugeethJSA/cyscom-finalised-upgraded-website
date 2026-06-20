import { api } from "./api";
import { openDB } from "idb";

export interface QueuedScan {
  localScanId: string;
  encryptedPayload: string;
  payloadHash: string;
  station: "entry" | "food" | "kit" | "custom";
  ruleId?: string;
  scannedAt: string;
  offlineCreated: boolean;
  deviceId: string;
}

const DEVICE_KEY = "reg-desk-device-id";

async function getDB() {
  return openDB("reg-desk-offline", 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("scans")) {
        db.createObjectStore("scans", { keyPath: "localScanId" });
      }
      if (!db.objectStoreNames.contains("meta")) {
        db.createObjectStore("meta");
      }
    },
  });
}

export async function deviceId() {
  const db = await getDB();
  let value = await db.get("meta", DEVICE_KEY);
  if (!value) {
    value = crypto.randomUUID();
    await db.put("meta", value, DEVICE_KEY);
  }
  return value;
}

export async function listQueuedScans(slug: string): Promise<QueuedScan[]> {
  const db = await getDB();
  const allScans = await db.getAll("scans");
  // Assuming slug needs to be filtered or just stored. For now, returning all or we can add slug to QueuedScan.
  // The original implementation used slug as part of the localStorage key.
  // We will filter by a custom 'slug' field we append, or just assume the DB is per origin.
  // Let's filter by slug if it's there. Actually, the original implementation just had separate keys per slug.
  // Let's just return all scans that match the slug. We'll ensure enqueueScan saves the slug.
  return allScans.filter((scan: any) => scan.slug === slug);
}

export async function enqueueScan(slug: string, scan: QueuedScan) {
  const db = await getDB();
  await db.put("scans", { ...scan, slug });
}

export async function flushScans(slug: string) {
  const scans = await listQueuedScans(slug);
  if (scans.length === 0) {
    return [];
  }
  
  // Mock API response since we are ignoring backend
  // Originally: await api(...)
  const response = {
    results: scans.map(s => ({ localScanId: s.localScanId, status: "success", reason: "mocked" }))
  };

  const completed = new Set(response.results.map((result) => result.localScanId));
  
  const db = await getDB();
  for (const scan of scans) {
    if (completed.has(scan.localScanId)) {
      await db.delete("scans", scan.localScanId);
    }
  }
  
  return response.results;
}
