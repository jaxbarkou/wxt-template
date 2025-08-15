import { Link } from "react-router-dom";
import { useMode } from "../context/ModeProvider";
const About: React.FC = () => {
  const { mode } = useMode();
  return (
    <div className={`w-full ${mode === 'options' ? 'p-6' : 'p-4'}`}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">关于 WXT Extension</h1>
        
        {/* 扩展信息卡片 */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20 mb-8">
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl font-bold">WXT</span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">WXT Extension</h2>
            <p className="text-white/80">版本 1.0.0</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">功能特性</h3>
              <ul className="space-y-2 text-white/90">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                  智能页面检测
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                  关键词高亮
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                  钱包连接
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                  侧边栏工具
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                  数据同步
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">技术信息</h3>
              <div className="space-y-2 text-white/90">
                <div>
                  <span className="font-medium">框架:</span>
                  <span className="ml-2">WXT + React + TypeScript</span>
                </div>
                <div>
                  <span className="font-medium">UI库:</span>
                  <span className="ml-2">Tailwind CSS</span>
                </div>
                <div>
                  <span className="font-medium">钱包:</span>
                  <span className="ml-2">RainbowKit + WalletConnect</span>
                </div>
                <div>
                  <span className="font-medium">许可证:</span>
                  <span className="ml-2">MIT</span>
                </div>
                <div>
                  <span className="font-medium">开发者:</span>
                  <span className="ml-2">WXT Extension Team</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* 更新日志 */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 mb-8">
          <h3 className="text-xl font-semibold text-white mb-4">更新日志</h3>
          <div className="space-y-4">
            <div>
              <h4 className="text-white font-medium">v1.0.0 (2024-01-01)</h4>
              <ul className="text-white/80 text-sm mt-2 space-y-1">
                <li>• 初始版本发布</li>
                <li>• 支持页面检测和关键词高亮</li>
                <li>• 集成WalletConnect钱包连接</li>
                <li>• 添加侧边栏和弹窗界面</li>
                <li>• 实现右键菜单功能</li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* 导航链接 */}
        <div className="flex flex-wrap gap-4">
          <Link to="/" className="text-blue-300 hover:text-blue-200 transition-colors">
            返回首页
          </Link>
          <Link to="/user" className="text-blue-300 hover:text-blue-200 transition-colors">
            用户页面
          </Link>
          <Link to="/options" className="text-blue-300 hover:text-blue-200 transition-colors">
            设置页面
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About; 