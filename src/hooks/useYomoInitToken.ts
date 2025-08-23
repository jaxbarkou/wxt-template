import { useEffect, useState } from "react";

export function useYomoInitToken() {
  const [tokenTimestamp, setTokenTimestamp] = useState<string | null>(
    typeof window !== "undefined" ? localStorage.getItem("yomoInitToken") : null
  );

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "yomoInitToken") {
        setTokenTimestamp(e.newValue);
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return tokenTimestamp;
}
