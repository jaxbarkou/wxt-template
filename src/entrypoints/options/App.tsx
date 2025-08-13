import React from 'react';
import AppWrapper from "@/shared/components/AppWrapper";
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
        </div>
      </div>
    </div>
  );
};

export default App; 