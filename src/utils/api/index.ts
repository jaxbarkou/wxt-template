import request from "@/utils/request";
import { ProjectsParams } from "@/modal";

export const getProjectsLookup = (params: ProjectsParams) => {
  return request<any>({
    url: `/projects/lookup`,
    method: "GET",
    params,
  });
};
