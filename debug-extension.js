// 扩展程序调试脚本
// 在浏览器控制台中运行此脚本来检查扩展程序状态

console.log('=== Yomo Extension Debug Script ===');

// 检查扩展程序是否已安装
if (typeof chrome !== 'undefined' && chrome.runtime) {
  console.log('✅ Chrome extension API available');
  
  // 检查扩展程序ID
  const extensionId = chrome.runtime.id;
  console.log('📋 Extension ID:', extensionId);
  
  // 检查扩展程序信息
  chrome.management.getSelf((info) => {
    console.log('📦 Extension Info:', info);
    console.log('🔧 Version:', info.version);
    console.log('📝 Description:', info.description);
    console.log('🚫 Disabled:', info.disabled);
    console.log('⚠️  Errors:', info.errors);
  });
  
  // 检查权限
  chrome.permissions.getAll((permissions) => {
    console.log('🔐 Permissions:', permissions);
  });
  
  // 检查存储
  chrome.storage.local.get(null, (items) => {
    console.log('💾 Local Storage:', items);
  });
  
  // 检查运行时错误
  chrome.runtime.getPlatformInfo((platformInfo) => {
    console.log('🖥️  Platform Info:', platformInfo);
  });
  
} else {
  console.log('❌ Chrome extension API not available');
}

// 检查网络连接
fetch('https://xisipa-dev.sparklayer.xyz/auth/alia/api/health', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  },
})
.then(response => {
  console.log('🌐 API Health Check:', response.status, response.statusText);
  return response.json();
})
.catch(error => {
  console.log('❌ API Connection Error:', error.message);
});

// 检查控制台错误
const originalError = console.error;
console.error = function(...args) {
  console.log('🚨 Console Error:', ...args);
  originalError.apply(console, args);
};

console.log('🔍 Debug script loaded. Check the console for extension status.'); 