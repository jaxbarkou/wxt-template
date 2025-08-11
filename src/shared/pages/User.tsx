import { useState } from "react";
import { Link } from "react-router-dom";
import { PageProps } from "../types";
import { WalletButtonCustom } from "../components/WalletButtonCustom";
import { loginWithPasskey, registerPasskey } from "@/lib/api/passkey";

const User: React.FC<PageProps> = ({ mode }) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loginStatus, setLoginStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: "" });
  
  const [registerStatus, setRegisterStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: "" });

  // Passkey登录处理
  const handlePasskeyLogin = async () => {
    if (!email) {
      setLoginStatus({ type: 'error', message: '请输入邮箱地址' });
      return;
    }

    setIsLoading(true);
    setLoginStatus({ type: null, message: "" });

    try {
      const result = await loginWithPasskey(email);
      setLoginStatus({ type: 'success', message: result.message });
      setEmail("");
    } catch (error) {
      console.error('Passkey登录错误:', error);
      setLoginStatus({ 
        type: 'error', 
        message: error instanceof Error ? error.message : '登录失败，请重试' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Passkey注册处理
  const handlePasskeyRegister = async () => {
    if (!email) {
      setRegisterStatus({ type: 'error', message: '请输入邮箱地址' });
      return;
    }

    setIsLoading(true);
    setRegisterStatus({ type: null, message: "" });

    try {
      await registerPasskey(email);
      setRegisterStatus({ type: 'success', message: 'Passkey注册成功！' });
      setEmail("");
    } catch (error) {
      console.error('Passkey注册错误:', error);
      setRegisterStatus({ 
        type: 'error', 
        message: error instanceof Error ? error.message : '注册失败，请重试' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 检查浏览器是否支持Passkey
  const isPasskeySupported = () => {
    const hasPublicKeyCredential = !!window.PublicKeyCredential;
    const hasUserVerifyingPlatformAuthenticator = !!window.PublicKeyCredential?.isUserVerifyingPlatformAuthenticatorAvailable;
    const hasConditionalMediation = !!window.PublicKeyCredential?.isConditionalMediationAvailable;
    
    console.log('Passkey支持检查:', {
      hasPublicKeyCredential,
      hasUserVerifyingPlatformAuthenticator,
      hasConditionalMediation
    });
    
    return hasPublicKeyCredential && hasUserVerifyingPlatformAuthenticator && hasConditionalMediation;
  };

  return (
    <div className={`w-full ${mode === 'popup' ? 'p-4' : 'p-2'}`}>
      <h2 className="mb-4 text-xl font-bold">User Page</h2>
      <p className="mb-4">当前模式: {mode}</p>
      
      {/* Passkey登录区域 */}
      <div className="p-4 mb-6 border rounded-lg bg-gray-50">
        <h3 className="mb-3 text-lg font-semibold">Passkey 登录/注册</h3>
        
        {!isPasskeySupported() ? (
          <div className="mb-3 text-red-600">
            您的浏览器不支持 Passkey，请使用支持 WebAuthn 的现代浏览器。
          </div>
        ) : (
          <>
            <div className="mb-3">
              <label className="block mb-1 text-sm font-medium">邮箱地址</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="请输入邮箱地址"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              />
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={handlePasskeyLogin}
                disabled={isLoading || !email}
                className="flex-1 px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isLoading ? '登录中...' : '登录'}
              </button>
              
              <button
                onClick={handlePasskeyRegister}
                disabled={isLoading || !email}
                className="flex-1 px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isLoading ? '注册中...' : '注册'}
              </button>
            </div>
            
            {loginStatus.type && (
              <div className={`mt-3 p-2 rounded-md ${
                loginStatus.type === 'success' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              }`}>
                {loginStatus.message}
              </div>
            )}
            
            {registerStatus.type && (
              <div className={`mt-3 p-2 rounded-md ${
                registerStatus.type === 'success' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              }`}>
                {registerStatus.message}
              </div>
            )}
          </>
        )}
      </div>
      
      {/* 钱包连接组件 */}
      <div className="mb-6">
        <h3 className="mb-3 text-lg font-semibold">钱包连接</h3>
        <WalletButtonCustom mode={mode} showDetails={true} />
      </div>
      
      {/* 导航链接 */}
      <div className="flex space-x-4">
        <Link to="/" className="text-blue-600 hover:text-blue-800">跳转到 Home</Link>
        <Link to="/user" className="text-blue-600 hover:text-blue-800">跳转到 User</Link>
      </div>
    </div>
  );
};

export default User; 