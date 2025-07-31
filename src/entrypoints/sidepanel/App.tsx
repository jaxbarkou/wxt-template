import { useState, useEffect, useCallback } from "react";
import "./App.css";
import "@/assets/style/globals.css";
import { ProjectsQueryType } from "@/modal";
import { getProjectsLookup } from "@/utils/api";

const App: React.FC = () => {
  const [projectsData, setProjectsData] = useState(null);
  const fetchData = useCallback(async () => {
    try {
      const params = {
        type: ProjectsQueryType.twitter,
        value: "bitcoin",
      };
      const response = await getProjectsLookup(params);
      if (response.code === 200) {
        console.log("Fetched projects data:", response);
        setProjectsData(response.data);
      }
    } catch (error) {
      console.error("Error fetching wallets:", error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <div>
        <pre className="flex justify-start p-4 overflow-auto text-sm text-left text-white bg-gray-900">
          {JSON.stringify(projectsData, null, 2)}
        </pre>
      </div>
    </>
  );
};

export default App;
