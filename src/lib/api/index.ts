import request, { baseApi } from "@/lib/request";

import { BloomFilterParams, BloomFilterType, ProjectsParams } from "@/modal";

export const getProjectsLookup = (params: ProjectsParams) => {
  return request<any>(baseApi, {
    url: `/projects/lookup`,
    method: "GET",
    params,
  });
};

export const getBloomFilter = (params: BloomFilterParams) => {
  return request<BloomFilterType>(baseApi, {
    url: `/whitelist/bloom-filter`,
    method: "GET",
    params,
  });
};
