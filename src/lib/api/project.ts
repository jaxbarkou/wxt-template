import request, { base6Api } from "@/lib/request";
import { ProjectData,QueryProjectData } from "@/modal/project";
import { SearchResult } from "@/modal/searchResult";
export const projectSearch = (search: string) => {
  ///nauth/alia
  return request<SearchResult>(base6Api, {
    url: `/api/v1/project/search`,
    method: "GET",
    params: {
        search,
    },
  });
};

export const projectData = (par: QueryProjectData) => {
    console.log("base6Api",base6Api);
  return request<ProjectData>(base6Api, {
    url: `/api/v1/project/project_data`,
    method: "POST",
    data: par,
  });
};
