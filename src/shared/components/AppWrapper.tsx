import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Home, User } from '../pages';
import { AppMode } from '../types';
import '../styles/AppWrapper.css';

interface AppWrapperProps {
  mode: AppMode;
}

const AppWrapper: React.FC<AppWrapperProps> = ({ mode }) => {
  return (
    <Router>
      <div className={`app-container ${mode === 'popup' ? 'popup-mode' : 'sidepanel-mode'}`}>
        <div className="mode-indicator">
          <span className={`mode-badge ${mode === 'popup' ? 'popup-badge' : 'sidepanel-badge'}`}>
            {mode === 'popup' ? '弹窗模式' : '侧边栏模式'}
          </span>
        </div>
        <Routes>
          <Route path="/" element={<Home mode={mode} />} />
          <Route path="/user" element={<User mode={mode} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
};

export default AppWrapper; 