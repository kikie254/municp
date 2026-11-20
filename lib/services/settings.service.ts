import "server-only";

import { COLLECTIONS } from "../firebase/collections";
import { col, getDocById, updateDoc, setDoc } from "../firebase/db";
import type { SettingRecord } from "../firebase/types";

/** Application settings (key/value). No unrestricted public access — see firestore.rules. */

export async function getSetting(key: string): Promise<string | null> {
  const record = await getDocById(COLLECTIONS.settings, key);
  return record ? (record as unknown as SettingRecord).value : null;
}

export async function setSetting(key: string, value: string): Promise<void> {
  await setDoc(COLLECTIONS.settings as never, key, { key, value, updatedAt: new Date() } as never);
}

export async function listSettings(): Promise<SettingRecord[]> {
  const snap = await col(COLLECTIONS.settings).orderBy("key").limit(200).get();
  return snap.docs.map((d) => ({ key: d.id, ...(d.data() as Omit<SettingRecord, "key">) }));
}

export async function updateSetting(key: string, value: string): Promise<void> {
  await updateDoc(COLLECTIONS.settings as never, key, { value, updatedAt: new Date() } as never);
}
