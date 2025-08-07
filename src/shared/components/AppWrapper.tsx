import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
} from "react-router-dom";
import { Home, User, Test, About, Options } from "../pages";
import { AppMode } from "../types";
import { RainbowKitProvider } from "./RainbowKitProvider";
import "../styles/AppWrapper.css";

interface AppWrapperProps {
  mode: AppMode;
}

const AppWrapper: React.FC<AppWrapperProps> = ({ mode }) => {
  return (
    <RainbowKitProvider>
      <Router>
        <div
          className={`app-container ${
            mode === "popup" ? "popup-mode" : "sidepanel-mode"
          }`}
        >
          <div className="flex items-center p-4">
            <span
              className={`mode-badge ${
                mode === "popup" ? "popup-badge" : "sidepanel-badge"
              }`}
            >
              {mode === "popup" ? "弹窗模式" : "侧边栏模式"}
            </span>
            <Link to="/test">Test Page</Link>
          </div>
          <Routes>
            <Route path="/" element={<Home mode={mode} />} />
            <Route path="/user" element={<User mode={mode} />} />
            <Route path="/options" element={<Options mode={mode} />} />
            <Route path="/about" element={<About mode={mode} />} />
            <Route path="/test" element={<Test mode={mode} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </RainbowKitProvider>
  );
};

export default AppWrapper;
