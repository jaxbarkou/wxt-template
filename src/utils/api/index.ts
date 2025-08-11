import request from "@/utils/request";
import { 
  BloomFilterParams, 
  BloomFilterType, 
  ProjectsParams
} from "@/modal";

export const getProjectsLookup = (params: ProjectsParams) => {
  return request<any>({
    url: `/projects/lookup`,
    method: "GET",
    params,
  });
};

export const getBloomFilter = (params: BloomFilterParams) => {
  return request<BloomFilterType>({
    url: `/whitelist/bloom-filter`,
    method: "GET",
    params,
  });
};
