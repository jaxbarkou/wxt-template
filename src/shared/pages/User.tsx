import { Link } from "react-router-dom";
import { PageProps } from "../types";
import { WalletButtonCustom } from "../components/WalletButtonCustom";

const User: React.FC<PageProps> = ({ mode }) => {
  return (
    <div className={`w-full ${mode === 'popup' ? 'p-4' : 'p-2'}`}>
      <h2 className="mb-4 text-xl font-bold">User Page</h2>
      <p className="mb-4">当前模式: {mode}</p>
      
      {/* 钱包连接组件 */}
      <WalletButtonCustom mode={mode} showDetails={true} />
      
      {/* 导航链接 */}
      <div className="flex space-x-4">
        <Link to="/" className="text-blue-600 hover:text-blue-800">跳转到 Home</Link>
        <Link to="/user" className="text-blue-600 hover:text-blue-800">跳转到 User</Link>
      </div>
    </div>
  );
};

export default User; 