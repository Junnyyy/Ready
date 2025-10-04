import { get, set, del } from "idb-keyval";
import {
  PersistedClient,
  Persister,
} from "@tanstack/react-query-persist-client";

/**
 * Creates an IndexedDB persister for React Query's prewarmed cache feature.
 * Persists the entire query cache (queries, mutations, and their states) to browser storage.
 * On subsequent visits, the cache is restored before any components render, enabling
 * instant data display while revalidation occurs in the background.
 *
 * @param idbValidKey - Storage key for the persisted cache (default: "reactQuery")
 * @returns Persister implementation for PersistQueryClientProvider
 * @see https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API
 */
export function createIDBPersister(idbValidKey: IDBValidKey = "reactQuery") {
  return {
    persistClient: async (client: PersistedClient) => {
      await set(idbValidKey, client);
    },
    restoreClient: async () => {
      return await get<PersistedClient>(idbValidKey);
    },
    removeClient: async () => {
      await del(idbValidKey);
    },
  } satisfies Persister;
}
