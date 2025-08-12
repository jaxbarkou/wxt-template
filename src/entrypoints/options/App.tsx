import React from 'react';
import AppWrapper from "@/shared/components/AppWrapper";
import { PasskeyTest, WebAuthnTest } from "@/shared/components";
import "@/assets/style/globals.css";

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8 text-center">扩展设置</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <AppWrapper mode="options" />
          </div>
          
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-4">Passkey 功能测试</h2>
              <p className="text-gray-600 mb-4">
                Options页面运行在独立标签页中，WebAuthn限制较少，更适合测试Passkey功能。
              </p>
              <PasskeyTest />
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <WebAuthnTest />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App; 