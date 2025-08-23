import { projectData as getProjectData } from "@/lib/api/project";
export const fetchProject = async (symbol: string) => {
  try {
    if (symbol) {
      const response = await getProjectData({
        ticker: symbol,
      });
      return response;
    }
  } catch (error) {
    console.log(error);
  }
};
