export enum ProjectsQueryType {
  ticker = "ticker",
  twitter = "twitter",
  domain = "domain",
  name = "name",
  Id = "Id",
}

export interface ProjectsParams {
  type: ProjectsQueryType;
  value: string;
}

export type BloomFilterData = {
  [key in ProjectsQueryType]?: string;
};

export interface BloomFilterParams {
  type: ProjectsQueryType;
}

export interface BloomFilterType {
  filter: string;
  meta: {
    version: string;
    update_time: string;
  };
}
