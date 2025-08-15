import { Link } from "react-router-dom";
import { WalletButtonCustom } from "../components/WalletButtonCustom";
import { useMode } from "../context/ModeProvider";
const Options: React.FC = () => {
  const { mode } = useMode();

  return (
    <div className={`w-full ${mode === 'options' ? 'p-6' : 'p-4'}`}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">扩展设置</h1>
        
        {/* 设置卡片 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* 钱包连接设置 */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <h2 className="text-xl font-semibold text-white mb-4">钱包连接</h2>
            <WalletButtonCustom showDetails={true} />
          </div>
          
          {/* 扩展信息 */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <h2 className="text-xl font-semibold text-white mb-4">扩展信息</h2>
            <div className="space-y-3 text-white/90">
              <div>
                <span className="font-medium">版本:</span>
                <span className="ml-2">1.0.0</span>
              </div>
              <div>
                <span className="font-medium">开发者:</span>
                <span className="ml-2">WXT Extension Team</span>
              </div>
              <div>
                <span className="font-medium">许可证:</span>
                <span className="ml-2">MIT</span>
              </div>
              <div>
                <span className="font-medium">当前模式:</span>
                <span className="ml-2 capitalize">{mode}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* 功能设置 */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">功能设置</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-medium">自动检测页面</h3>
                <p className="text-white/70 text-sm">自动检测并处理页面内容</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-medium">关键词高亮</h3>
                <p className="text-white/70 text-sm">在页面中高亮显示关键词</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-medium">数据同步</h3>
                <p className="text-white/70 text-sm">跨设备同步设置和数据</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
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
        </div>
      </div>
    </div>
  );
};

export default Options; 