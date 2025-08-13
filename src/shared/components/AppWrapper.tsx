import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
  useNavigate,
} from "react-router-dom";
import { useEffect } from "react";
import { Home, User, Test, About, Options, Login } from "../pages";
import { AppMode } from "../types";
import { RainbowKitProvider } from "./RainbowKitProvider";
import Layout from "./Layout";
import "../styles/AppWrapper.css";

interface AppWrapperProps {
  mode: AppMode;
}

// 导航组件
const NavigationHandler: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleMessage = (message: any) => {
      if (message.type === "NAVIGATE_TO_PAGE") {
        const { page } = message;
        switch (page) {
          case "user":
            navigate("/user");
            break;
          case "about":
            navigate("/about");
            break;
          case "options":
            navigate("/options");
            break;
          default:
            navigate("/");
        }
      }
    };

    // 监听来自background的消息
    chrome.runtime.onMessage.addListener(handleMessage);

    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage);
    };
  }, [navigate]);

  return null;
};

const AppWrapper: React.FC<AppWrapperProps> = ({ mode }) => {
  return (
    <RainbowKitProvider>
      <Router>
        <NavigationHandler />
        <Layout mode={mode}>
          <Routes>
            <Route path="/" element={<Home mode={mode} />} />
            <Route path="/user" element={<User mode={mode} />} />
            <Route path="/options" element={<Options mode={mode} />} />
            <Route path="/about" element={<About mode={mode} />} />
            <Route path="/test" element={<Test mode={mode} />} />
            <Route path="/login" element={<Login mode={mode} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </Router>
    </RainbowKitProvider>
  );
};

export default AppWrapper;
