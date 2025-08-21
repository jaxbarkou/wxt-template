import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { useEffect } from "react";
import {
  Home,
  User,
  Test,
  About,
  Options,
  Login,
  TopUp,
  TopUpDetail,
  Settings,
  Search,
} from "../pages";
import { AppMode } from "../types";
import { RainbowKitProvider } from "./RainbowKitProvider";
import { ModeProvider } from "../context/ModeProvider";
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
    <ModeProvider mode={mode}>
      <RainbowKitProvider>
        <Router>
          <NavigationHandler />
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/user" element={<User />} />
              <Route path="/options" element={<Options />} />
              <Route path="/about" element={<About />} />
              <Route path="/test" element={<Test />} />
              <Route path="/login" element={<Login />} />
              <Route path="/top-up" element={<TopUp />} />
              <Route path="/top-up-detail" element={<TopUpDetail />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/search" element={<Search />} />
              {/* 其他路由 */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        </Router>
      </RainbowKitProvider>
    </ModeProvider>
  );
};

export default AppWrapper;
