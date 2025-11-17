// src/utils/fireDate.ts
import { Timestamp } from "firebase/firestore";

export const fireDate = (ts: unknown): string => {
  if (!ts && ts !== 0) return "-";

  try {
    // Firestore Timestamp
    if (ts instanceof Timestamp) return ts.toDate().toLocaleString();

    // JS Date
    if (ts instanceof Date) return ts.toLocaleString();

    // Object with .toDate()
    if (typeof ts === "object" && ts && "toDate" in (ts as any)) {
      return (ts as any).toDate().toLocaleString();
    }

    // number (seconds or ms)
    if (typeof ts === "number") {
      const asMs = ts > 1e10 ? ts : ts * 1000;
      return new Date(asMs).toLocaleString();
    }

    // string
    const parsed = Date.parse(String(ts));
    if (!Number.isNaN(parsed)) return new Date(parsed).toLocaleString();

    return String(ts);
  } catch {
    return "-";
  }
};
