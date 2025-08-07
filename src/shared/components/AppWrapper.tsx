import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Home, User, Options, About } from '../pages';
import { AppMode } from '../types';
import { RainbowKitProvider } from './RainbowKitProvider';
import '../styles/AppWrapper.css';

interface AppWrapperProps {
  mode: AppMode;
}

const AppWrapper: React.FC<AppWrapperProps> = ({ mode }) => {
  return (
    <RainbowKitProvider>
      <Router>
        <div className={`app-container ${mode === 'popup' ? 'popup-mode' : mode === 'sidepanel' ? 'sidepanel-mode' : 'options-mode'}`}>
          <div className="mode-indicator">
            <span className={`mode-badge ${mode === 'popup' ? 'popup-badge' : mode === 'sidepanel' ? 'sidepanel-badge' : 'options-badge'}`}>
              {mode === 'popup' ? '弹窗模式' : mode === 'sidepanel' ? '侧边栏模式' : '选项页面模式'}
            </span>
          </div>
          <Routes>
            <Route path="/" element={<Home mode={mode} />} />
            <Route path="/user" element={<User mode={mode} />} />
            <Route path="/options" element={<Options mode={mode} />} />
            <Route path="/about" element={<About mode={mode} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </RainbowKitProvider>
  );
};

export default AppWrapper; 