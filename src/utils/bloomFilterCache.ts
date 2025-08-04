import { ProjectsQueryType } from "@/modal";
import { getBloomFilter } from "@/utils/api";
import { sha256 } from "@noble/hashes/sha2.js";
import { utf8ToBytes } from "@noble/hashes/utils";

// 缓存配置
const CACHE_DURATION = 100 * 60 * 1000; // 100分钟缓存
const CACHE_KEY = 'bloomFilterData';
const TIMESTAMP_KEY = 'bloomFilterTimestamp';

// 获取哈希值
const getHashes = (item: string, curBloomFilterData: string) => {
  const input = item.toLowerCase().trim();
  const hash1Bytes = sha256(utf8ToBytes(input));
  const hash1 =
    (hash1Bytes[0] << 24) |
    (hash1Bytes[1] << 16) |
    (hash1Bytes[2] << 8) |
    hash1Bytes[3];

  const hash2Bytes = sha256(utf8ToBytes(input + "bloom_salt"));
  let hash2 =
    (hash2Bytes[0] << 24) |
    (hash2Bytes[1] << 16) |
    (hash2Bytes[2] << 8) |
    hash2Bytes[3];

  if (hash2 === 0) {
    hash2 = 1;
  }
  
  const data = JSON.parse(curBloomFilterData);
  const size = data.size;
  const numHashes = data.numHashes;
  const hashes = [];
  
  for (let i = 0; i < numHashes; i++) {
    const hash = (hash1 + i * hash2) >>> 0;
    hashes.push(hash % size);
  }
  return hashes;
};

// Base64 转字节数组
const base64ToBytes = (base64: string): Uint8Array => {
  const binary = atob(base64);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
};

// 获取 Bloom Filter 数据（带缓存）
export const fetchBloomFilterWithCache = async (): Promise<Record<ProjectsQueryType, string>> => {
  console.log('=== 开始获取 Bloom Filter 数据 ===');
  
  try {
    // 1. 尝试从 chrome.storage 获取缓存
    const result = await chrome.storage.local.get([CACHE_KEY, TIMESTAMP_KEY]);
    
    if (result[CACHE_KEY] && result[TIMESTAMP_KEY]) {
      const age = Date.now() - result[TIMESTAMP_KEY];
      if (age < CACHE_DURATION) {
        console.log('使用 chrome.storage 缓存的 Bloom Filter 数据');
        console.log('缓存数据大小:', JSON.stringify(result[CACHE_KEY]).length, 'bytes');
        return result[CACHE_KEY];
      }
    }

    // 2. 缓存不存在或已过期，重新获取数据
    console.log('重新获取 Bloom Filter 数据');
    const freshData = await fetchFreshBloomFilterData();
    
    // 3. 保存到 chrome.storage
    await chrome.storage.local.set({
      [CACHE_KEY]: freshData,
      [TIMESTAMP_KEY]: Date.now()
    });
    
    console.log('Bloom Filter 数据已缓存到 chrome.storage');
    return freshData;
  } catch (error) {
    console.error('获取 Bloom Filter 数据失败:', error);
    
    // 4. 如果获取失败，尝试使用过期缓存
    try {
      const result = await chrome.storage.local.get([CACHE_KEY]);
      if (result[CACHE_KEY]) {
        console.log('使用过期的 chrome.storage 缓存数据作为备用');
        return result[CACHE_KEY];
      }
    } catch (fallbackError) {
      console.error('获取备用缓存失败:', fallbackError);
    }
    
    console.log('没有备用缓存，返回空数据');
    return null as any;
  }
};

// 获取新鲜数据
const fetchFreshBloomFilterData = async (): Promise<Record<ProjectsQueryType, string>> => {
  const queryList = [
    ProjectsQueryType.ticker,
    // ProjectsQueryType.twitter,
    ProjectsQueryType.domain,
    ProjectsQueryType.name,
  ];
  
  const responses = await Promise.all(
    queryList.map((type) => getBloomFilter({ type }))
  );
  
  const formattedData = responses.reduce((acc, item, index) => {
    acc[queryList[index]] = item?.data?.filter || "";
    return acc;
  }, {} as Record<ProjectsQueryType, string>);
  return formattedData;
};

// 清除缓存
export const clearBloomFilterCache = async (): Promise<void> => {
  try {
    await chrome.storage.local.remove([CACHE_KEY, TIMESTAMP_KEY]);
    console.log('Bloom Filter 缓存已清除');
  } catch (error) {
    console.error('清除缓存失败:', error);
  }
};

// 获取缓存状态
export const getCacheStatus = async (): Promise<{
  hasCache: boolean;
  isValid: boolean;
  age: number;
}> => {
  try {
    const result = await chrome.storage.local.get([CACHE_KEY, TIMESTAMP_KEY]);
    if (!result[CACHE_KEY] || !result[TIMESTAMP_KEY]) {
      return { hasCache: false, isValid: false, age: 0 };
    }
    
    const age = Date.now() - result[TIMESTAMP_KEY];
    return {
      hasCache: true,
      isValid: age < CACHE_DURATION,
      age
    };
  } catch (error) {
    console.error('获取缓存状态失败:', error);
    return { hasCache: false, isValid: false, age: 0 };
  }
};

// Bloom Filter 测试函数
export const testBloomFilter = async (
  item: string, 
  type: ProjectsQueryType
): Promise<boolean> => {
  try {
    // 获取缓存数据
    const result = await chrome.storage.local.get([CACHE_KEY]);
    const bloomFilterData = result[CACHE_KEY] || {};
    
    const curItem = item.toLowerCase().trim();
    const hashes = getHashes(curItem, bloomFilterData[type] || "");
    const data = JSON.parse(bloomFilterData[type] || "{}");
    
    if (!data.bitArray || !data.size || !data.numHashes) {
      console.warn('Bloom Filter 数据格式不正确');
      return false;
    }
    
    const bitArray = base64ToBytes(data.bitArray);
    for (const hash of hashes) {
      const byteIndex = Math.floor(hash / 8);
      const bitIndex = hash % 8;
      if ((bitArray[byteIndex] & (1 << bitIndex)) === 0) {
        return false;
      }
    }
    return true;
  } catch (error) {
    console.error('Bloom Filter 测试失败:', error);
    return false;
  }
};

// 获取当前缓存数据（用于调试）
export const getCurrentCache = async () => {
  try {
    const result = await chrome.storage.local.get([CACHE_KEY, TIMESTAMP_KEY]);
    return {
      data: result[CACHE_KEY] || {},
      timestamp: result[TIMESTAMP_KEY] || 0
    };
  } catch (error) {
    console.error('获取当前缓存失败:', error);
    return null;
  }
}; 