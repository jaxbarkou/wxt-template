import React, { useState } from 'react';
import { registerPasskey, loginWithPasskey } from '@/lib/api/passkey';

const PasskeyContentScript: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const testEnvironment = () => {
    const envInfo = {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      isSecureContext: window.isSecureContext,
      location: window.location.href,
      protocol: window.location.protocol,
      hostname: window.location.hostname,
      hasCredentials: !!navigator.credentials,
      hasCreate: !!(navigator.credentials && navigator.credentials.create),
      hasGet: !!(navigator.credentials && navigator.credentials.get),
      isExtension: window.location.protocol === 'chrome-extension:' || 
                   window.location.protocol === 'moz-extension:' ||
                   window.location.protocol === 'extension:',
    };

    setResult(JSON.stringify(envInfo, null, 2));
  };

  const handleRegister = async () => {
    if (!username.trim()) {
      setResult('请输入用户名');
      return;
    }

    setLoading(true);
    setResult('正在注册 Passkey...');

    try {
      const response = await registerPasskey(username);
      setResult(`注册成功: ${JSON.stringify(response, null, 2)}`);
    } catch (error) {
      setResult(`注册失败: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!email.trim()) {
      setResult('请输入邮箱');
      return;
    }

    setLoading(true);
    setResult('正在登录...');

    try {
      const response = await loginWithPasskey(email);
      setResult(`登录成功: ${JSON.stringify(response, null, 2)}`);
    } catch (error) {
      setResult(`登录失败: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isVisible) {
    return (
      <div 
        className="fixed top-4 right-4 z-9999 cursor-pointer"
        onClick={() => setIsVisible(true)}
      >
        <div className="bg-blue-500 text-white p-2 rounded-full shadow-lg">
          🔑
        </div>
      </div>
    );
  }

  return (
    <div className="fixed top-4 right-4 z-9999 bg-white border rounded-lg shadow-lg p-4 max-w-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">Passkey 测试</h3>
        <button 
          onClick={() => setIsVisible(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>
      
      <div className="space-y-4">
        <button
          onClick={testEnvironment}
          className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm"
        >
          检测环境
        </button>

        <div className="space-y-2">
          <label className="block text-sm font-medium">用户名 (注册用):</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
            placeholder="输入用户名"
          />
        </div>

        <button
          onClick={handleRegister}
          disabled={loading}
          className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50 text-sm"
        >
          {loading ? '注册中...' : '注册 Passkey'}
        </button>

        <div className="space-y-2">
          <label className="block text-sm font-medium">邮箱 (登录用):</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
            placeholder="输入邮箱"
          />
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 disabled:opacity-50 text-sm"
        >
          {loading ? '登录中...' : '登录 Passkey'}
        </button>

        <div className="mt-4">
          <label className="block text-sm font-medium mb-2">结果:</label>
          <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto max-h-32">
            {result || '点击按钮开始测试...'}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default PasskeyContentScript; 