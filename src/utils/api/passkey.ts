import request from "@/utils/request";
import { 
  PasskeyLoginStartParams,
  PasskeyLoginFinishParams,
  PasskeyRegisterStartParams,
  PasskeyRegisterFinishParams
} from "@/modal";
import {
  base64urlToUint8Array,
  uint8ArrayToBase64,
  normalizeRequestOptions,
  bufferToBase64url
} from "@/utils/passkeyUtils";

// 获取Passkey登录信息 (登录前 - user_na/v1)
export const getPasskeyLoginInfo = (params: PasskeyLoginStartParams) => {
  return request<any>({
    url: `http://apisix-dev.sparklayer.xyz:9080/user_na/v1/passkey/login/start`,
    method: "POST",
    data: params,
  });
};

// Passkey登录 (登录前 - user_na/v1)
export const passkeyLogin = (params: PasskeyLoginFinishParams) => {
  return request<any>({
    url: `http://apisix-dev.sparklayer.xyz:9080/user_na/v1/passkey/login/finish`,
    method: "POST",
    data: params,
  });
};

// 获取Passkey注册信息 (登录后 - user_a/v1)
export const getPasskeyRegisterInfo = (params: PasskeyRegisterStartParams) => {
  return request<any>({
    url: `http://apisix-dev.sparklayer.xyz:9080/user_a/v1/passkey/register/start`,
    method: "POST",
    data: params,
  });
};

// 完成Passkey注册 (登录后 - user_a/v1)
export const finishPasskeyRegister = (params: PasskeyRegisterFinishParams) => {
  return request<any>({
    url: `http://apisix-dev.sparklayer.xyz:9080/user_a/v1/passkey/register/finish`,
    method: "POST",
    data: params,
  });
};

// 完整的Passkey登录流程
export const loginWithPasskey = async (email: string) => {
  try {
    // 第一步：获取登录信息
    const startResponse = await getPasskeyLoginInfo({ email });
    
    if (startResponse.code !== 0) {
      throw new Error(startResponse.error || '获取登录信息失败');
    }

    // 解析返回的选项
    let startJson;
    try {
      const parsed = JSON.parse(startResponse.data.result);
      startJson = JSON.parse(parsed.result);
    } catch (e) {
      throw new Error('后端返回的数据格式错误');
    }

    // 规范化请求选项
    const publicKey = normalizeRequestOptions(startJson);

    // 第二步：调用 WebAuthn API 获取 assertion
    const assertion = await navigator.credentials.get({ publicKey });
    
    if (!assertion) {
      throw new Error('用户取消了身份验证');
    }

    const publicKeyAssertion = assertion as PublicKeyCredential;
    const assertionResponse = publicKeyAssertion.response as AuthenticatorAssertionResponse;

    // 第三步：组装登录所需的 payload（Base64URL 编码）
    const payload = {
      id: publicKeyAssertion.id,
      rawId: bufferToBase64url(publicKeyAssertion.rawId),
      type: publicKeyAssertion.type,
      clientExtensionResults: publicKeyAssertion.getClientExtensionResults?.() ?? {},
      response: {
        authenticatorData: bufferToBase64url(assertionResponse.authenticatorData),
        clientDataJSON: bufferToBase64url(assertionResponse.clientDataJSON),
        signature: bufferToBase64url(assertionResponse.signature),
        userHandle: assertionResponse.userHandle
          ? bufferToBase64url(assertionResponse.userHandle)
          : null
      }
    };

    // 第四步：完成登录
    const finishResponse = await passkeyLogin({
      email,
      credential: JSON.stringify(payload)
    });

    if (finishResponse.code === 0) {
      // 保存token到localStorage
      if (typeof localStorage !== 'undefined') {
        const yomoData = JSON.parse(localStorage.getItem("yomo") || "{}");
        yomoData.state = { ...yomoData.state, token: finishResponse.data.result.token };
        localStorage.setItem("yomo", JSON.stringify(yomoData));
      }
      
      return { success: true, message: '登录成功！', token: finishResponse.data.result.token };
    } else {
      throw new Error(finishResponse.error || '登录失败');
    }

  } catch (error) {
    console.error('Passkey登录错误:', error);
    throw error;
  }
};

// 完整的Passkey注册流程
export const registerPasskey = async (username: string) => {
  try {
    // 第一步：获取注册选项
    const startResponse = await getPasskeyRegisterInfo({ username });
    
    if (startResponse.code !== 0) {
      throw new Error(startResponse.error || '获取注册信息失败');
    }

    // 解析返回的选项
    const parsed = JSON.parse(startResponse.data.result);
    const options = parsed.publicKey;

    // 转换二进制字段
    options.challenge = base64urlToUint8Array(options.challenge);
    options.user.id = base64urlToUint8Array(options.user.id);

    // 第二步：创建凭证
    const credential = await navigator.credentials.create({ publicKey: options });
    
    if (!credential) {
      throw new Error('用户取消了注册');
    }

    const publicKeyCredential = credential as PublicKeyCredential;
    const attestationResponse = publicKeyCredential.response as AuthenticatorAttestationResponse;

    // 第三步：完成注册
    const registerData = {
      id: publicKeyCredential.id,
      type: publicKeyCredential.type,
      rawId: uint8ArrayToBase64(new Uint8Array(publicKeyCredential.rawId)),
      response: {
        attestationObject: uint8ArrayToBase64(new Uint8Array(attestationResponse.attestationObject)),
        clientDataJSON: uint8ArrayToBase64(new Uint8Array(attestationResponse.clientDataJSON))
      }
    };

    const finishResponse = await finishPasskeyRegister(registerData);

    if (finishResponse.code === 0) {
      return { success: true, message: 'Passkey注册成功！' };
    } else {
      throw new Error(finishResponse.error || '注册失败');
    }

  } catch (error) {
    console.error('Passkey注册错误:', error);
    throw error;
  }
}; 