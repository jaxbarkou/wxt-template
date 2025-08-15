import { useState } from "react";
import { Link } from "react-router-dom";
import { WalletButtonCustom } from "../components/WalletButtonCustom";
import { PasskeyTest } from "../components";
import { loginWithPasskey, registerPasskey } from "@/lib/api/passkey";
import React from 'react';
import { useMode } from '../context/ModeProvider';

const User: React.FC = () => {
  const { mode } = useMode();
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
      
      {/* 打开Popup按钮 */}
      <div className="mb-4">
        <button
          onClick={() => {
            try {
              // 尝试打开popup
              if (chrome.action && typeof chrome.action.openPopup === "function") {
                chrome.action.openPopup();
              } else {
                // 备用方案：显示提示
                alert("请点击扩展图标打开弹窗");
              }
            } catch (error) {
              console.log("打开popup失败:", error);
              alert("请点击扩展图标打开弹窗");
            }
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          打开 Popup 弹窗
        </button>
      </div>
      
      {/* Passkey登录区域 */}
      <div className="p-4 mb-6 border rounded-lg bg-gray-50">
        <h3 className="mb-3 text-lg font-semibold">Passkey 登录/注册</h3>
        
        {/* Sidepanel环境特殊提示 */}
        {mode === 'sidepanel' && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Sidepanel 环境限制</h4>
            <p className="text-sm text-yellow-700 mb-2">
              Sidepanel 环境中的 WebAuthn 功能受到浏览器限制，建议：
            </p>
            <ul className="text-sm text-yellow-700 space-y-1 mb-3">
              <li>• 点击上方"打开 Popup 弹窗"按钮在弹窗中测试</li>
              <li>• 或在扩展的 Options 页面中测试</li>
              <li>• 或在支持 HTTPS 的网页中使用 content script</li>
            </ul>
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  try {
                    if (chrome.action && typeof chrome.action.openPopup === "function") {
                      chrome.action.openPopup();
                    } else {
                      alert("请点击扩展图标打开弹窗");
                    }
                  } catch (error) {
                    alert("请点击扩展图标打开弹窗");
                  }
                }}
                className="px-3 py-1 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700"
              >
                在 Popup 中测试
              </button>
              <button
                onClick={() => {
                  try {
                    chrome.runtime.openOptionsPage();
                  } catch (error) {
                    alert("请手动打开扩展设置页面");
                  }
                }}
                className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
              >
                打开 Options 页面
              </button>
            </div>
          </div>
        )}
        
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
        <WalletButtonCustom showDetails={true} />
      </div>
      
      {/* 导航链接 */}
      <div className="flex space-x-4">
        <Link to="/" className="text-blue-600 hover:text-blue-800">跳转到 Home</Link>
        <Link to="/user" className="text-blue-600 hover:text-blue-800">跳转到 User</Link>
      </div>
      
      {/* Passkey 测试组件 */}
      <div className="mt-8 p-4 border rounded-lg bg-yellow-50">
        <h3 className="mb-4 text-lg font-semibold text-yellow-800">Passkey 调试工具</h3>
        <PasskeyTest />
      </div>
    </div>
  );
};

export default User; 