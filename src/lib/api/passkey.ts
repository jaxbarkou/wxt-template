import request, { base2Api,base3Api } from "@/lib/request";
import {
  PasskeyLoginStartParams,
  PasskeyLoginFinishParams,
  PasskeyRegisterStartParams,
  PasskeyRegisterFinishParams,
} from "@/modal";
import {
  base64urlToUint8Array,
  uint8ArrayToBase64,
  normalizeRequestOptions,
  normalizeExtensionOptions,
  bufferToBase64url,
  checkWebAuthnSupport,
} from "@/lib/passkeyUtils";

// 获取Passkey登录信息 (登录前 - user_na/v1)
export const getPasskeyLoginInfo = (params: PasskeyLoginStartParams) => {
  return request<any>(base2Api, {
    url: `/lg/login/start`,
    method: "POST",
    data: params,
  });
};

// Passkey登录 (登录前 - user_na/v1)
export const passkeyLogin = (params: PasskeyLoginFinishParams) => {
  return request<any>(base2Api, {
    url: `/passkey/login/finish`,
    method: "POST",
    data: params,
  });
};

// 获取Passkey注册信息 (登录后 - user_a/v1)
export const getPasskeyRegisterInfo = (params: PasskeyRegisterStartParams) => {
  return request<any>(base3Api, {
    url: `/user/register/start`,
    method: "POST",
    data: params,
  });
};

// 完成Passkey注册 (登录后 - user_a/v1)
export const finishPasskeyRegister = (params: PasskeyRegisterFinishParams) => {
  return request<any>(base3Api, {
    url: `/user/register/finish`,
    method: "POST",
    data: params,
  });
};

// 完整的Passkey登录流程
export const loginWithPasskey = async (email: string) => {
  try {
    // 环境检测
    console.log("=== Passkey 登录环境检测 ===");
    const support = checkWebAuthnSupport();
    
    if (!support.hasCredentials) {
      throw new Error("浏览器不支持 WebAuthn API (navigator.credentials 不存在)");
    }
    
    if (!support.hasGet) {
      throw new Error("浏览器不支持 WebAuthn 获取功能");
    }
    
    if (!support.isSecureContext) {
      throw new Error("Passkey 需要在安全上下文 (HTTPS 或 localhost) 中使用");
    }
    
    if (support.isExtension) {
      console.warn("警告: 在浏览器扩展环境中使用 Passkey 可能受到限制");
    }

    // 第一步：获取登录信息
    const startResponse = await getPasskeyLoginInfo({ email });

    if (startResponse.code !== 1) {
      throw new Error(startResponse.error || "获取登录信息失败");
    }

    // 解析返回的选项
    let startJson;
    try {
       // 解析返回的选项 - 需要解析两次
    const parsed = JSON.parse(startResponse.result);
    console.log("parsed",parsed);
    
    // 使用专门为扩展环境优化的选项处理
     startJson = normalizeExtensionOptions(parsed);
    } catch (e) {
      throw new Error("后端返回的数据格式错误");
    }

    // 规范化请求选项
    const publicKey = normalizeRequestOptions(startJson);
    
    // 支持多种认证器类型，让用户选择
    if (!publicKey.authenticatorSelection) {
      publicKey.authenticatorSelection = {};
    }
    // 优先使用平台认证器（指纹/面容识别）
    publicKey.authenticatorSelection.authenticatorAttachment = "platform";
    publicKey.authenticatorSelection.userVerification = "preferred";
    
    console.log("登录认证器配置（优先平台认证器）:", publicKey.authenticatorSelection);

    // 第二步：调用 WebAuthn API 获取 assertion
    const assertion = await navigator.credentials.get({ publicKey });

    if (!assertion) {
      throw new Error("用户取消了身份验证");
    }

    const publicKeyAssertion = assertion as PublicKeyCredential;
    const assertionResponse =
      publicKeyAssertion.response as AuthenticatorAssertionResponse;

    // 第三步：组装登录所需的 payload（Base64URL 编码）
    const payload = {
      id: publicKeyAssertion.id,
      rawId: bufferToBase64url(publicKeyAssertion.rawId),
      type: publicKeyAssertion.type,
      clientExtensionResults:
        publicKeyAssertion.getClientExtensionResults?.() ?? {},
      response: {
        authenticatorData: bufferToBase64url(
          assertionResponse.authenticatorData
        ),
        clientDataJSON: bufferToBase64url(assertionResponse.clientDataJSON),
        signature: bufferToBase64url(assertionResponse.signature),
        userHandle: assertionResponse.userHandle
          ? bufferToBase64url(assertionResponse.userHandle)
          : null,
      },
    };

    // 第四步：完成登录
    const finishResponse = await passkeyLogin({
      email,
      credential: JSON.stringify(payload),
    });

    if (finishResponse.code === 1) {
      // 保存token到localStorage
      if (typeof localStorage !== "undefined") {
        const yomoData = JSON.parse(localStorage.getItem("yomo") || "{}");
        yomoData.state = {
          ...yomoData.state,
          token: finishResponse.result.token,
        };
        localStorage.setItem("yomo", JSON.stringify(yomoData));
      }

      return {
        success: true,
        message: "登录成功！",
        token: finishResponse.result.token,
      };
    } else {
      throw new Error(finishResponse.error || "登录失败");
    }
  } catch (error) {
    console.error("Passkey登录错误:", error);
    throw error;
  }
};

// 完整的Passkey注册流程
export const registerPasskey = async (username: string) => {
  try {
    // 环境检测
    console.log("=== Passkey 环境检测 ===");
    const support = checkWebAuthnSupport();
    
    if (!support.hasCredentials) {
      throw new Error("浏览器不支持 WebAuthn API (navigator.credentials 不存在)");
    }
    
    if (!support.hasCreate) {
      throw new Error("浏览器不支持 WebAuthn 创建功能");
    }
    
    if (!support.isSecureContext) {
      throw new Error("Passkey 需要在安全上下文 (HTTPS 或 localhost) 中使用");
    }
    
    if (support.isExtension) {
      console.warn("警告: 在浏览器扩展环境中使用 Passkey 可能受到限制");
    }

    // 第一步：获取注册选项
    const startResponse = await getPasskeyRegisterInfo({ username });

    if (startResponse.code !== 1) {
      throw new Error(startResponse.error || "获取注册信息失败");
    }

    // 解析返回的选项 - 需要解析两次
    const parsed = JSON.parse(startResponse.result);
    console.log("parsed",parsed);
    
    // 使用专门为扩展环境优化的选项处理
    const options = normalizeExtensionOptions(parsed);
    
    console.log("准备创建 Passkey，选项:", options);
    console.log("rp.id:", options.rp?.id);
    console.log("challenge 类型:", typeof options.challenge, options.challenge instanceof ArrayBuffer);
    console.log("user.id 类型:", typeof options.user?.id, options.user?.id instanceof ArrayBuffer);

    // 第二步：创建凭证
    console.log("开始调用 navigator.credentials.create...");
    let credential;
    try {
      // 添加超时机制
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('WebAuthn 操作超时')), 30000);
      });
      
      const createPromise = navigator.credentials.create({
        publicKey: options,
      });
      
      credential = await Promise.race([createPromise, timeoutPromise]);
      console.log("navigator.credentials.create 完成，结果:", credential);

      if (!credential) {
        throw new Error("用户取消了注册");
      }
    } catch (error) {
      console.error("navigator.credentials.create 错误:", error);
      
      // 提供更详细的错误信息
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          throw new Error("用户拒绝了 Passkey 注册请求");
        } else if (error.name === 'InvalidStateError') {
          throw new Error("Passkey 已存在或状态无效");
        } else if (error.name === 'NotSupportedError') {
          throw new Error("当前设备不支持 Passkey");
        } else if (error.name === 'SecurityError') {
          throw new Error("安全错误: 可能需要在 HTTPS 环境下使用");
        } else if (error.name === 'AbortError') {
          throw new Error("操作被中止");
        } else if (error.message === 'WebAuthn 操作超时') {
          throw new Error("WebAuthn 操作超时，可能是扩展环境限制");
        } else {
          throw new Error(`WebAuthn 错误: ${error.name} - ${error.message}`);
        }
      }
      throw error;
    }

    const publicKeyCredential = credential as PublicKeyCredential;
    const attestationResponse =
      publicKeyCredential.response as AuthenticatorAttestationResponse;

    // 第三步：完成注册
    const registerData = {
      id: publicKeyCredential.id,
      type: publicKeyCredential.type,
      rawId: uint8ArrayToBase64(new Uint8Array(publicKeyCredential.rawId)),
      response: {
        attestationObject: uint8ArrayToBase64(
          new Uint8Array(attestationResponse.attestationObject)
        ),
        clientDataJSON: uint8ArrayToBase64(
          new Uint8Array(attestationResponse.clientDataJSON)
        ),
      },
    };

    const finishResponse = await finishPasskeyRegister(registerData);
    if (finishResponse.code === 1) {
      return { success: true, message: "Passkey注册成功！" };
    } else {
      throw new Error(finishResponse.error || "注册失败");
    }
  } catch (error) {
    console.error("Passkey注册错误:", error);
    throw error;
  }
};
