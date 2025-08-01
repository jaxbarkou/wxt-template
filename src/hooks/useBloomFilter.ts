import { ProjectsQueryType } from "@/modal";
import { useRootStore } from "@/store";
import { getBloomFilter } from "@/utils/api";
import { sha256 } from "@noble/hashes/sha2.js";
import { utf8ToBytes } from "@noble/hashes/utils";

export const useBloomFilter = () => {
  const setBloomFilterData = useRootStore((state) => state.setBloomFilterData);
  const bloomFilterData = useRootStore((state) => state.bloomFilterData);

  const fetchBloomFilter = useCallback(async () => {
    const queryList = [
      ProjectsQueryType.ticker,
      ProjectsQueryType.twitter,
      ProjectsQueryType.domain,
      ProjectsQueryType.name,
    ];
    try {
      const bd = await Promise.all(
        queryList.map((type) => getBloomFilter({ type }))
      );
      const formattedData = bd.reduce((acc, item, index) => {
        acc[queryList[index]] = item?.data?.filter || "";
        return acc;
      }, {} as Record<ProjectsQueryType, string>);

      setBloomFilterData(formattedData);
    } catch (error) {
      console.error("Error fetching bloom filter:", error);
    }
  }, []);

  const getHashes = (item: string, curBloomFilterData: string) => {
    // First hash: SHA256(item)
    const input = item.toLowerCase().trim();
    const hash1Bytes = sha256(utf8ToBytes(input));
    const hash1 =
      (hash1Bytes[0] << 24) |
      (hash1Bytes[1] << 16) |
      (hash1Bytes[2] << 8) |
      hash1Bytes[3];

    // Second hash: SHA256(item + "salt")
    const hash2Bytes = sha256(utf8ToBytes(input + "bloom_salt"));
    let hash2 =
      (hash2Bytes[0] << 24) |
      (hash2Bytes[1] << 16) |
      (hash2Bytes[2] << 8) |
      hash2Bytes[3];

    // Ensure hash2 is not zero
    if (hash2 === 0) {
      hash2 = 1;
    }
    const data = JSON.parse(curBloomFilterData);
    const size = data.size;
    const numHashes = data.numHashes;
    const hashes = [];
    for (let i = 0; i < numHashes; i++) {
      const hash = (hash1 + i * hash2) >>> 0; // Unsigned 32-bit
      hashes.push(hash % size);
    }
    return hashes;
  };

  const base64ToBytes = (base64: string): Uint8Array => {
    const binary = atob(base64);
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  };

  const testBloomFilter = useCallback(
    (item: string, type: ProjectsQueryType) => {
      let curItem = item.toLowerCase().trim();
      const hashes = getHashes(curItem, bloomFilterData[type] || "");
      const data = JSON.parse(bloomFilterData[type] || "{}");
      // const bitArray = Buffer.from(data.bitArray, "base64");
      const bitArray = base64ToBytes(data.bitArray);
      for (const hash of hashes) {
        const byteIndex = Math.floor(hash / 8);
        const bitIndex = hash % 8;
        if ((bitArray[byteIndex] & (1 << bitIndex)) === 0) {
          return false;
        }
      }
      return true;
    },
    [bloomFilterData]
  );

  return {
    fetchBloomFilter,
    testBloomFilter,
  };
};
