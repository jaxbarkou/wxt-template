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
