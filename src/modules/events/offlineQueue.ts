import { api } from "./api";

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

export function deviceId() {
  let value = localStorage.getItem(DEVICE_KEY);
  if (!value) {
    value = crypto.randomUUID();
    localStorage.setItem(DEVICE_KEY, value);
  }
  return value;
}

export function listQueuedScans(slug: string): QueuedScan[] {
  return JSON.parse(localStorage.getItem(`reg-desk-offline-scans-${slug}`) ?? "[]") as QueuedScan[];
}

export function enqueueScan(slug: string, scan: QueuedScan) {
  const scans = listQueuedScans(slug);
  scans.push(scan);
  localStorage.setItem(`reg-desk-offline-scans-${slug}`, JSON.stringify(scans));
}

export async function flushScans(slug: string) {
  const scans = listQueuedScans(slug);
  if (scans.length === 0) {
    return [];
  }
  const response = await api<{ results: Array<{ localScanId: string; status: string; reason: string }> }>(slug, "/scans/sync", {
    method: "POST",
    body: JSON.stringify({ scans })
  });
  const completed = new Set(response.results.map((result) => result.localScanId));
  localStorage.setItem(`reg-desk-offline-scans-${slug}`, JSON.stringify(scans.filter((scan) => !completed.has(scan.localScanId))));
  return response.results;
}
