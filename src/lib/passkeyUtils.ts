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

// 工具函数：Uint8Array转Base64 (保持兼容性)
export const uint8ArrayToBase64 = (bytes: Uint8Array): string => {
  const binaryString = String.fromCharCode(...bytes);
  return btoa(binaryString);
};

// 规范化请求选项
export const normalizeRequestOptions = (serverData: any) => {
  const publicKey = serverData.publicKey ?? serverData;

  // challenge 必须是 ArrayBuffer
  if (typeof publicKey.challenge === 'string') {
    publicKey.challenge = base64urlToArrayBuffer(publicKey.challenge);
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

  return publicKey;
}; 