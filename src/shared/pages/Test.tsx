import React from 'react';
import { Link } from 'react-router-dom';
import { PageProps } from '../types';
import { PasskeyTest } from "@/shared/components";

const Test: React.FC<PageProps> = ({ mode }) => {
  return (
    <div className={`w-full ${mode === 'popup' ? 'p-4' : 'p-8'}`}>
      <Link to="/">返回</Link>
      <h1 className="text-2xl font-bold mb-6">Passkey 功能测试页面</h1>
      
      {/* Sidepanel环境特殊提示 */}
      {mode === 'sidepanel' && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="font-semibold text-yellow-800 mb-2">⚠️ Sidepanel 环境限制</h3>
          <p className="text-sm text-yellow-700 mb-3">
            Sidepanel 环境中的 WebAuthn 功能受到浏览器限制，建议在其他环境中测试：
          </p>
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
      
      <div className="space-y-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Passkey 功能测试</h2>
          <p className="text-gray-600 mb-4">
            测试完整的Passkey注册和登录流程，包括与后端API的交互。
            支持多种认证器类型，优先使用平台认证器（指纹/面容识别）。
          </p>
          <PasskeyTest />
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-bold mb-2">测试说明：</h3>
          <ul className="text-sm space-y-1">
            <li>• <strong>Sidepanel 环境</strong>：WebAuthn 功能受到浏览器限制，无法正常使用</li>
            <li>• <strong>Popup 环境</strong>：可以正常使用 WebAuthn 功能</li>
            <li>• <strong>Options 页面</strong>：独立标签页环境，最适合测试 WebAuthn</li>
            <li>• <strong>Content Script</strong>：在支持 HTTPS 的网页中测试</li>
            <li>• <strong>平台认证器</strong>：优先使用指纹/面容识别，更安全便捷</li>
            <li>• <strong>跨平台认证器</strong>：支持手机扫码、USB密钥等</li>
            <li>• 确保设备支持 Passkey（如 Touch ID、Face ID 等）</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Test;
