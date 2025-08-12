// Passkey相关工具函数

// 工具函数：Base64URL转ArrayBuffer
export const base64urlToArrayBuffer = (base64url: string): ArrayBuffer => {
  const pad = '='.repeat((4 - base64url.length % 4) % 4);
  const base64 = (base64url.replace(/-/g, '+').replace(/_/g, '/')) + pad;
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
};

// 工具函数：ArrayBuffer转Base64URL
export const bufferToBase64url = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const base64 = btoa(binary);
  // 转为 base64url（去掉=、+ -> -、/ -> _）
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
};

// 工具函数：Base64URL转Uint8Array (保持兼容性)
export const base64urlToUint8Array = (base64urlString: string): Uint8Array => {
  const buffer = base64urlToArrayBuffer(base64urlString);
  return new Uint8Array(buffer);
};

// 安全的ArrayBuffer转换函数
export const safeToArrayBuffer = (value: any): ArrayBuffer => {
  if (value instanceof ArrayBuffer) {
    return value;
  }
  
  if (value instanceof Uint8Array) {
    return new Uint8Array(value).buffer;
  }
  
  if (typeof value === 'string') {
    return base64urlToArrayBuffer(value);
  }
  
  throw new Error(`无法将值转换为 ArrayBuffer: ${typeof value}`);
};

// 工具函数：Uint8Array转Base64 (保持兼容性)
export const uint8ArrayToBase64 = (bytes: Uint8Array): string => {
  const binaryString = String.fromCharCode(...bytes);
  return btoa(binaryString);
};

// 规范化请求选项
export const normalizeRequestOptions = (serverData: any) => {
  const publicKey = serverData.publicKey ?? serverData;

  console.log("规范化前的选项:", {
    challenge: typeof publicKey.challenge,
    user: publicKey.user ? {
      id: typeof publicKey.user.id,
      name: publicKey.user.name,
      displayName: publicKey.user.displayName
    } : null,
    rp: publicKey.rp
  });

  // challenge 必须是 ArrayBuffer
  if (typeof publicKey.challenge === 'string') {
    publicKey.challenge = base64urlToArrayBuffer(publicKey.challenge);
  }

  // user.id 必须是 ArrayBuffer
  if (publicKey.user && typeof publicKey.user.id === 'string') {
    publicKey.user.id = base64urlToArrayBuffer(publicKey.user.id);
  }

  // allowCredentials[*].id 也必须是 ArrayBuffer
  if (Array.isArray(publicKey.allowCredentials)) {
    publicKey.allowCredentials = publicKey.allowCredentials.map((cred: any) => {
      const copy = { ...cred };
      if (typeof copy.id === 'string') {
        copy.id = base64urlToArrayBuffer(copy.id);
      }
      return copy;
    });
  }

  console.log("规范化后的选项:", {
    challenge: typeof publicKey.challenge,
    user: publicKey.user ? {
      id: typeof publicKey.user.id,
      name: publicKey.user.name,
      displayName: publicKey.user.displayName
    } : null,
    rp: publicKey.rp
  });

  return publicKey;
};

// 专门用于扩展环境的选项处理
export const normalizeExtensionOptions = (serverData: any) => {
  const publicKey = normalizeRequestOptions(serverData);
  
  // 检查是否在扩展环境中
  const isExtension = window.location.protocol === 'chrome-extension:' || 
                     window.location.protocol === 'moz-extension:' ||
                     window.location.protocol === 'extension:';
  
  if (isExtension && publicKey.rp) {
    console.log("扩展环境检测到，调整 rp.id");
    console.log("原始 rp.id:", publicKey.rp.id);
    publicKey.rp.id = window.location.hostname;
    console.log("调整后的 rp.id:", publicKey.rp.id);
  }
  
  // 确保包含默认的算法标识符
  if (publicKey.pubKeyCredParams) {
    const hasES256 = publicKey.pubKeyCredParams.some((param: any) => param.alg === -7);
    const hasRS256 = publicKey.pubKeyCredParams.some((param: any) => param.alg === -257);
    
    if (!hasES256 || !hasRS256) {
      console.warn("pubKeyCredParams 缺少默认算法，添加 ES256 和 RS256");
      
      const defaultParams = [];
      
      if (!hasES256) {
        defaultParams.push({ type: "public-key", alg: -7 }); // ES256
      }
      
      if (!hasRS256) {
        defaultParams.push({ type: "public-key", alg: -257 }); // RS256
      }
      
      // 将默认参数添加到开头
      publicKey.pubKeyCredParams = [...defaultParams, ...publicKey.pubKeyCredParams];
    }
  }
  
  // 支持多种认证器类型，让用户选择
  if (!publicKey.authenticatorSelection) {
    publicKey.authenticatorSelection = {};
  }
  
  // 优先使用平台认证器（指纹/面容识别），但仍然允许其他选项
  publicKey.authenticatorSelection.authenticatorAttachment = "platform";
  
  // 设置其他选项
  publicKey.authenticatorSelection.requireResidentKey = true;
  publicKey.authenticatorSelection.userVerification = "preferred";
  
  console.log("认证器配置（优先平台认证器）:", publicKey.authenticatorSelection);
  
  return publicKey;
};

// 检查WebAuthn支持的详细函数
export const checkWebAuthnSupport = () => {
  const support = {
    hasPublicKeyCredential: typeof PublicKeyCredential !== 'undefined',
    hasCredentials: !!navigator.credentials,
    hasCreate: !!(navigator.credentials && navigator.credentials.create),
    hasGet: !!(navigator.credentials && navigator.credentials.get),
    isSecureContext: window.isSecureContext,
    isExtension: window.location.protocol === 'chrome-extension:' || 
                 window.location.protocol === 'moz-extension:' ||
                 window.location.protocol === 'extension:',
    userAgent: navigator.userAgent,
    platform: navigator.platform,
  };
  
  console.log("WebAuthn 支持检查:", support);
  return support;
}; 